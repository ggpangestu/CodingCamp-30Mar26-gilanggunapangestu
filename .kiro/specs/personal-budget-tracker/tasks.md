# Implementation Plan: Personal Budget Tracker

## Overview

Implement a client-side personal budget tracker as a single-page app using HTML, CSS, and Vanilla JavaScript. All logic lives in `js/app.js` (organized as storage, state, model, view, controller, chart modules), all styles in `css/style.css`, and tests in `test/index.js` with a browser-based runner at `test/index.html`.

## Tasks

- [ ] 1. Set up project structure and HTML skeleton
  - Create `index.html` with semantic markup: transaction form (amount, type, category, description, date), month navigator, summary panel, pie chart canvas, transaction list, category manager, budget input, and theme toggle
  - Create `css/style.css` with base styles, CSS variables for light/dark themes, and responsive layout (320px–1920px)
  - Create `js/app.js` with module stubs: `storage`, `state`, `model`, `view`, `controller`, `chart`
  - Add `data-theme` attribute support on `<html>` and ARIA labels on all interactive elements
  - _Requirements: 10.1, 10.3, 10.4_

- [ ] 2. Implement storage and state modules
  - [ ] 2.1 Implement `storage.*` functions: `load(key, fallback)` and `save(key, value)` wrapping Local Storage with try/catch for unavailability and JSON parse errors
    - On `SecurityError`, show a non-blocking toast and fall back to in-memory state
    - On JSON parse error, log warning and return the fallback value
    - _Requirements: 9.1, 9.3_
  - [ ] 2.2 Implement `state.*`: initialize `AppState` from Local Storage on app load, expose getters/setters that call `storage.save` on every mutation
    - Keys: `pbt_transactions`, `pbt_categories`, `pbt_budgets`, `pbt_theme`
    - Default categories: Food, Transport, Entertainment, Health, Shopping, Other
    - _Requirements: 9.2, 8.1_
  - [ ]* 2.3 Write property test for persistence round-trip (Property 16)
    - **Property 16: Persistence Round-Trip**
    - **Validates: Requirements 9.1, 9.2**

- [ ] 3. Implement model module (pure functions)
  - [ ] 3.1 Implement transaction validators: `model.validateTransaction(fields)` — rejects empty fields (1.3) and non-positive/non-numeric amounts (1.4); returns `{ valid, errors }`
    - _Requirements: 1.3, 1.4_
  - [ ]* 3.2 Write property test for invalid transaction rejected on empty fields (Property 2)
    - **Property 2: Invalid Transaction Rejected on Empty Fields**
    - **Validates: Requirements 1.3**
  - [ ]* 3.3 Write property test for non-positive amount rejected (Property 3)
    - **Property 3: Non-Positive Amount Rejected**
    - **Validates: Requirements 1.4**
  - [ ] 3.4 Implement `model.filterByMonth(transactions, monthKey)` — returns only transactions whose `date` starts with `"YYYY-MM"`
    - _Requirements: 2.2_
  - [ ]* 3.5 Write property test for month filter correctness (Property 5)
    - **Property 5: Month Filter Correctness**
    - **Validates: Requirements 2.2**
  - [ ] 3.6 Implement `model.computeSummary(transactions, budget)` — returns `{ totalIncome, totalExpenses, netBalance, remainingBudget, budgetExceeded }`
    - _Requirements: 2.4, 5.1, 5.3, 6.2, 6.3_
  - [ ]* 3.7 Write property test for summary totals correctness (Property 4)
    - **Property 4: Summary Totals Correctness**
    - **Validates: Requirements 2.4, 5.1**
  - [ ]* 3.8 Write property test for net balance surplus/deficit indicator (Property 8)
    - **Property 8: Net Balance Surplus/Deficit Indicator**
    - **Validates: Requirements 5.3**
  - [ ]* 3.9 Write property test for budget save and remaining budget calculation (Property 9)
    - **Property 9: Budget Save and Remaining Budget Calculation**
    - **Validates: Requirements 6.2**
  - [ ]* 3.10 Write property test for budget exceeded warning (Property 10)
    - **Property 10: Budget Exceeded Warning**
    - **Validates: Requirements 6.3**
  - [ ] 3.11 Implement `model.validateBudget(value)` — rejects non-numeric, zero, or negative values
    - _Requirements: 6.4_
  - [ ]* 3.12 Write property test for non-positive budget rejected (Property 11)
    - **Property 11: Non-Positive Budget Rejected**
    - **Validates: Requirements 6.4**
  - [ ] 3.13 Implement `model.categoryBreakdown(transactions)` — returns `{ category, total, pct }[]` for expense transactions only
    - _Requirements: 4.3, 4.5_
  - [ ]* 3.14 Write property test for category breakdown percentages (Property 7)
    - **Property 7: Category Breakdown Percentages**
    - **Validates: Requirements 4.3, 4.5**
  - [ ] 3.15 Implement `model.sortTransactions(transactions, sortBy)` — sorts by `amount-asc`, `amount-desc`, or `category-asc` without mutating the input array
    - _Requirements: 7.1, 7.2_
  - [ ]* 3.16 Write property test for sort order correctness and storage immutability (Property 12)
    - **Property 12: Sort Order Correctness and Storage Immutability**
    - **Validates: Requirements 7.2**
  - [ ] 3.17 Implement `model.validateCategory(name, existingCategories)` — rejects empty/whitespace names and case-insensitive duplicates
    - _Requirements: 8.4, 8.5_
  - [ ]* 3.18 Write property test for invalid category name rejected (Property 15)
    - **Property 15: Invalid Category Name Rejected**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 4. Checkpoint — Ensure all model tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement transaction CRUD and list view
  - [ ] 5.1 Implement `controller.addTransaction`: validate form fields (amount, type, category, description, date) via `model.validateTransaction`, generate a UUID, save to `state.transactions`, persist via `storage.save`, then re-render affected sections
    - Show inline field errors on validation failure; reset form on success
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [ ]* 5.2 Write property test for valid transaction save round-trip (Property 1)
    - **Property 1: Valid Transaction Save Round-Trip**
    - **Validates: Requirements 1.2, 9.1**
  - [ ] 5.3 Implement `controller.deleteTransaction(id)`: remove from `state.transactions`, persist, re-render list, summary, and pie chart
    - _Requirements: 3.1, 3.2_
  - [ ]* 5.4 Write property test for delete transaction round-trip (Property 6)
    - **Property 6: Delete Transaction Round-Trip**
    - **Validates: Requirements 3.2**
  - [ ] 5.5 Implement `view.renderTransactionList(transactions)`: render `<ul>` of transaction cards with description, category badge, amount (color-coded by type), date, and delete button; show empty-state message when list is empty
    - _Requirements: 2.1, 2.3, 3.1_
  - [ ]* 5.6 Write unit tests for transaction list rendering
    - Test empty state message when no transactions exist for the month
    - Test delete button presence on each rendered card
    - _Requirements: 2.3, 3.1_
  - [ ]* 5.7 Write property test for summary updates after transaction save (Property 17)
    - **Property 17: Summary Updates After Transaction Save**
    - **Validates: Requirements 1.5**

