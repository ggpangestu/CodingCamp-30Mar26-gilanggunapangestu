//Parameter
let currentSort = "default";
let currentFilter = "";
let currentMonth = null;
let currentYear = null;
const spendingLimit = 50;
feather.replace();

// ==========================================================ADD TRANSACTION

// ambil element
const form = document.getElementById("formTransaction");
const totalBalance = document.getElementById("totalBalance");

// ambil data dari localStorage
function getTransactions() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
}

// simpan ke localStorage
function saveTransactions(data) {
    localStorage.setItem("transactions", JSON.stringify(data));
}

// hitung total balance
function hitungTotal() {
    const data = getTransactions();

    const total = data.reduce((sum, item) => {
        return sum + item.amount;
    }, 0);

    totalBalance.innerText = "$" + total.toFixed(2);
}

// submit form
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("itemName").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value.toLowerCase();
    const dateInput = document.getElementById("date").value;

    // validasi sederhana
	if (!name || isNaN(amount) || !category || !dateInput) {
		Swal.fire({
			icon: 'warning',
			title: 'Form belum lengkap',
			text: 'Isi semua field!',
			timer: 1500,
			showConfirmButton: false
		});
		return;
	}

    const newData = {
        id: Date.now(),
        name,
        amount,
        category,
        date: new Date(dateInput).toISOString()
    };

    
    const transactions = getTransactions();
    transactions.push(newData);
    
    saveTransactions(transactions);
    
	Swal.fire({
		icon: 'success',
		title: 'Berhasil!',
		text: 'Transaksi ditambahkan',
		timer: 1500,
		showConfirmButton: false
	});

    const container = document.getElementById("transactionList");
    container.scrollTop = 0;
    
    form.reset();

    refreshUI();
    
    renderYearOptions()
});

hitungTotal();

// ====================================================================CONTROL CATEGORY

function getCategories() {
    let categories = JSON.parse(localStorage.getItem("categories"));

    if (!categories) {
        categories = ["food", "transport", "fun"];
        localStorage.setItem("categories", JSON.stringify(categories));
    }

    return categories;
}

function saveCategories(data) {
    localStorage.setItem("categories", JSON.stringify(data));
}

function renderCategoryList() {
    const list = document.getElementById("categoryList");
    const categories = getCategories();

    list.innerHTML = "";

    if (categories.length === 0) {
        list.innerHTML = `
            <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
                Belum ada kategori
            </p>
        `;
        return;
    }

    categories.forEach(cat => {
        list.innerHTML += `
            <div class="
                flex justify-between items-center
                bg-gray-100 dark:bg-gray-700 
                p-2 rounded 
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition-all duration-300
            ">
                <span class="text-gray-800 dark:text-gray-100">
                    ${formatCategory(cat)}
                </span>

                <button 
                    onclick="deleteCategory('${cat}')" 
                    class="text-red-500 dark:text-red-400 text-sm hover:underline transition"
                >
                    Delete
                </button>
            </div>
        `;
    });
}

