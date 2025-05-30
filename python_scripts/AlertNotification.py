import json
from plyer import notification
import UserLocationAlert as UserLocationAlert  # Use the correct module
import os
import IntresPointGetAlert as IntresPointGetAlert
import SplashScreenAlert as SplashScreenAlert
import asyncio  # For asynchronous delay
import logging
from time import sleep 
# Setup logging in alertsGet.py
logging.basicConfig(
    filename='Log.txt',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',
)
USER_SETTINGS_FILE = 'C:/Users/USER/AppData/Roaming/picod-horef/UserSettings.json'
ICON_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'Photo', 'picod_img.ico')  # Update to the correct path of your icon file

def load_json(filename):
    """Load and return data from a JSON file."""
    try:
        with open(filename, 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        print(f"Error: {filename} not found.")
        return {}
    except json.JSONDecodeError:
        print(f"Error: Failed to decode {filename}. Ensure it's valid JSON.")
        return {}

def format_only_for_the_settings(settings):
    """Format and return only specific settings data."""
    alert_in_your_location = settings.get('alert_in_your_location', None)
    alert_in_your_intres = settings.get('alert_in_your_intres', None)
    notifay_in_intres = settings.get('notifay_in_intres', None)
    return alert_in_your_location, alert_in_your_intres, notifay_in_intres

def notify_on_UserLocation(title, city, alert_in_your_location):
    """Send notification using plyer. For User Location"""
    if alert_in_your_location:
        notification.notify(
            title=title,
            message=city,
            app_icon=ICON_PATH,  # Path to your .ico file
            timeout=1  # Duration in seconds
        )
        SplashScreenAlert.create_fullscreen_window(city, title, ICON_PATH) # Add the alert screen
    else:
        notification.notify(
            title=title,
            message=city,
            app_icon=ICON_PATH,  # Path to your .ico file
            timeout=1  # Duration in seconds
        )

def notify_on_user_intres(title, city, alert_in_your_intres, notifay_in_intres):
    """Send notification using plyer. For User Intress"""
    if alert_in_your_intres and notifay_in_intres:
        notification.notify(
            title=title,
            message=city,
            app_icon=ICON_PATH,  # Path to your .ico file
            timeout=1  # Duration in seconds
        )
        SplashScreenAlert.create_fullscreen_window(city, title, ICON_PATH) # Add the alert screen
    elif alert_in_your_intres:
        SplashScreenAlert.create_fullscreen_window(city, title, ICON_PATH)  # Add the alert screen
    elif notifay_in_intres:
        notification.notify(
            title=title,
            message=city,
            app_icon=ICON_PATH,  # Path to your .ico file
            timeout=1  # Duration in seconds
        )

# async def delay(does_notify):
#     """Delay function that runs in the background."""
#     does_notify = True
#     print('_________________________________________________', does_notify)
#     logging.warning('does notify in AlertNotification  ' + str(does_notify))
#     await asyncio.sleep(8)  # Asynchronous wait for 8 seconds
    
#     does_notify = False
#     print('__________________________________________________', does_notify)
#     logging.warning('does notify in AlertNotification  ' + str(does_notify))
#     return does_notify

def main():
    settings = load_json(USER_SETTINGS_FILE)
    alert_in_your_location, alert_in_your_intres, notifay_in_intres = format_only_for_the_settings(settings)

    # Check for user location alerts and initialize the IntresPoint alerts
    UserLocationAlert.check_user_location_alert()
    IntresPointGetAlert.main()

    # Now, initialize alert data using the correct init function from UserLocationAlert
    alert_data = UserLocationAlert.init()  # Call the init function from UserLocationAlert
    print(f"Alert data from UserLocationAlert: {alert_data}")
    logging.info(f"Alert data from UserLocationAlert: {alert_data}")
    # Variable to track notifications
    does_notify_UserLocation = False

    # If there's an alert, show a notification and start the delay
    if alert_data and not does_notify_UserLocation:
        city, title_alert = alert_data
        notify_on_UserLocation('פיקוד העורף', f'התראה ב: {city} - {title_alert}', alert_in_your_location)

        # Run delay in the background
        does_notify_UserLocation =True
        sleep(6)
        does_notify_UserLocation =False

    elif not alert_data and does_notify_UserLocation:
        print('alert_data == False and does_notify')
    elif alert_data and not does_notify_UserLocation:
        print('alert_data and does_notify == False')
    else:
        print('none to show')

    try:
        intresPointData = IntresPointGetAlert.check_alerts()
        print(intresPointData)
        does_notify_IntresPoint = False

        if intresPointData and not does_notify_IntresPoint:
            for data in intresPointData:
                if len(data) >= 2:  # Check if there are at least two elements
                    notify_on_user_intres(
                        title=data[1],
                        city=data[0],
                        alert_in_your_intres=alert_in_your_intres,
                        notifay_in_intres=notifay_in_intres
                    )
            does_notify_IntresPoint = True
            sleep(6)  # Use await for async sleep
            does_notify_IntresPoint = False
        else:
            print('No alerts found or an error occurred.')
    except Exception as e:
        print(f"Error checking alerts: {e}")

if __name__ == "__main__":
    # Run the main function asynchronously

    main()
