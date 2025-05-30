document.addEventListener('DOMContentLoaded', async () => {
    try {
        const settings = await window.electronAPI.loadUserSettings();
        console.log('Settings loaded on start:', settings);

        // Fetch the alerts data from the preload API
        const alertsData = await window.electronAPI.readAlertsData();
        console.log('Fetched alerts data:', alertsData);

        if (alertsData && Array.isArray(alertsData.titles) &&
            Array.isArray(alertsData.data) && Array.isArray(alertsData.time)) {

            const alertsContainer = document.getElementById('alertsContainer');
            alertsContainer.innerHTML = ''; 

            alertsData.titles.forEach((title, index) => {
                const data = alertsData.data && alertsData.data[index] ? alertsData.data[index] : 'Unknown Data';
                const time = alertsData.time && alertsData.time[index] ? alertsData.time[index] : 'Unknown time';

                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert';

                const alertHtml = `
                    <h1>${title}</h1>
                    <h2>${data}</h2>
                    <h3>${time}</h3>
                `;
                alertDiv.innerHTML = alertHtml;

                alertsContainer.appendChild(alertDiv);

                // Sanitize the class name to replace spaces with underscores
                const sanitizedData = data.replace(/\s+/g, '_');
                alertDiv.classList.add(sanitizedData); // Add sanitized class name
                console.log(alertDiv.classList); // Log to check classes
            });
        } else {
            console.error('Invalid alerts data format:', alertsData);
        }
    } catch (error) {
        console.error('An error occurred while loading alerts data:', error);
    }

    // Search function to filter alerts
// Search function to filter alerts
function search() {
    const query = searchBar.value.toLowerCase();
    const alerts = document.querySelectorAll('.alert');
    let hasMatches = false; // Track if any alerts match the query

    alerts.forEach(alert => {
        const alertText = alert.textContent.toLowerCase();
        if (alertText.includes(query)) {
            alert.style.display = 'flex'; // Show the alert if it matches the query
            hasMatches = true; // Mark that we found a match
        } else {
            alert.style.display = 'none'; // Hide the alert if it doesn't match
        }
    });

    // Clear any previous "no alerts found" message
    const noAlertDiv = document.getElementById('noAlertMessage');
    if (noAlertDiv) {
        noAlertDiv.remove();
    }

    // If no matches were found, show a "no alerts found" message
    if (!hasMatches) {
        const noAlert = `
            <h1>לא נמצאה התראה במיקום זה</h1>
            <h2>נסה לחפש במיקום אחר</h2>
        `;
        const alertDiv = document.createElement('div');
        alertDiv.id = 'noAlertMessage'; // Assign an ID to the no-alert message
        alertDiv.innerHTML = noAlert;
        alertDiv.classList.add('alert');
        alertsContainer.appendChild(alertDiv); // Append the "no alerts found" message
    }
}


    const searchBar = document.getElementById('search');
    const searchBtn = document.getElementById('searchBtn');

    // Event binding for Enter key in search bar
    searchBar.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            search();
        }
    });

    // Event binding for search button
    searchBtn.addEventListener('click', search);
});
