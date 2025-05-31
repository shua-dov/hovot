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
const CLIENT_ID = '1081187113370-ij4og9pfv0u2a79m4egnabnd8ibs41ql.apps.googleusercontent.com'; // **חשוב: החלף במזהה הלקוח שלך**



let debts = [];
let kupot = [];
let selectedDebtIndex = -1; // אינדקס החוב הנבחר לעדכון

// פונקציה להסתרת כל חלקי האפליקציה
function hideAllSections() {
    addDataSection.style.display = 'none';
    updateDataSection.style.display = 'none';
    loadDataSection.style.display = 'none';
    kupaManagementSection.style.display = 'none';
    mainMenu.style.display = 'flex'; // הצגת התפריט הראשי
}

// הצגת חלק "הזנת נתונים"
showAddDataBtn.addEventListener('click', function() {
    hideAllSections();
    addDataSection.style.display = 'block';
});

// הצגת חלק "עדכון נתונים קיימים"
showUpdateDataBtn.addEventListener('click', function() {
    hideAllSections();
    updateDataSection.style.display = 'block';
});

// הצגת חלק "טעינת הנתונים הקיימים"
showLoadDataBtn.addEventListener('click', function() {
    hideAllSections();
    loadDataSection.style.display = 'block';
});

saveDataBtn.addEventListener('click', saveData);
// loadDataBtn.addEventListener('click', function() { // עטוף את loadData בפונקציה אנונימית
//    console.log('כפתור טעינת נתונים נלחץ');
//    loadData();
// });

// טעינת קופות קיימות
function loadKupot() {
    kupaSelect.innerHTML = '<option value="">בחר קופה</option>';
    kupaList.innerHTML = '';
    kupot.forEach(kupaName => {
        const option = document.createElement('option');
        option.value = kupaName;
        option.textContent = kupaName;

        const li = document.createElement('li');
        li.textContent = kupaName;

        kupaSelect.appendChild(option);
        kupaList.appendChild(li);
    });
}

// הוספת קופה חדשה
addKupaBtn.addEventListener('click', function() {
    const newKupaName = newKupaNameInput.value.trim();
    if (newKupaName && !kupot.includes(newKupaName)) {
        kupot.push(newKupaName);
        loadKupot(); // טעינה מחדש של רשימת הקופות בממשק
        newKupaNameInput.value = '';
    }
});

// פונקציה להוספת חוב חדש לטבלה ולמערך הנתונים
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

// פונקציה לסימון שורה שנבחרה בטבלה
function selectDebtRow(event) {
    const clickedRow = event.target.parentNode; // מקבל את אלמנט ה-<tr>
    if (clickedRow.tagName === 'TR' && clickedRow.rowIndex > 0) { // ודא שזו שורת נתונים
        const index = clickedRow.rowIndex - 1; // אינדקס במערך debts

        // הסרת סימון משורה קודמת
        if (selectedDebtIndex !== -1 && debtsTableBody.rows[selectedDebtIndex]) {
            debtsTableBody.rows[selectedDebtIndex].classList.remove('selected');
        }

        clickedRow.classList.add('selected');
        selectedDebtIndex = index;

        // מילוי הטופס ושינוי הכפתור לעריכה
        if (debts[selectedDebtIndex]) {
            const selectedDebt = debts[selectedDebtIndex];
            document.getElementById('debtorName').value = selectedDebt.debtorName;
            document.getElementById('debtAmount').value = selectedDebt.debtAmount;
            document.getElementById('debtDate').value = selectedDebt.debtDate;
            document.getElementById('debtDescription').value = selectedDebt.debtDescription;
            document.getElementById('kupa').value = selectedDebt.kupa;
            submitDebtBtn.textContent = 'שמור שינויים';
        }
    } else {
        // אם לא נבחרה שורה, החזר את הכפתור למצב "הוסף חוב"
        submitDebtBtn.textContent = 'הוסף חוב';
        selectedDebtIndex = -1;
    }
}

// הוספת מאזין אירועים לטבלה כדי לזהות לחיצה על שורה
debtsTable.addEventListener('click', selectDebtRow);

