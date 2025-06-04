// DOM elements
const showAddDataBtn = document.getElementById('showAddData');
const showUpdateDataBtn = document.getElementById('showUpdateData');
const showLoadDataBtn = document.getElementById('showLoadData');

const addDataSection = document.getElementById('addDataSection');
const updateDataSection = document.getElementById('updateDataSection');
const loadDataSection = document.getElementById('loadDataSection');
const kupaManagementSection = document.getElementById('kupaManagementSection');
const mainMenu = document.querySelector('.main-menu');

const newDebtForm = document.getElementById('newDebtForm');
const debtsTableBody = document.getElementById('debtsTableBody');
const kupaSelect = document.getElementById('kupa');
const kupaList = document.getElementById('kupaList');
const addKupaBtn = document.getElementById('addKupaBtn');
const newKupaNameInput = document.getElementById('newKupaName');
const saveDataBtn = document.getElementById('saveDataBtn');
const loadDataInput = document.getElementById('loadDataInput');
const loadDataBtn = document.getElementById('loadDataBtn');
const submitDebtBtn = document.querySelector('#newDebtForm button[type="submit"]');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTNrNlet_lZaamV7YoXXEv0DEEs7JhW19ocAfcE85C_V5QUBMhMD7he2vUGiNk6Luo9Q/exec';


// Google API related constants
const CLIENT_ID = '1081187113370-ij4og9pfv0u2a79m4egnabnd8ibs41ql.apps.googleusercontent.com'; // Replace with your actual Client ID
const SPREADSHEET_ID = '1_nL6cIRQYHqq0JdwvWS-NDQ8RxDbmDapJfbKlUn6hU4'; // Replace with your actual Spreadsheet ID
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Scope for Google Sheets API

// Google Auth buttons (ensure these IDs exist in your index.html)
const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

// Initialize the Google API client library
function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPE
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

        // Handle the initial sign-in state.
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        // Bind button click handlers.
        if (authorizeButton) { // Check if button exists before binding
            authorizeButton.onclick = handleAuthClick;
        }
        if (signoutButton) { // Check if button exists before binding
            signoutButton.onclick = handleSignoutClick;
        }

        // If signed in, load data from the sheet
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            loadDataFromSheet();
        }
    }).catch((error) => {
        console.error('Error initializing gapi.client:', error);
    });
}

// Update UI based on sign-in status
function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        if (authorizeButton) authorizeButton.style.display = 'none';
        if (signoutButton) signoutButton.style.display = 'block';
        console.log('User signed in.');
        loadDataFromSheet(); // Load data automatically when signed in
    } else {
        if (authorizeButton) authorizeButton.style.display = 'block';
        if (signoutButton) signoutButton.style.display = 'none';
        console.log('User not signed in.');
    }
}

// Handle sign-in button click
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Handle sign-out button click
function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

// Function to load data from the Google Sheet
function loadDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:F', // Adjust the range according to your data structure
    }).then(function(response) {
        const range = response.result;
        if (range.values && range.values.length > 0) {
            debts = []; // Reset the current debts array
            const headers = range.values[0]; // Header row
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                const debt = {};
                for (let j = 0; j < headers.length; j++) {
                    debt[headers[j]] = row[j];
                }
                debts.push(debt);
            }
            renderDebtsTable(); // Render the table with data from the sheet
        } else {
            console.log('No data found in the sheet.');
        }
    }, function(error) {
        console.error('Error loading data from sheet:', error);
    });
}

// Function to save data to the Google Sheet (needs implementation)
function saveDataToSheet() {
    // Implement logic to save 'debts' array back to the Google Sheet
    // This will likely involve gapi.client.sheets.spreadsheets.values.update or .append
    // Example:
    // const valuesToUpdate = debts.map(debt => [debt.debtorName, debt.debtAmount, debt.debtDate, debt.debtDescription, debt.kupa, debt.status]);
    // gapi.client.sheets.spreadsheets.values.update({
    //     spreadsheetId: SPREADSHEET_ID,
    //     range: 'Sheet1!A2', // Start from row 2 to avoid overwriting headers
    //     valueInputOption: 'RAW',
    //     resource: {
    //         values: valuesToUpdate
    //     }
    // }).then((response) => {
    //     console.log('Data saved to sheet:', response);
    //     alert('Data saved to Google Sheet successfully!');
    // }).catch((error) => {
    //     console.error('Error saving data to sheet:', error);
    // });
}

// Application state variables
let debts = [];
let kupot = [];
let selectedDebtIndex = -1; // Selected debt index for update

