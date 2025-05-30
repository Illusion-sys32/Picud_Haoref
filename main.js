const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { on } = require('events');
const iplocation = require('iplocation').default; // Import the iplocation package
const { spawn } = require('child_process');
// File paths for settings and data files
const settingsPath = path.join(app.getPath('userData'), 'UserSettings.json');
console.log(settingsPath);
const alertsFilePath = path.join(__dirname, 'alerts_data.json');
const IntresPointFilePath = path.join(__dirname, 'IntresPoint.json');

// Constants for retries and delays
const MAX_RETRIES = 3; // Maximum number of retries for location retrieval
const RETRY_DELAY = 2000; // Delay between retries in milliseconds

// Function to get the public IP address
async function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let ip = '';
      res.on('data', (chunk) => {
        ip += chunk;
      });
      res.on('end', () => {
        console.log('Public IP retrieved:', ip); // Log the IP address
        resolve(ip);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to get the user's location based on their IP
async function getUserLocation(ip) {
  const settings = loadSettings();
  if (settings.UserSetLocationBySelf === true) {
    console.log('User has manually set their location. Skipping auto-location.');
    let attempt = 0;
    const maxAttempts = 3;
    let delay = RETRY_DELAY;
  
    while (attempt < maxAttempts) {
      try {
        if (!ip) {
          throw new Error('Failed to retrieve a valid IP address');
        }
        const location = await iplocation(ip);
        console.log('User Location:', location);
  
        const city = location.city || 'Unknown';
        const country = location.country.name || 'Unknown';
  
        settings.autoLocation = { ip, city, country };
        saveSettings(settings);
        console.log('User location saved successfully.');
        return settings.autoLocation;
      } catch (error) {
        console.error('Failed to get user location:', error);
        if (error.response && error.response.status === 429) {
          console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          delay *= 2; // Double the delay for the next retry
        } else {
          throw error;
        }
      }
    }
    return;
  }

  let attempt = 0;
  const maxAttempts = 5;
  let delay = RETRY_DELAY;

  while (attempt < maxAttempts) {
    try {
      if (!ip) {
        throw new Error('Failed to retrieve a valid IP address');
      }
      const location = await iplocation(ip);
      console.log('User Location:', location);

      const city = location.city || 'Unknown';
      const country = location.country.name || 'Unknown';

      settings.UserLocation = { ip, city, country };
      saveSettings(settings);
      console.log('User location saved successfully.');
      return settings.UserLocation;
    } catch (error) {
      console.error('Failed to get user location:', error);
      if (error.response && error.response.status === 429) {
        console.log(`Rate limit exceeded. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        delay *= 2; // Double the delay for the next retry
      } else {
        throw error;
      }
    }
  }
  console.error('Exceeded maximum retry attempts for getting user location.');
}


// Function to save settings to the settings file
function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2)); // Pretty print JSON with 2 spaces
    console.log('Settings saved successfully.');
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

// Function to load settings from the settings file
function loadSettings() {
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath));
      console.log('Settings loaded successfully:', settings);
      return settings;
    } catch (error) {
      console.error('Failed to parse settings file:', error);
      return {}; // Return default settings if parsing fails
    }
  } else {
    console.log('Settings file not found, using default settings.');
    return {}; // Return default settings if file doesn't exist
  }
}

// Function to read alerts data
function readAlertsData() {
  try {
    if (fs.existsSync(alertsFilePath)) {
      const rawData = fs.readFileSync(alertsFilePath, 'utf-8');
      return JSON.parse(rawData);
    } else {
      console.error('alerts_data.json file not found');
      return null;
    }
  } catch (error) {
    console.error('Failed to read alerts data:', error);
    return null;
  }
}

// Function to get the number of alerts
function getAlertsNumber() {
  try {
    const data = readAlertsData();
    return data ? data.data.length : 0;
  } catch (error) {
    console.error('Failed to get alerts number:', error);
    return 0;
  }
}

ipcMain.handle('load-auto-location', () => {
  if (fs.existsSync(settingsPath)) {
    try {
      const rawData = fs.readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(rawData);
      
      // Check if 'autoLocation' key exists in settings
      if (settings.autoLocation) {
        return settings.autoLocation; // Return the value of 'autoLocation'
      } else {
        console.log('Auto location setting not found');
        return null; // Return null or some default value
      }
    } catch (error) {
      console.error('Failed to parse settings file:', error);
      return null; // Return null in case of parse error
    }
  } else {
    console.log('Settings file not found');
    return null; // Return null if the settings file does not exist
  }
});

// Handle IPC requests from the renderer process
ipcMain.handle('load-user-settings', () => loadSettings());
ipcMain.on('save-user-settings', (event, settings) => {
  try {
    saveSettings(settings);
  } catch (error) {
    console.error('Failed to save user settings via IPC:', error);
  }
});

ipcMain.handle('read-alerts-data', () => readAlertsData());
ipcMain.handle('get-alert-number', () => getAlertsNumber());
ipcMain.handle('get-interest-points', async () => {
  try {
    if (fs.existsSync(IntresPointFilePath)) {
      const rawData = fs.readFileSync(IntresPointFilePath, 'utf-8');
      return JSON.parse(rawData);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to load interest points:', error);
    return [];
  }
});

ipcMain.handle('load-intres-points', () => {
  try {
    if (fs.existsSync(IntresPointFilePath)) {
      const rawData = fs.readFileSync(IntresPointFilePath, 'utf-8');
      return JSON.parse(rawData);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Failed to load interest points:', error);
    return [];
  }
});

ipcMain.on('remove-intres-point', (event, placeName) => {
  fs.readFile(IntresPointFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading interest points file:', err);
      return;
    }
    let places = JSON.parse(data);
    places = places.filter(place => place.name !== placeName);
    fs.writeFile(IntresPointFilePath, JSON.stringify(places, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Error writing interest points file:', err);
      }
    });
  });
});

ipcMain.handle('get-user-location', async () => {
  try {
    const ip = await getPublicIP(); // Get the user's public IP
    if (ip) {
      const location = await iplocation(ip); // Get location based on IP
      return location;
    } else {
      console.error('Failed to retrieve public IP address');
      return null;
    }
  } catch (error) {
    console.error('Failed to get user location:', error);
    return null;
  }
});

ipcMain.handle('add-intres-point', (event, intres) => {
  try {
    let existingData = [];
    if (fs.existsSync(IntresPointFilePath)) {
      const rawData = fs.readFileSync(IntresPointFilePath, 'utf-8');
      if (rawData.trim() !== '') {
        existingData = JSON.parse(rawData);
      }
    }
    existingData.push(intres);
    fs.writeFileSync(IntresPointFilePath, JSON.stringify(existingData, null, 2));
    console.log('Interest point added successfully.');
  } catch (error) {
    console.error('Error adding interest point:', error);
  }
});

// Create the main application window


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function logToFile(message) {
  const logMessage = `${new Date().toISOString()} - ${message}\n`;
  fs.appendFile(path.join(__dirname, 'Log.txt'), logMessage, { encoding: 'utf8' }, (err) => {
      if (err) {
          console.error('Failed to write to log file:', err);
      }
  });
}
async function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 800,
    icon: path.join(__dirname, 'picod_img.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  const pythonScriptPath = path.join(__dirname, 'python_scripts', 'main.py');
  console.log(pythonScriptPath);
  const pythonExecutablePath = 'C:\\Users\\USER\\AppData\\Local\\Programs\\Python\\Python312\\python.exe'; // Adjust this to your actual Python path

  try {
    pythonProcess = spawn(pythonExecutablePath, [pythonScriptPath]);

    pythonProcess.stdout.on('data', (data) => {
      const output = data.toString().trim();  // Trim to remove extra spaces/newlines
      
      try {
        const alerts = JSON.parse(output); // Attempt to parse the JSON output
        console.log(`Parsed Alerts: ${JSON.stringify(alerts)}`);
        logToFile(`Received alerts: ${JSON.stringify(alerts)}`);
      } catch (err) {
        const errorMessage = `Error parsing alert data: ${err.message}`;
        console.error(errorMessage);
        logToFile(errorMessage);
      }
    });





    pythonProcess.on('error', (err) => {
      console.error('Failed to start subprocess.', err);
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
    });

    // Wait for 500 milliseconds (0.5 seconds)
    await delay(500);

    win.loadFile('src/index.html');
    win.webContents.openDevTools();
  } catch (err) {
    console.error('Error spawning the Python process:', err);
  }
}

app.whenReady().then(() => {
  createWindow();

  getPublicIP().then(ip => {
    getUserLocation(ip); // Get user location after window creation
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Clean up Python process when quitting
app.on('before-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
    console.log('Python script terminated');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