function addCategory() {
    const input = document.getElementById("newCategory");
    const value = input.value.trim().toLowerCase();

    if (!value) {
        Swal.fire({
            icon: 'warning',
            title: 'Input kosong',
            text: 'Masukkan nama kategori!',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    let categories = getCategories();

    if (categories.includes(value)) {
        Swal.fire({
            icon: 'error',
            title: 'Duplikat',
            text: 'Kategori sudah ada!',
            timer: 1500,
            showConfirmButton: false
        });
        return;
    }

    categories.push(value);
    saveCategories(categories);

    input.value = "";

    renderCategoryList();

    renderFilterCategories();

    renderCategories();

    renderTransactions();

    renderChart();

    Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori ditambahkan',
        timer: 1200,
        showConfirmButton: false
    });
}

function deleteCategory(cat) {
    Swal.fire({
        title: 'Yakin hapus?',
        text: `Kategori "${cat}" akan dihapus`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {

            Swal.fire({
                title: 'Menghapus...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // simulasi delay (biar terlihat loading)
            await new Promise(resolve => setTimeout(resolve, 800));

            let categories = getCategories();
            categories = categories.filter(c => c !== cat);
            saveCategories(categories);

            renderCategoryList();

            renderFilterCategories();

            renderCategories();

            renderTransactions();

            renderChart();

            Swal.fire({
                icon: 'success',
                title: 'Terhapus!',
                text: 'Kategori berhasil dihapus',
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
}

function renderCategories() {
    const select = document.getElementById("category");
    const categories = getCategories();

    select.innerHTML = `<option value="">Pilih kategori</option>`;

    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${formatCategory(cat)}</option>`;
    });
}

function formatCategory(cat) {
    return cat.replace(/\b\w/g, c => c.toUpperCase());
}

function getAllCategories() {
    const active = getCategories();
    const fromTransactions = getTransactions().map(t => t.category);

    return [...new Set([...active, ...fromTransactions])];
}

// ================================================================MODAL MANAGE CATEGORIES

function openModal() {
    const modal = document.getElementById("categoryModal");
    const content = document.getElementById("modalContent");

    modal.classList.remove("hidden");

    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.classList.add("opacity-100");

        content.classList.remove("scale-95");
        content.classList.add("scale-100");
        resetModal("categoryModal");
    }, 10);
}

function closeModal() {
    const modal = document.getElementById("categoryModal");
    const content = document.getElementById("modalContent");

    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");

    content.classList.remove("scale-100");
    content.classList.add("scale-95");

    setTimeout(() => {
        modal.classList.add("hidden");
        resetModal("categoryModal");
    }, 300);
}

function resetModal(modalId) {
    const modal = document.getElementById(modalId);

    modal.querySelectorAll("input").forEach(input => input.value = "");
    // modal.querySelectorAll("select").forEach(select => select.value = "");
}

//=========================================================TRANSACTION LIST
function renderTransactions() {
    const container = document.getElementById("transactionList");
    // let data = getTransactions();
    let data = getFilteredTransactions();

    container.innerHTML = "";

    // DEFAULT = newest first
    if (currentSort === "default") {
        data = [...data].reverse();
    }

    // SORT
    if (currentSort === "asc") {
        data = [...data].sort((a, b) => a.amount - b.amount);
    }

    if (currentSort === "desc") {
        data = [...data].sort((a, b) => b.amount - a.amount);
    }

    if (data.length === 0) {
        container.innerHTML = `
            <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
                Belum ada transaksi
            </p>
        `;
        return;
    }

    data.forEach((t) => {
        const isHigh = t.amount > spendingLimit;
        const active = getCategories();
        const isArchived = !active.includes(t.category);
        const formattedDate = t.date ? formatDate(t.date) : "No date";

        const isToday = formattedDate === "Today";
        const isYesterday = formattedDate === "Yesterday";

        container.innerHTML += `
            <div class="
                bg-gray-50 dark:bg-gray-700 
                border border-gray-200 dark:border-gray-600
                rounded-lg p-3 flex justify-between items-start
                hover:bg-gray-100 dark:hover:bg-gray-600
                transition-all duration-300
                ${isHigh ? 'border-red-500 bg-red-50 dark:bg-red-900/30' : ''}
            ">

                <!-- LEFT -->
                <div>
                    <p class="font-medium text-gray-800 dark:text-gray-100">
                        ${t.name}
                    </p>

                    <!-- DATE -->
                    <p class="
                        text-xs mt-0.5
                        ${isToday 
                            ? 'text-green-500 dark:text-green-400 font-medium' 
                            : isYesterday 
                                ? 'text-yellow-500 dark:text-yellow-400' 
                                : 'text-gray-500 dark:text-gray-400'}
                    ">
                        ${formattedDate}
                    </p>

                    <!-- CATEGORY TAG -->
                    <span class="
                        inline-block mt-1 text-xs px-2 py-1 rounded
                        ${isArchived 
                            ? 'bg-gray-200 text-gray-500 dark:bg-gray-600 dark:text-gray-300' 
                            : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'}
                    ">
                        ${formatCategory(t.category)} ${isArchived ? '(archived)' : ''}
                    </span>
                    
                    <span class="
                        inline-block mt-1 text-xs px-2 py-1 rounded
                        ${isHigh 
                            ? 'bg-red-100 text-red-500 dark:bg-red-900/40 dark:text-red-300' 
                            : ''}
                    ">
                        ${isHigh ? 'High' : ''}
                    </span>

                </div>

                <!-- RIGHT -->
                <div class="text-right">
                    <p class="
                        font-semibold 
                        ${isHigh 
                            ? 'text-red-500 dark:text-red-400' 
                            : 'text-blue-500 dark:text-blue-400'}
                    ">
                        $${t.amount.toFixed(2)}
                    </p>

                    <button 
                        onclick="deleteTransaction(${t.id})"
                        class="text-red-500 dark:text-red-400 text-xs mt-1 hover:underline"
                    >
                        Delete
                    </button>
                </div>

            </div>
        `;
    });
    updateMonthLabel();
}

function deleteTransaction(id) {
    Swal.fire({
        title: 'Yakin hapus?',
        text: 'Transaksi akan dihapus',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal'
    }).then(async (result) => {
        if (result.isConfirmed) {

            // loading
            Swal.fire({
                title: 'Menghapus...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // simulasi delay biar kelihatan smooth
            await new Promise(resolve => setTimeout(resolve, 800));

            let data = getTransactions();

            data = data.filter(t => t.id !== id);

            saveTransactions(data);

            refreshUI();

            // success
            Swal.fire({
                icon: 'success',
                title: 'Terhapus!',
                text: 'Transaksi berhasil dihapus',
                timer: 1200,
                showConfirmButton: false
            });
        }
    });
}


function updateSortButton() {
    const btn = document.getElementById("sortButton");
    
    if (currentSort === "default") {
        btn.innerText = "↓↑";
        btn.classList.remove("bg-blue-500", "text-white");
        btn.classList.add("bg-gray-200");
    }
    
    if (currentSort === "asc") {
        btn.innerText = "↑ Asc";
        btn.classList.remove("bg-gray-200");
        btn.classList.add("bg-blue-500", "text-white");
    }
    
    if (currentSort === "desc") {
        btn.innerText = "↓ Desc";
        btn.classList.remove("bg-gray-200");
        btn.classList.add("bg-blue-500", "text-white");
    }
}

function toggleSort() {
    const btn = document.getElementById("sortButton");

    if (currentSort === "default") {
        currentSort = "asc";
    } else if (currentSort === "asc") {
        currentSort = "desc";
    } else {
        currentSort = "default";
    }

    updateSortButton();
    renderTransactions();
}


function applyFilter() {
    currentFilter = document.getElementById("filterCategory").value;
    refreshUI();
}

function renderFilterCategories() {
    const select = document.getElementById("filterCategory");

    const active = getCategories();
    const all = getAllCategories();

    select.innerHTML = `<option value="">All Category</option>`;

    all.forEach(cat => {
        const isArchived = !active.includes(cat);

        select.innerHTML += `
            <option value="${cat}">
                ${formatCategory(cat)} ${isArchived ? '(archived)' : ''}
            </option>
        `;
    });
}

function resetCategoryFilter() {
    currentFilter = "";

    const select = document.getElementById("filterCategory");
    if (select) {
        select.value = "";
    }
}

function getFilteredTransactions() {
    let data = getTransactions();

    // FILTER CATEGORY
    if (currentFilter) {
        data = data.filter(t => t.category === currentFilter);
    }

    // FILTER YEAR
    if (currentYear) {
        data = data.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === currentYear;
        });
    }

    // FILTER MONTH
    if (currentMonth) {
        data = data.filter(t => {
            const d = new Date(t.date);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            return key === currentMonth;
        });
    }

    return data;
}
//========================================CHART

function getCategorySummary() {

    let data = getFilteredTransactions();

    const summary = {};

    data.forEach(t => {
        if (!summary[t.category]) {
            summary[t.category] = 0;
        }
        summary[t.category] += t.amount;
    });

    return summary;
}

let chart; // global biar bisa update

function renderChart() {
    const ctx = document.getElementById("pieChart");

    const summary = getCategorySummary();

    const labels = Object.keys(summary);
    const values = Object.values(summary);

    const active = getCategories();

    const labelsFormatted = labels.map(cat => {
        const isArchived = !active.includes(cat);
        return formatCategory(cat) + (isArchived ? " (archived)" : "");
    });

    if (values.length === 0) {
        if (chart) {
            chart.destroy();
        }
        return;
    }

    if (chart) {
        chart.destroy();
    }

    const colors = labels.map((_, i) => {
        const hue = (i * 60) % 360;
        return `hsl(${hue}, 70%, 60%)`;
    });

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labelsFormatted,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || "";
                            const value = context.raw || 0;

                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);

                            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}


//=============================================================Dark/light mode toggle
function toggleTheme() {
    const html = document.documentElement;
    const toggle = document.getElementById("themeToggle");
    const circle = document.getElementById("toggleCircle");
    const icon = document.getElementById("themeIcon");

    const isDark = html.classList.toggle("dark");

    // warna background toggle
    if (isDark) {
        toggle.classList.remove("bg-gray-300");
        toggle.classList.add("bg-blue-500");

        circle.classList.add("translate-x-7");

        icon.setAttribute("data-feather", "moon");
    } else {
        toggle.classList.remove("bg-blue-500");
        toggle.classList.add("bg-gray-300");

        circle.classList.remove("translate-x-7");

        icon.setAttribute("data-feather", "sun");
    }

    // refresh icon
    feather.replace();

    // simpan ke localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function loadTheme() {
    const saved = localStorage.getItem("theme");
    const html = document.documentElement;

    if (saved === "dark") {
        html.classList.add("dark");

        const toggle = document.getElementById("themeToggle");
        const circle = document.getElementById("toggleCircle");
        const icon = document.getElementById("themeIcon");

        toggle.classList.remove("bg-gray-300");
        toggle.classList.add("bg-blue-500");

        circle.classList.add("translate-x-7");

        icon.setAttribute("data-feather", "moon");

        feather.replace();
    }
}

function selectMonth(monthKey) {
    currentMonth = monthKey;
    refreshUI();
}

function resetMonth() {
    currentMonth = null;
    resetCategoryFilter();
    refreshUI();
}

//============================================================SUMMARY
// function setDefaultDate() {
//     const today = new Date().toISOString().split("T")[0];
//     document.getElementById("date").value = today;
// }

function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();

    // reset jam biar bandingkan hanya tanggal
    const d1 = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const d2 = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffTime = d2 - d1;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";

    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function getCurrentMonthKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    return `${year}-${month}`;
}

function getMonthlySummary() {
    let data = getTransactions();

    // FILTER CATEGORY
    if (currentFilter) {
        data = data.filter(t => t.category === currentFilter);
    }

    // FILTER YEAR
    if (currentYear) {
        data = data.filter(t => {
            const d = new Date(t.date);
            return d.getFullYear() === currentYear;
        });
    }

    const summary = {};

    data.forEach(t => {
        if (!t.date) return;

        const date = new Date(t.date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!summary[key]) {
            summary[key] = {
                total: 0,
                count: 0
            };
        }

        summary[key].total += t.amount;
        summary[key].count += 1;
    });

    return summary;
}

function updateMonthLabel() {
    const el = document.getElementById("currentMonthLabel");
    const data = getFilteredTransactions();

    if (data.length === 0) {
        el.innerText = "";
        return;
    }

    if (currentMonth) {
        const [year, month] = currentMonth.split("-");
        const date = new Date(year, month - 1);

        el.innerText = date.toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric"
        });
        return;
    }

    if (currentYear) {
        el.innerText = currentYear;
    }
}

function formatMonth(key) {
    const [year, month] = key.split("-");
    const date = new Date(year, month - 1);

    return date.toLocaleDateString("id-ID", {
        month: "long",
        year: "numeric"
    });
}

function renderMonthlySummary() {
    const container = document.getElementById("monthlySummary");
    const summary = getMonthlySummary();

    const sorted = Object.entries(summary).sort((a, b) => {
        return new Date(b[0]) - new Date(a[0]);
    });

    container.innerHTML = "";

    if (sorted.length === 0) {
        container.innerHTML = `
            <p class="text-gray-500 dark:text-gray-400 text-sm text-center">
                Belum ada data bulanan
            </p>
        `;
        return;
    }

    sorted.forEach(([key, value]) => {

        const isActive = key === currentMonth;

        container.innerHTML += `
            <div 
                onclick="selectMonth('${key}')"
                class="
                    cursor-pointer
                    p-4 rounded-lg
                    transition-all duration-300
                    ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-400' 
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}
                "
            >
                <div class="flex justify-between items-center">

                    <!-- LEFT -->
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-100">
                            ${formatMonth(key)}
                        </p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            ${value.count} transaksi
                        </p>
                    </div>

                    <!-- RIGHT -->
                    <p class="text-blue-500 dark:text-blue-400 font-bold text-lg">
                        $${value.total.toFixed(2)}
                    </p>

                </div>
            </div>
        `;
    });
}

function renderYearOptions() {
    const select = document.getElementById("yearSelect");
    const data = getTransactions();

    const years = [...new Set(
        data
            .filter(t => t.date) //
            .map(t => new Date(t.date).getFullYear())
    )].sort((a, b) => b - a);

    select.innerHTML = ``;

    years.forEach(year => {
        select.innerHTML += `
            <option value="${year}" ${year === currentYear ? "selected" : ""}>
                ${year}
            </option>
        `;
    });
}

function changeYear() {
    currentYear = parseInt(document.getElementById("yearSelect").value);
    currentMonth = null;
    resetCategoryFilter();
    refreshUI();
}

function refreshUI() {
    renderTransactions();
    renderMonthlySummary();
    renderChart();
    hitungTotal();
}

function init() {
    renderCategories();
    renderCategoryList();
    renderFilterCategories();
    hitungTotal();
    currentYear = new Date().getFullYear();
    currentMonth = null;
    renderTransactions();
    renderChart();
    loadTheme();
    renderMonthlySummary();
    updateMonthLabel();
    renderYearOptions();
    updateSortButton();
}

init();