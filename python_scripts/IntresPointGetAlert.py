import json
from datetime import datetime, timedelta

# File paths
ALERTS_FILE = 'alerts_data.json'
INTEREST_POINTS_FILE = 'IntresPoint.json'

def load_json(filename):
    """Load and return data from a JSON file."""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {filename}. Ensure it's valid JSON.")
        return []

def is_alert_recent(alert_time_str):
    """Check if the alert is within the last 10 minutes."""
    try:
        # Adjust the format to match your time string
        alert_time = datetime.strptime(alert_time_str, "%Y-%m-%d %H:%M:%S")  # Correct format with space
        current_time = datetime.now()

        # Check if the alert time is within the last 10 minutes
        time_difference = current_time - alert_time
        return time_difference <= timedelta(minutes=10)
    except ValueError:
        print(f"Error: Invalid time format {alert_time_str}")
        return False

def check_alerts():
    """Check if any places in IntresPoint.json are in alerts_data.json and return matching alerts."""
    alert_return = []
    
    # Load data from the JSON files
    alerts = load_json(ALERTS_FILE)
    interest_points = load_json(INTEREST_POINTS_FILE)

    if not alerts or not interest_points:
        print("One or both of the JSON files are empty or invalid.")
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
                    alert_list = [place_name, title, time]
                    alert_return.append(alert_list)
                else:
                    print(f"Alert in {place_name} at {time} is older than 10 minutes.")
        else:
            print(f"{place_name}: no alerts.")

    return alert_return

def main():
    """Main function to check alerts against interest points."""
    alerts = check_alerts()
    if alerts:
        print("Recent alerts found:", alerts)
    else:
        print("No recent alerts found or an error occurred.")

if __name__ == "__main__":
    main()
