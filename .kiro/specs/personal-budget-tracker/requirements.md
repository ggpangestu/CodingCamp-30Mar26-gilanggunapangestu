# Requirements Document

## Introduction

A personal budget tracker web app built with HTML, CSS, and Vanilla JavaScript. The app runs entirely in the browser with no backend, using Local Storage for persistence. Users can input transactions, categorize spending, view monthly summaries, sort and filter transactions, and visualize category breakdowns via pie charts. The app supports custom categories and is designed to be clean, fast, and easy to use.

## Glossary

- **App**: The personal budget tracker web application
- **Transaction**: A single income or expense entry with an amount, category, description, and date
- **Category**: A label grouping transactions (e.g., Food, Transport, Entertainment)
- **Custom_Category**: A user-defined category added beyond the default set
- **Budget**: The total spending limit set by the user for a given month
- **Monthly_Summary**: An aggregated view of all transactions within a calendar month
- **Pie_Chart**: A circular chart visualizing spending distribution across categories
- **Transaction_List**: The rendered list of all transactions for the selected month
- **Local_Storage**: The browser's Local Storage API used for all data persistence
- **Category_Breakdown**: Per-category totals and percentages for a selected month

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to add a transaction with an amount, category, description, and date, so that I can track my income and expenses.

#### Acceptance Criteria

1. THE App SHALL provide a form with fields for amount, category, description, and date to input a transaction.
2. WHEN the user submits the transaction form with all required fields filled, THE App SHALL save the transaction to Local_Storage and display it in the Transaction_List.
3. IF the user submits the transaction form with any required field empty, THEN THE App SHALL display an inline validation error and prevent saving.
4. IF the user enters a non-numeric or zero value in the amount field, THEN THE App SHALL display a validation error indicating the amount must be a positive number.
5. WHEN a transaction is saved, THE App SHALL update the Monthly_Summary and Pie_Chart for the relevant month without requiring a page reload.

---

### Requirement 2: View Transaction List

**User Story:** As a user, I want to see a list of all my transactions for a selected month, so that I can review my spending history.

#### Acceptance Criteria

1. THE App SHALL display a Transaction_List showing each transaction's description, category, amount, and date.
2. WHEN the user selects a month, THE App SHALL filter the Transaction_List to show only transactions within that calendar month.
3. WHEN no transactions exist for the selected month, THE App SHALL display an empty state message indicating no transactions are recorded.
4. THE App SHALL display the total income, total expenses, and net balance for the selected month above the Transaction_List.

---

### Requirement 3: Delete a Transaction

**User Story:** As a user, I want to delete a transaction, so that I can remove incorrect or unwanted entries.

#### Acceptance Criteria

1. THE App SHALL provide a delete control for each transaction in the Transaction_List.
2. WHEN the user activates the delete control for a transaction, THE App SHALL remove the transaction from Local_Storage and update the Transaction_List, Monthly_Summary, and Pie_Chart immediately.

---

### Requirement 4: Category Breakdown with Pie Chart

**User Story:** As a user, I want to see a pie chart of my spending by category for a selected month, so that I can understand where my money is going.

#### Acceptance Criteria

1. THE App SHALL render a Pie_Chart visualizing the Category_Breakdown for the currently selected month.
2. WHEN the selected month changes, THE App SHALL update the Pie_Chart to reflect the transactions in the new month.
3. THE Pie_Chart SHALL display each category as a distinct color segment with a label showing the category name and its percentage of total spending.
4. WHEN no expense transactions exist for the selected month, THE App SHALL display a placeholder message in place of the Pie_Chart.
5. THE App SHALL display a Category_Breakdown list alongside the Pie_Chart showing each category's total amount and percentage.

---

### Requirement 5: Monthly Summary View

**User Story:** As a user, I want to view a monthly summary of my income, expenses, and net balance, so that I can assess my financial health for any given month.

#### Acceptance Criteria

1. THE App SHALL display a Monthly_Summary panel showing total income, total expenses, and net balance for the selected month.
2. WHEN the user navigates between months, THE App SHALL recalculate and display the Monthly_Summary for the newly selected month.
3. THE App SHALL display the net balance with a visual indicator distinguishing a surplus (income > expenses) from a deficit (expenses > income).

---

### Requirement 6: Set a Monthly Budget

**User Story:** As a user, I want to set a total budget for a month, so that I can track whether my spending stays within my limit.

#### Acceptance Criteria

1. THE App SHALL provide an input to set a Budget amount for the selected month.
2. WHEN the user sets a Budget, THE App SHALL save it to Local_Storage and display the remaining budget (Budget minus total expenses) in the Monthly_Summary.
3. WHEN total expenses exceed the Budget, THE App SHALL display a visual warning indicating the budget has been exceeded.
4. IF the user enters a non-numeric or negative value as the Budget, THEN THE App SHALL display a validation error and reject the input.

---

### Requirement 7: Sort Transactions

**User Story:** As a user, I want to sort my transactions by amount or category, so that I can find and analyze entries more easily.

#### Acceptance Criteria

1. THE App SHALL provide sort controls allowing the user to sort the Transaction_List by amount (ascending or descending) or by category (alphabetical).
2. WHEN the user selects a sort option, THE App SHALL reorder the Transaction_List accordingly without modifying the underlying data in Local_Storage.
3. WHEN the selected month changes, THE App SHALL reset the sort order to the default (date descending).

---

### Requirement 8: Custom Categories

**User Story:** As a user, I want to add custom categories, so that I can organize transactions in a way that fits my personal spending habits.

#### Acceptance Criteria

1. THE App SHALL provide a set of default categories (e.g., Food, Transport, Entertainment, Health, Shopping, Other).
2. THE App SHALL provide a control to add a Custom_Category with a user-defined name.
3. WHEN the user adds a Custom_Category, THE App SHALL save it to Local_Storage and make it available in the category selector for new transactions.
4. IF the user attempts to add a Custom_Category with a name that already exists (case-insensitive), THEN THE App SHALL display a validation error and prevent the duplicate.
5. IF the user attempts to add a Custom_Category with an empty name, THEN THE App SHALL display a validation error and prevent saving.

---

### Requirement 9: Data Persistence

**User Story:** As a user, I want my transactions, categories, and budget settings to persist across browser sessions, so that I do not lose my data when I close or refresh the page.

#### Acceptance Criteria

1. THE App SHALL save all transactions, Custom_Category entries, and Budget values to Local_Storage on every create, update, or delete operation.
2. WHEN the App loads, THE App SHALL read all transactions, categories, and budget settings from Local_Storage and restore the previous state.
3. WHEN Local_Storage is unavailable or returns a parse error, THE App SHALL display a non-blocking error message and initialize with an empty state.

---

### Requirement 10: Responsive and Accessible UI

**User Story:** As a user, I want the app to be usable on different screen sizes and accessible via keyboard, so that I can use it on any device.

#### Acceptance Criteria

1. THE App SHALL render correctly on viewport widths from 320px to 1920px without horizontal scrolling or overlapping elements.
2. THE App SHALL load and become interactive within 2 seconds on a standard broadband connection.
3. THE App SHALL use a single CSS file located at css/style.css and a single JavaScript file located at js/app.js.
4. THE App SHALL use semantic HTML elements and ARIA labels where applicable to support keyboard navigation.
