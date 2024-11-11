const SHEET_ID = '1YJuEbOwVRzhEJB-nTDFERjBp52B1TwoWmg8Kjp3jQ7s'; // Your Google Sheet ID
const API_KEY = 'AIzaSyDQ5GboWsT5mfAutxQ0vqpzPuqubv-9Z-M'; // Your API Key
const range = 'IEZYTRACK!A1:I'; // Adjust the range to fit your data

const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

async function fetchSheetData() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Check if there is an error in the response
        if (data.error) {
            throw new Error(data.error.message);
        }

        const rows = data.values;

        // If data is found, display the last 6 rows; otherwise, show 'No data found'
        if (rows && rows.length > 1) {
            displayLatestData(rows);
        } else {
            document.querySelector('#data-table tbody').innerHTML = '<tr><td colspan="9">No data found.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching Google Sheets data:', error);
        document.querySelector('#data-table tbody').innerHTML = `<tr><td colspan="9">Error: ${error.message}</td></tr>`;
    }
}

// Display the last 6 rows in a table format
function displayLatestData(data) {
    const tableBody = document.querySelector('#data-table tbody');
    let html = '';

    // Get the last 6 rows (or fewer if less than 6 rows are available)
    const start = Math.max(1, data.length - 6); // Skip the header and get last 6 rows
    const latestRows = data.slice(start).reverse(); // Reverse to show the latest first

    // Loop through the selected rows and build table rows
    latestRows.forEach(row => {
        html += '<tr>';
        html += `<td>${row[0] ? row[0] : 'N/A'}</td>`; // Timestamp
        html += `<td>${row[1] ? row[1] : 'N/A'}</td>`; // Lux
        html += `<td>${row[2] ? row[2] : 'N/A'}</td>`; // Irradiance
        html += `<td>${row[3] ? row[3] : 'N/A'}</td>`; // Temperature
        html += `<td>${row[4] ? row[4] : 'N/A'}</td>`; // Voltage
        html += `<td>${row[5] ? row[5] : 'N/A'}</td>`; // Current
        html += `<td>${row[6] ? row[6] : 'N/A'}</td>`; // Power
        html += `<td>${row[7] ? row[7] : 'N/A'}</td>`; // Azimuth
        html += `<td>${row[8] ? row[8] : 'N/A'}</td>`; // Tilt
        html += '</tr>';
    });

    tableBody.innerHTML = html;

    // Update the last updated time
    const updatedTime = new Date().toLocaleString();
    document.getElementById('updated-time').textContent = `Last updated: ${updatedTime}`;
}

// Fetch data when the page loads
fetchSheetData();

// Fetch data every 60 seconds
setInterval(fetchSheetData, 60000);