- [ ] 6. Implement month navigator and sort controls
  - [ ] 6.1 Implement `controller.navigateMonth(direction)`: update `state.activeMonth`, reset `state.sortBy` to `"date-desc"`, re-render list, summary, and pie chart
    - _Requirements: 2.2, 5.2, 7.3_
  - [ ]* 6.2 Write property test for sort reset on month change (Property 13)
    - **Property 13: Sort Reset on Month Change**
    - **Validates: Requirements 7.3**
  - [ ] 6.3 Implement sort controls: wire sort select/buttons to `model.sortTransactions` and re-render the list without modifying Local Storage
    - _Requirements: 7.1, 7.2_
  - [ ]* 6.4 Write unit test for sort controls
    - Test that Local Storage data is unchanged after sorting
    - _Requirements: 7.2_

- [ ] 7. Implement summary panel and budget input
  - [ ] 7.1 Implement `view.renderSummary(summary)`: display total income, total expenses, net balance with surplus/deficit indicator, budget amount, remaining budget, and budget-exceeded warning
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 6.3_
  - [ ] 7.2 Implement `controller.setBudget(value)`: validate via `model.validateBudget`, save `MonthlyBudget` to state and Local Storage, re-render summary
    - Show inline error on invalid input
    - _Requirements: 6.1, 6.2, 6.4_

- [ ] 8. Implement pie chart and category breakdown
  - [ ] 8.1 Implement `chart.draw(canvas, breakdown)`: draw pie chart segments on `<canvas>` using the 2D Canvas API, one distinct color per category; show placeholder text "No expense data for this month" when `breakdown` is empty
    - _Requirements: 4.1, 4.2, 4.4_
  - [ ] 8.2 Implement `view.renderBreakdownLegend(breakdown)`: render category name, total amount, and percentage alongside the pie chart; update when selected month changes
    - _Requirements: 4.3, 4.5_
  - [ ]* 8.3 Write unit test for pie chart placeholder
    - Test that placeholder message is shown when no expense transactions exist for the month
    - _Requirements: 4.4_

- [ ] 9. Implement custom category manager
  - [ ] 9.1 Implement `controller.addCategory(name)`: validate via `model.validateCategory`, save to `state.categories` and Local Storage, update the category `<select>` in the transaction form
    - Show inline error on invalid input
    - _Requirements: 8.2, 8.3, 8.4, 8.5_
  - [ ]* 9.2 Write property test for custom category save round-trip (Property 14)
    - **Property 14: Custom Category Save Round-Trip**
    - **Validates: Requirements 8.3**
  - [ ]* 9.3 Write unit tests for category manager
    - Test that exactly 6 default categories are present on first load
    - _Requirements: 8.1_

- [ ] 10. Implement dark/light mode toggle
  - [ ] 10.1 Implement theme toggle: on click, flip `data-theme` attribute on `<html>` between `"light"` and `"dark"`, save preference to Local Storage under `pbt_theme`, restore on app load
    - _Requirements: 9.1, 9.2, 10.4_
  - [ ]* 10.2 Write unit test for dark/light mode toggle
    - Test that toggling saves preference to Local Storage and applies `data-theme` attribute
    - _Requirements: 9.1_

- [ ] 11. Set up test runner
  - [ ] 11.1 Update `test/index.html` to load fast-check from CDN and `test/index.js`; expose `window.model` in `js/app.js` when `?test=1` query param is present
    - _Requirements: 10.3_
  - [ ] 11.2 Implement all property-based tests and unit tests in `test/index.js` using fast-check, with tag comments `// Feature: personal-budget-tracker, Property N: <text>`
    - Minimum 100 runs per property test
    - _Requirements: 10.3_

- [ ] 12. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Model functions must be pure (no DOM/Local Storage side effects) to enable testing without a browser environment
- Property tests validate universal correctness; unit tests cover concrete edge cases and UI states
- The `window.model` exposure in test mode is the bridge between `js/app.js` and `test/index.js`
