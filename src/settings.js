console.log('Renderer process is running.');

document.addEventListener('DOMContentLoaded', async () => {
    const alert_in_your_location = document.getElementById('alert_in_your_location');
    const alert_in_your_intres = document.getElementById('alert_in_your_intres');
    const notifay_in_intres = document.getElementById('notifay_in_intres');
    const dark_theam = document.getElementById('dark_theam');

    // Load the existing settings from the JSON file
    const settings = await window.electronAPI.loadUserSettings();
    console.log('Loaded settings:', settings);

    // Set the checkboxes based on the loaded settings
    alert_in_your_location.checked = settings.alert_in_your_location ?? false;
    alert_in_your_intres.checked = settings.alert_in_your_intres ?? false;
    notifay_in_intres.checked = settings.notifay_in_intres ?? false;
    dark_theam.checked = settings.dark_theam ?? false;

    // Function to save settings when they change
    const saveSetting = () => {
        const newSettings = {
            alert_in_your_location: alert_in_your_location.checked,
            alert_in_your_intres: alert_in_your_intres.checked,
            notifay_in_intres: notifay_in_intres.checked,
            dark_theam: dark_theam.checked,
        };

        console.log('Saving settings:', newSettings);
        window.electronAPI.saveUserSettings(newSettings);
    };

    // Add event listeners to save settings on change
    alert_in_your_location.addEventListener('change', saveSetting);
    alert_in_your_intres.addEventListener('change', saveSetting);
    notifay_in_intres.addEventListener('change', saveSetting);
    dark_theam.addEventListener('change', saveSetting);
});
