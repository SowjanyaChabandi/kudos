import json
from datetime import datetime

# File paths to persist data
USERS_FILE = 'users.json'
KUDOS_FILE = 'kudos.json'

organizations = [
    {"id": 1, "name": "Mitratech"}
]

# Load users from file or default list
try:
    with open(USERS_FILE, 'r') as f:
        users = json.load(f)
        # Convert kudos_last_reset back to datetime or None
        for user in users:
            if user['kudos_last_reset']:
                user['kudos_last_reset'] = datetime.fromisoformat(user['kudos_last_reset'])
except (FileNotFoundError, json.JSONDecodeError):
    users = [
        {"id": 1, "username": "alice", "organization_id": 1, "kudos_available": 3, "kudos_last_reset": None},
        {"id": 2, "username": "bob", "organization_id": 1, "kudos_available": 3, "kudos_last_reset": None},
        {"id": 3, "username": "sowji", "organization_id": 1, "kudos_available": 3, "kudos_last_reset": None}
    ]

# Load kudos from file or start empty
try:
    with open(KUDOS_FILE, 'r') as f:
        kudos = json.load(f)
        # Convert created_at back to datetime
        for k in kudos:
            k['created_at'] = datetime.fromisoformat(k['created_at'])
except (FileNotFoundError, json.JSONDecodeError):
    kudos = []

IN_MEMORY_USERS = {}

def save_users():
    # Convert datetime to isoformat string before saving
    to_save = []
    for user in users:
        u = user.copy()
        if u['kudos_last_reset']:
            u['kudos_last_reset'] = u['kudos_last_reset'].isoformat()
        to_save.append(u)
    with open(USERS_FILE, 'w') as f:
        json.dump(to_save, f, indent=2)

def save_kudos():
    to_save = []
    for k in kudos:
        k_copy = k.copy()
        k_copy['created_at'] = k_copy['created_at'].isoformat()
        to_save.append(k_copy)
    with open(KUDOS_FILE, 'w') as f:
        json.dump(to_save, f, indent=2)

class Organization:
    @staticmethod
    def get_by_id(org_id):
        return next((org for org in organizations if org["id"] == org_id), None)

class User:
    @staticmethod
    def get_by_id(user_id):
        return next((user for user in users if user["id"] == user_id), None)

    @staticmethod
    def get_by_username(username):
        return next((user for user in users if user["username"] == username), None)

    @staticmethod
    def get_all():
        return users

    @staticmethod
    def update(user):
        # Find the index and replace user data
        for i, u in enumerate(users):
            if u['id'] == user['id']:
                users[i] = user
                break
        else:
            # If not found, add user (optional)
            users.append(user)

        IN_MEMORY_USERS[user['id']] = user
        save_users()

class Kudo:
    @staticmethod
    def create(giver_id, receiver_id, giver_name, receiver_name, message):
        kudo = {
            "id": len(kudos) + 1,
            "giver_id": giver_id,
            "receiver_id": receiver_id,
            "giver_name": giver_name,
            "receiver_name": receiver_name,
            "message": message,
            "created_at": datetime.utcnow()
        }
        kudos.append(kudo)
        save_kudos()
        return kudo

    @staticmethod
    def get_by_receiver(receiver_id):
        return [k for k in kudos if k["receiver_id"] == receiver_id]

    @staticmethod
    def get_by_giver(giver_id):
        return [k for k in kudos if k["giver_id"] == giver_id]
