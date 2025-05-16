from datetime import datetime

organizations = [
    {"id": 1, "name": "Mitratech"}
]
users = [
    {"id": 1, "username": "alice", "organization_id": 1, "kudos_available": 3},
    {"id": 2, "username": "bob", "organization_id": 1, "kudos_available": 3},
    {"id": 3, "username": "sowji", "organization_id": 1, "kudos_available": 3}
]
kudos = []

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

class Kudo:
    @staticmethod
    def create(giver_id, receiver_id, message):
        kudo = {
            "id": len(kudos) + 1,
            "giver_id": giver_id,
            "receiver_id": receiver_id,
            "message": message,
            "created_at": datetime.utcnow()
        }
        kudos.append(kudo)
        return kudo

    @staticmethod
    def get_by_receiver(receiver_id):
        return [k for k in kudos if k["receiver_id"] == receiver_id]
    