// טיפול באירוע שליחת הטופס (הוספה או שמירת שינויים)
newDebtForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const debtorName = document.getElementById('debtorName').value.trim();
    const debtAmount = parseFloat(document.getElementById('debtAmount').value);
    const debtDate = document.getElementById('debtDate').value.trim();
    const debtDescription = document.getElementById('debtDescription').value.trim();
    const kupa = document.getElementById('kupa').value;

    const isFormValid = debtorName && !isNaN(debtAmount) && debtDate && kupa;

    if (selectedDebtIndex !== -1) {
        // מצב עריכה
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
            selectedDebtIndex = -1; // איפוס הבחירה
            submitDebtBtn.textContent = 'הוסף חוב'; // החזרת הכפתור להוספה
            renderDebtsTable(); // רנדור מחדש של הטבלה
            newDebtForm.reset(); // איפוס הטופס
        } else {
            alert('אנא מלא את כל השדות הנדרשים לעדכון החוב.');
        }
    } else {
        // מצב הוספה
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
            renderDebtsTable(); // רנדור מחדש של הטבלה
            newDebtForm.reset(); // איפוס הטופס
        } else {
            alert('אנא מלא את כל השדות הנדרשים להוספת חוב.');
        }
    }
});

// פונקציה לשמירת הנתונים לקובץ JSON
function saveData() {
    const data = {
        debts: debts, // מערך החובות המעודכן
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

// פונקציה להצגת מערך החובות בטבלה
function renderDebtsTable() {
    console.log('הפונקציה renderDebtsTable רצה');
    console.log('מספר החובות במערך:', debts.length); // בדוק כמה חובות יש במערך
    debtsTableBody.innerHTML = '';
    debts.forEach(debt => {
        console.log('מעבד חוב:', debt); // ודא שאתה עובר על כל חוב
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
        console.log('שורה נוספה לטבלה:', row); // ודא ששורה נוצרת
    });
    console.log('סיימתי את renderDebtsTable');
}

// פונקציה לטעינת נתונים מקובץ JSON
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
                    alert('הנתונים נטענו בהצלחה!');
                } else {
                    alert('קובץ JSON לא תקין או חסר נתוני חובות.');
                }
            } catch (error) {
                alert('שגיאה בפענוח קובץ ה-JSON.');
                console.error('שגיאה בפענוח JSON:', error);
            }
        };
        reader.readAsText(file);
    } else {
        alert('אנא בחר קובץ JSON לטעינה.');
    }
}

// טעינת קופות בעת טעינת הדף
loadKupot();

// הסתרת כל החלקים מלבד התפריט הראשי בהתחלה
hideAllSections();
mainMenu.style.display = 'flex';

// הוספת CSS קטן לעיצוב השורה הנבחרת (הוסף לתוך תגית <style> ב-HTML)
const style = document.createElement('style');
style.textContent = `
    .selected {
        background-color: yellow !important;
    }
`;
document.head.appendChild(style);
const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');


const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // **חשוב: החלף במזהה הגיליון שלך**
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPE
    }).then(function () {
        // האזנה לשינויים במצב ההתחברות
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);

        // טיפול במצב ההתחברות הראשוני
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        // קישור כפתורי התחברות/התנתקות
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;

        // אם מחוברים, טען את הנתונים
        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            loadDataFromSheet();
        }
    });
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        console.log('משתמש מחובר.');
        loadDataFromSheet(); // טען נתונים אוטומטית כשמתחברים
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        console.log('משתמש לא מחובר.');
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

// פונקציה לטעינת נתונים מהגיליון האלקטרוני
function loadDataFromSheet() {
    gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet1!A1:F', // שנה את הטווח בהתאם למבנה הנתונים שלך
    }).then(function(response) {
        const range = response.result;
        if (range.values && range.values.length > 0) {
            debts = []; // איפוס מערך החובות הנוכחי
            const headers = range.values[0]; // שורת הכותרות
            for (let i = 1; i < range.values.length; i++) {
                const row = range.values[i];
                const debt = {};
                for (let j = 0; j < headers.length; j++) {
                    debt[headers[j]] = row[j];
                }
                debts.push(debt);
            }
            renderDebtsTable(); // רנדור הטבלה עם הנתונים מהגיליון
        } else {
            console.log('לא נמצאו נתונים בגיליון.');
        }
    }, function(error) {
        console.error('שגיאה בטעינת נתונים מהגיליון:', error);
    });
}

// פונקציה לשמירת נתונים לגיליון האלקטרוני (תצטרך ליישם אותה בהמשך)
function saveDataToSheet() {
    // ...
}

// טען את ה-API של Google Client


