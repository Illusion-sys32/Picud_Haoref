console.log('Main page script is running.');

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load the existing settings
        const settings = await window.electronAPI.loadUserSettings();
        console.log('Settings loaded on start:', settings);

        // Fetch the number of alerts
        const alertNum = await window.electronAPI.getAlertNumber();
        console.log('Number of alerts:', alertNum);

        // Update the alert number in the HTML
        const alertNumberElement = document.querySelector('.sitoetion_count'); // Use querySelector to match the class
        if (alertNumberElement) {
            alertNumberElement.textContent = alertNum; // Set the text content to alertNum
        } else {
            console.error('Element with class sitoetion_count not found.');
        }

    } catch (error) {
        console.error('An error occurred while loading alerts data:', error);
    }
});