// Function to hide all sections of the application
function hideAllSections() {
    addDataSection.style.display = 'none';
    updateDataSection.style.display = 'none';
    loadDataSection.style.display = 'none';
    kupaManagementSection.style.display = 'none';
    mainMenu.style.display = 'flex'; // Show the main menu
}

// Show "Add Data" section
if (showAddDataBtn) {
    showAddDataBtn.addEventListener('click', function() {
        hideAllSections();
        addDataSection.style.display = 'block';
    });
}

// Show "Update Existing Data" section
if (showUpdateDataBtn) {
    showUpdateDataBtn.addEventListener('click', function() {
        hideAllSections();
        updateDataSection.style.display = 'block';
    });
}

// Show "Load Existing Data" section
if (showLoadDataBtn) {
    showLoadDataBtn.addEventListener('click', function() {
        hideAllSections();
        loadDataSection.style.display = 'block';
    });
}

// Save data button click handler
if (saveDataBtn) {
    saveDataBtn.addEventListener('click', saveData);
}

// Add new kupa button click handler
if (addKupaBtn) {
    addKupaBtn.addEventListener('click', function() {
        const newKupaName = newKupaNameInput.value.trim();
        if (newKupaName && !kupot.includes(newKupaName)) {
            kupot.push(newKupaName);
            loadKupot(); // Reload the kupa list in the UI
            newKupaNameInput.value = '';
        }
    });
}

// Add debt to table (for local data management)
function addDebtToTable(debt) {
    const row = debtsTableBody.insertRow();
    row.insertCell().textContent = debt.debtorName;
    row.insertCell().textContent = debt.debtAmount;
    row.insertCell().textContent = debt.debtDate;
    row.insertCell().textContent = debt.debtDescription;
    row.insertCell().textContent = debt.kupa;
    row.insertCell().textContent = debt.status || 'פתוח';
    debts.push(debt);
}

// Function to select a row in the table
function selectDebtRow(event) {
    const clickedRow = event.target.parentNode; // Get the <tr> element
    if (clickedRow.tagName === 'TR' && clickedRow.rowIndex > 0) { // Ensure it's a data row
        const index = clickedRow.rowIndex - 1; // Index in the debts array

        // Remove selection from previous row
        if (selectedDebtIndex !== -1 && debtsTableBody.rows[selectedDebtIndex]) {
            debtsTableBody.rows[selectedDebtIndex].classList.remove('selected');
        }

        clickedRow.classList.add('selected');
        selectedDebtIndex = index;

        // Populate the form and change button to edit mode
        if (debts[selectedDebtIndex]) {
            const selectedDebt = debts[selectedDebtIndex];
            document.getElementById('debtorName').value = selectedDebt.debtorName;
            document.getElementById('debtAmount').value = selectedDebt.debtAmount;
            document.getElementById('debtDate').value = selectedDebt.debtDate;
            document.getElementById('debtDescription').value = selectedDebt.debtDescription;
            document.getElementById('kupa').value = selectedDebt.kupa;
            submitDebtBtn.textContent = 'Save Changes';
        }
    } else {
        // If no row is selected, revert button to "Add Debt"
        submitDebtBtn.textContent = 'Add Debt';
        selectedDebtIndex = -1;
    }
}

// Add event listener to the table to detect row clicks (ensure debtsTable exists)
const debtsTable = document.getElementById('debtsTable'); // Make sure this ID exists in your HTML
if (debtsTable) {
    debtsTable.addEventListener('click', selectDebtRow);
}


// Handle form submission (add or save changes)
if (newDebtForm) {
    newDebtForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const debtorName = document.getElementById('debtorName').value.trim();
        const debtAmount = parseFloat(document.getElementById('debtAmount').value);
        const debtDate = document.getElementById('debtDate').value.trim();
        const debtDescription = document.getElementById('debtDescription').value.trim();
        const kupa = document.getElementById('kupa').value;

        const isFormValid = debtorName && !isNaN(debtAmount) && debtDate && kupa;

        if (selectedDebtIndex !== -1) {
            // Edit mode
            if (isFormValid) {
                const updatedDebt = {
                    debtorName: debtorName,
                    debtAmount: debtAmount,
                    debtDate: debtDate,
                    debtDescription: debtDescription,
                    kupa: kupa,
                    status: debts[selectedDebtIndex]?.status || 'פתוח'
                };
                debts[selectedDebtIndex] = updatedDebt;
                selectedDebtIndex = -1; // Reset selection
                submitDebtBtn.textContent = 'Add Debt'; // Revert button to add
                renderDebtsTable(); // Re-render the table
                newDebtForm.reset(); // Reset the form
            } else {
                alert('Please fill in all required fields to update the debt.');
            }
        } else {
            // Add mode
            if (isFormValid) {
                const newDebt = {
                    debtorName: debtorName,
                    debtAmount: debtAmount,
                    debtDate: debtDate,
                    debtDescription: debtDescription,
                    kupa: kupa,
                    status: 'פתוח'
                };
                addDebtToTable(newDebt);
                renderDebtsTable(); // Re-render the table
                newDebtForm.reset(); // Reset the form
            } else {
                alert('Please fill in all required fields to add a debt.');
            }
        }
    });
}

