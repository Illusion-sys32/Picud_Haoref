import asyncio
import alertsGet as alertsGet
import IntresPointGetAlert as IntresPointGetAlert
import UserLocationAlert as UserLocationAlert
import AlertNotification as AlertNotification
import logging

logging.basicConfig(
    filename='Log.txt',
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    encoding='utf-8',
)

async def run_alert_scripts():
    """Run alert-related functions from the imported scripts asynchronously."""
    while True:
        try:
            logging.info('Starting the alert scripts...')
            alertsGet.main()  # Fetch and print the alerts JSON

            # Check interest points
            IntresPointGetAlert.main()

            # Check user location and send notifications
            # Ensure these functions are either async or remove await if they aren't
            result1 = UserLocationAlert.check_user_location_alert()
            if asyncio.iscoroutine(result1):
                await result1

            result2 = AlertNotification.main()
            if asyncio.iscoroutine(result2):
                await result2

        except Exception as e:
            logging.error(f'Error in run_alert_scripts: {e}')
        
        await asyncio.sleep(1)  # Use non-blocking asyncio sleep

async def main():
    """Main function to run the alert scripts."""
    await run_alert_scripts()  # Run the alert-related scripts asynchronously

if __name__ == "__main__":
    try:
        asyncio.run(main())  # Run the main function asynchronously
    except Exception as e:
        logging.error(f'Script exited with error: {e}')
    else:
        logging.info('Exiting script successfully')
