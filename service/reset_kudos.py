import schedule
import time
from datetime import datetime, date

from models import User

def reset_kudos():
    today = date.today()
    users = User.get_all()
    for user in users:
        if user["kudos_last_reset"] < today and today.weekday() == 0:
            user["kudos_available"] = 3
            user["kudos_last_reset"] = today
            User.update(user)
    print("Kudos reset done for users not reset today.")

# Schedule reset every Monday at midnight
schedule.every().monday.at("00:00").do(reset_kudos)

def run_scheduler():
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    run_scheduler()