// Function to save data to a JSON file (local download)
function saveData() {
    const data = {
        debts: debts, // Updated debts array
        kupot: kupot
    };
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'debts_data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to display the debts array in the table
function renderDebtsTable() {
    console.log('renderDebtsTable function running');
    console.log('Number of debts in array:', debts.length); // Check how many debts are in the array
    debtsTableBody.innerHTML = '';
    debts.forEach(debt => {
        console.log('Processing debt:', debt); // Verify each debt is processed
        const row = debtsTableBody.insertRow();
        const nameCell = row.insertCell();
        nameCell.textContent = debt.debtorName;
        const amountCell = row.insertCell();
        amountCell.textContent = debt.debtAmount;
        const dateCell = row.insertCell();
        dateCell.textContent = debt.debtDate;
        const descriptionCell = row.insertCell();
        descriptionCell.textContent = debt.debtDescription;
        const kupaCell = row.insertCell();
        kupaCell.textContent = debt.kupa;
        const statusCell = row.insertCell();
        statusCell.textContent = debt.status || 'פתוח';
        console.log('Row added to table:', row); // Verify row is created
    });
    console.log('renderDebtsTable finished');
}

// Function to load data from a JSON file (local upload)
function loadData() {
    const file = loadDataInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (data && Array.isArray(data.debts)) {
                    debts = data.debts;
                    if (data.kupot && Array.isArray(data.kupot)) {
                        kupot = data.kupot;
                        loadKupot();
                    }
                    renderDebtsTable();
                    alert('Data loaded successfully!');
                } else {
                    alert('Invalid JSON file or missing debt data.');
                }
            } catch (error) {
                alert('Error parsing JSON file.');
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    } else {
        alert('Please select a JSON file to load.');
    }
}

// Load existing kupot
function loadKupot() {
    if (kupaSelect) { // Check if kupaSelect exists before manipulating
        kupaSelect.innerHTML = '<option value="">Select Kupa</option>';
    }
    if (kupaList) { // Check if kupaList exists before manipulating
        kupaList.innerHTML = '';
    }
    kupot.forEach(kupaName => {
        const option = document.createElement('option');
        option.value = kupaName;
        option.textContent = kupaName;

        const li = document.createElement('li');
        li.textContent = kupaName;

        if (kupaSelect) kupaSelect.appendChild(option);
        if (kupaList) kupaList.appendChild(li);
    });
}


// Initial setup on page load
loadKupot(); // Load kupot when the page loads
hideAllSections(); // Hide all sections except the main menu initially
if (mainMenu) { // Check if mainMenu exists before manipulating
    mainMenu.style.display = 'flex';
}

// Add CSS for selected row (ensure this is in your HTML <style> tag or a separate CSS file)
const style = document.createElement('style');
style.textContent = `
    .selected {
        background-color: yellow !important;
    }
`;
document.head.appendChild(style);

// Add event listener for loadDataBtn (if it exists)
if (loadDataBtn) {
    loadDataBtn.addEventListener('click', function() {
        console.log('Load Data button clicked');
        loadData();
    });
}
function checkServerStatus() {
  fetch(SCRIPT_URL) // שים כאן את הקישור המלא שלך
    .then(response => {
      if (!response.ok) throw new Error("HTTP error " + response.status);
      return response.text(); // אם אתה מחזיר JSON, השתמש במקום זאת: return response.json();
    })
    .then(data => {
      console.log("השרת מחזיר:", data);
      // כאן אפשר לעדכן את הדף או להציג הודעה למשתמש
      document.getElementById("status").textContent = "השרת מחובר ✔";
    })
    .catch(error => {
      console.error("שגיאה בתקשורת עם השרת:", error);
      document.getElementById("status").textContent = "בעיה בחיבור לשרת ✖";
    });
}
