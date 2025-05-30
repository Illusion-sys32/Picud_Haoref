import json
import logging
from datetime import datetime, timedelta

# Setup logging
logging.basicConfig(
    filename='Log.txt',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',
)

# File paths
ALERTS_FILE = 'alerts_data.json'
INTEREST_POINTS_FILE = 'IntresPoint.json'
USER_SETTINGS_FILE = 'C:/Users/USER/AppData/Roaming/picod-horef/UserSettings.json'
def load_json(filename):
    """Load and return data from a JSON file."""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        logging.error(f"Error: {filename} not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {filename}. Ensure it's valid JSON.")
        logging.error(f"Error: Failed to decode {filename}. Ensure it's valid JSON.")
        return []

def is_alert_recent(alert_time_str):
    """Check if the alert is within the last 10 minutes."""
    try:
        # Convert the alert time string to a datetime object
        alert_time = datetime.strptime(alert_time_str, "%Y-%m-%d %H:%M:%S")  # Adjust format as needed
        current_time = datetime.now()

        # Check if the alert time is within the last 10 minutes
        time_difference = current_time - alert_time
        return time_difference <= timedelta(minutes=10)
    except ValueError:
        print(f"Error: Invalid time format {alert_time_str}")
        logging.error(f"Error: Invalid time format {alert_time_str}")
        return False

def save_json(data, filename):
    """Save data to a JSON file."""
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            json.dump(data, file, ensure_ascii=False, indent=4)
    except Exception as e:
        print(f"Error: Could not save {filename}. Reason: {str(e)}")
        logging.error(f"Error: Could not save {filename}. Reason: {str(e)}")

def check_alerts():
    """Check if any places in IntresPoint.json are in alerts_data.json and return matching alerts."""
    alert_return = []
    
    # Load data from the JSON files
    alerts = load_json(ALERTS_FILE)
    interest_points = load_json(INTEREST_POINTS_FILE)

    if not alerts or not interest_points:
        print("One or both of the JSON files are empty or invalid.")
        logging.warning("One or both of the JSON files are empty or invalid.")
        return 'error'

    alert_data = alerts.get('data', [])  # List of alert locations
    alert_titles = alerts.get('titles', [])  # List of alert titles
    alert_times = alerts.get('time', [])  # List of alert timestamps
    
    # Create a mapping of places to titles and times
    alert_info = {place: [] for place in alert_data}
    for place, title, time in zip(alert_data, alert_titles, alert_times):
        if place in alert_info:
            alert_info[place].append((title, time))
    
    # Iterate over interest points
    for interest_point in interest_points:
        place_name = interest_point.get('name')  # Get place name
        
        if place_name in alert_info:
            for title, time in alert_info[place_name]:
                if is_alert_recent(time):
                    print(f"Recent alert in {place_name}: {title} at {time}")
                    logging.info(f"Recent alert in {place_name}: {title} at {time}")
                    alert_list = [place_name, title, time]
                    alert_return.append(alert_list)
                else:
                    print(f"Alert in {place_name} at {time} is older than 10 minutes.")
                    logging.info(f"Alert in {place_name} at {time} is older than 10 minutes.")
        else:
            print(f"{place_name}: no alerts.")
            logging.info(f"{place_name}: no alerts.")

    return alert_return

def check_user_location_alert():
    """Check for alerts matching the user's location and handle important alerts."""
    # Define alert variables
    global importent_alert, alert_is
    importent_alert = False  # Initialize as False
    alert_is = None

    # Load user settings and alerts
    user_settings = load_json(USER_SETTINGS_FILE)
    alerts = load_json(ALERTS_FILE)

    # Log user settings for debugging
    logging.debug(f"User settings: {user_settings}")

    # Extract user city from settings
    user_location = user_settings.get('UserLocation', {})
    if not isinstance(user_location, dict):
        logging.error("UserLocation is not a dictionary or not found.")
        return

    user_city = user_location.get('city', '').strip()

    if not user_city or not alerts:
        logging.warning("No user location set or alerts data is missing.")
        return

    # Check if there are any alerts for the user's city
    num_alerts = len(alerts.get('data', []))
    for i in range(num_alerts):
        alert_city = alerts['data'][i].strip()  # Get the alert city
        if alert_city == user_city:
            alert_title = alerts['titles'][i].strip()
            alert_time = alerts['time'][i].strip()

            # Check if the alert is recent
            if is_alert_recent(alert_time):
                logging.info(f"Recent alert for user city {user_city}: {alert_city}, {alert_title}")
                importent_alert = True
                alert_is = (alert_city, alert_title)
                return

    # If no alert is found, clear the important flag
    user_settings['importantAlert'] = False
    save_json(user_settings, USER_SETTINGS_FILE)
    logging.info(f"No recent alerts for {user_city}. Cleared the important flag.")

def main():
    """Main function to check alerts and user location alerts."""
    check_user_location_alert()
    recent_alerts = check_alerts()

    if recent_alerts:
        logging.info(f"Recent alerts found: {recent_alerts}")
    else:
        logging.info("No recent alerts found or an error occurred.")
def init():
    if alert_is != None:
        return alert_is
    else:
        return None
if __name__ == "__main__":
    main()





