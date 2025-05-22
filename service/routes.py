from flask_restx import Namespace, Resource, fields
from flask import request
from datetime import datetime, timedelta
from service.models import User, Kudo, Organization, kudos

# Define namespaces
login_ns = Namespace('login', description='Login operations')
users_ns = Namespace('users', description='User operations')
kudos_ns = Namespace('kudos', description='Kudos operations')

# Models for request validation
login_model = login_ns.model('Login', {
    'username': fields.String(required=True, description='User username'),
    'password': fields.String(required=True, description='User password'),
    'organization_id': fields.Integer(required=True, description='Organization ID')
})

kudo_model = kudos_ns.model('Kudo', {
    'giver_id': fields.Integer(required=True, description='Giver user ID'),
    'receiver_id': fields.Integer(required=True, description='Receiver user ID'),
    'message': fields.String(required=True, description='Kudo message'),
    'giver_name': fields.String(required=True, description='Name of the giver who is sending kudo'),
    'receiver_name': fields.String(required=True, description='Name of the giver who is receiving kudo'),
})

def init_routes(api):
    api.add_namespace(login_ns)
    api.add_namespace(users_ns)
    api.add_namespace(kudos_ns)


@login_ns.route('')
class Login(Resource):
    @login_ns.expect(login_model)
    @login_ns.doc('login_user')
    def post(self):
        data = login_ns.payload
        username = data.get('username')
        password = data.get('password')
        user = User.get_by_username(username)

        if user and user.get('password') == password:
            org = Organization.get_by_id(user['organization_id'])
            return {
                'id': user['id'],
                'username': user['username'],
                'organization': org['name'],
                'kudos_available': user['kudos_available'],
                'token': str(user['id'])
            }, 200
        return {'error': 'Invalid username or password'}, 404


@users_ns.route('/create')
class CreateUser(Resource):
    @users_ns.expect(login_model)
    def post(self):
        data = users_ns.payload
        username = data.get('username', '')
        password = data.get('password', '')
        org_id = data.get('organization_id')
        now = datetime.utcnow()

        if not username or not password or not org_id:
            return {'error': 'Username, password, and organization_id are required'}, 400

        if not Organization.get_by_id(org_id):
            return {'error': 'Invalid organization_id'}, 400

        existing = User.get_by_username(username)
        if existing:
            return {'error': 'Username already exists'}, 400

        new_user = {
            "id": max([u["id"] for u in User.get_all()] + [0]) + 1,
            "username": username,
            "password": password,
            "organization_id": org_id,
            "kudos_available": 3,
            "kudos_last_reset": None,
            "last_reset_at": now.isoformat()
        }

        User.update(new_user)
        return {'message': 'User created', 'user': new_user}, 201


@users_ns.route('/available')
class Users(Resource):
    @users_ns.doc('list_users')
    def get(self):
        users_list = User.get_all()
        return [{'id': u['id'], 'username': u['username']} for u in users_list], 200




@kudos_ns.route('/send')
class GiveKudo(Resource):
    @kudos_ns.expect(kudo_model)
    @kudos_ns.doc('give_kudo')
    def post(self):
        data = kudos_ns.payload

        giver_id = data.get('giver_id')
        receiver_id = data.get('receiver_id')
        message = data.get('message')
        giver_name = data.get('giver_name')
        receiver_name = data.get('receiver_name')

        if not all([receiver_id, message]):
            return {'error': 'Missing required fields'}, 400

        if giver_id == receiver_id:
            return {'error': 'You cannot give kudos to yourself'}, 400

        giver = User.get_by_id(giver_id)
        if not giver:
            return {'error': 'Giver user not found'}, 404

        now = datetime.utcnow()
        last_reset_str = giver.get('last_reset_at')
        last_reset = datetime.fromisoformat(last_reset_str) if last_reset_str else None

        if not last_reset or (now - last_reset >= timedelta(weeks=1)):
            giver['kudos_available'] = 3
            giver['last_reset_at'] = now.isoformat()
            User.update(giver)

        if giver['kudos_available'] <= 0:
            return {'error': 'No kudos available'}, 400

        giver['kudos_available'] -= 1
        User.update(giver)

        Kudo.create(giver_id, receiver_id, giver_name, receiver_name, message)

        return {'message': 'Kudo given successfully'}


@kudos_ns.route('/received')
class ReceivedKudos(Resource):
    @kudos_ns.doc('list_received_kudos')
    def get(self):
        
        combined_kudos = kudos[:]
        
        # Sort by creation date
        combined_kudos.sort(key=lambda k: k['created_at'])
        
        result = []
        for k in combined_kudos:
            giver = User.get_by_id(k['giver_id'])
            receiver = User.get_by_id(k['receiver_id'])
            result.append({
                'giver': giver['username'] if giver else 'Unknown',
                'receiver': receiver['username'] if receiver else 'Unknown',
                'message': k['message'],
                'created_at': k['created_at'].isoformat()
            })
        
        return result, 200
