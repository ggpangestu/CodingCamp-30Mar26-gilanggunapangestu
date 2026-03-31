// ADD TRANSACTION

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

    totalBalance.innerText = "$" + total;
}

// submit form
form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("itemName").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;

    // validasi sederhana
	if (!name || !amount || !category) {
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
        name,
        amount,
        category
    };

	Swal.fire({
		icon: 'success',
		title: 'Berhasil!',
		text: 'Transaksi ditambahkan',
		timer: 1500,
		showConfirmButton: false
	});

    const transactions = getTransactions();
    transactions.push(newData);

    saveTransactions(transactions);

    hitungTotal();

    form.reset();
});

hitungTotal();

// END ADD TRANSACTION

// CONTROL CATEGORY

function openModal() {
    document.getElementById("categoryModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("categoryModal").classList.add("hidden");
}

function getCategories() {
    return JSON.parse(localStorage.getItem("categories")) || [
        "Food",
        "Transport",
        "Fun"
    ];
}

function saveCategories(data) {
    localStorage.setItem("categories", JSON.stringify(data));
}

function renderCategoryList() {
    const list = document.getElementById("categoryList");
    const categories = getCategories();

    list.innerHTML = "";

    categories.forEach(cat => {
        list.innerHTML += `
            <div class="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>${cat}</span>
                <button onclick="deleteCategory('${cat}')" class="text-red-500">
                    Delete
                </button>
            </div>
        `;
    });
}

function addCategory() {
    const input = document.getElementById("newCategory");
    const value = input.value.trim();

    if (!value) return;

    let categories = getCategories();

    if (categories.includes(value)) {
        alert("Category sudah ada");
        return;
    }

    categories.push(value);
    saveCategories(categories);

    input.value = "";

    renderCategoryList();
    renderCategories(); // update dropdown
}

function deleteCategory(cat) {
    let categories = getCategories();

    categories = categories.filter(c => c !== cat);

    saveCategories(categories);

    renderCategoryList();
    renderCategories();
}

function renderCategories() {
    const select = document.getElementById("category");
    const categories = getCategories();

    select.innerHTML = `<option value="">Pilih kategori</option>`;

    categories.forEach(cat => {
        select.innerHTML += `<option value="${cat}">${cat}</option>`;
    });
}

function init() {
    renderCategories();
    renderCategoryList();
    hitungTotal();
}

init();

// MODAL MANAGE CATEGORY

function openModal() {
    const modal = document.getElementById("categoryModal");
    const content = document.getElementById("modalContent");

    modal.classList.remove("hidden");

    // kasih delay kecil biar animasi jalan
    setTimeout(() => {
        modal.classList.remove("opacity-0");
        modal.classList.add("opacity-100");

        content.classList.remove("scale-95");
        content.classList.add("scale-100");
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
    }, 300);
}