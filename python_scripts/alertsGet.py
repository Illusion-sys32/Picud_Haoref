import requests
import json
from datetime import datetime, timedelta
import logging
import sys

# Setup logging in alertsGet.py
logging.basicConfig(
    filename='Log.txt',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',
)

print('AlertsGet is in the house')
url = "https://www.oref.org.il/warningMessages/alert/History/AlertsHistory.json"

def reverse_hebrew_text(text):
    # Reverse the text if it's Hebrew (assumed to be right-to-left)
    return text[::-1]

def Get():
    response = requests.get(url)
    if response.status_code == 200:
        # Parse the JSON content
        alerts = response.json()
    else:
        print(f"Failed to retrieve data. Status code: {response.status_code}")
        sys.exit(1)  # Use sys.exit to avoid exit() in scripts
    return alerts
def delete_unrecent_alerts(alerts):
    """
    This function filters out alerts that are older than one hour.
    :param alerts: A list of alerts containing 'alertDate' field.
    :return: A list of recent alerts (within the last hour).
    """
    recent_alerts = []
    current_time = datetime.now()

    for alert in alerts:
        try:
            # Parse the alert date
            alert_time = datetime.strptime(alert['alertDate'], "%Y-%m-%d %H:%M:%S")
            print(alert['alertDate'])
            time_difference = current_time - alert_time
            
            # Keep only alerts within the last hour
            if time_difference <= timedelta(hours=3):
                recent_alerts.append(alert)
            else:
                logging.info(f"Removed old alert: {alert['title']} at {alert['alertDate']}")
        
        except Exception as e:
            logging.error(f"Failed to process alert: {alert}. Error: {e}")
            print(f"Failed to process alert: {alert}. Error: {e}")

    return recent_alerts
def main():
    # Reinitialize the accumulated lists every time main() is called
    accumulated_titles = []
    accumulated_data = []
    accumulated_date = []

    try:
        # Fetch alerts
        alerts = Get()
        
        # Filter out old alerts
        alerts = delete_unrecent_alerts(alerts)

        for alert in alerts:
            # Extracting alert details
            alert_date = alert['alertDate']
            title = alert['title']
            data = alert['data']
            date = alert['alertDate']
            
            accumulated_titles.append(title)
            accumulated_data.append(data)
            accumulated_date.append(date)
            logging.debug(f"Alert title: {title}, data: {data}, date: {date}")

        # Prepare the data to be written to the JSON file
        output_data = {
            "titles": accumulated_titles,
            "data": accumulated_data,
            "time": accumulated_date 
        }

        # Save the data to a JSON file
        with open('alerts_data.json', 'w', encoding='utf-8') as f: 
            json.dump(output_data, f, ensure_ascii=False, indent=4)

        # Print JSON data for Electron (UTF-8 is handled automatically)
        try:
            print(json.dumps(output_data, ensure_ascii=False))
        except Exception as e:
            print(f"Failed to print output data: {e}")

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        sys.exit(1)  # Use sys.exit to handle exceptions properly


if __name__ == "__main__":
    main()
