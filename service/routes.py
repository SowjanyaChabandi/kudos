from flask_restx import Namespace, Resource, fields
from flask import session
from service.models import User, Kudo, Organization

# Define namespaces
login_ns = Namespace('login', description='Login operations')
users_ns = Namespace('users', description='User operations')
kudos_ns = Namespace('kudos', description='Kudos operations')

# Models for request validation
login_model = login_ns.model('Login', {
    'username': fields.String(required=True, description='User username')
})

kudo_model = kudos_ns.model('Kudo', {
    'receiver_id': fields.Integer(required=True, description='Receiver user ID'),
    'message': fields.String(required=True, description='Kudo message')
})

def init_routes(api):
    # Register namespaces
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
        user = User.get_by_username(username)
        if user:
            session['user_id'] = user['id']
            org = Organization.get_by_id(user['organization_id'])
            return {
                'id': user['id'],
                'username': user['username'],
                'organization': org['name'],
                'kudos_available': user['kudos_available']
            }, 200
        return {'error': 'User not found'}, 404

@users_ns.route('')
class Users(Resource):
    @users_ns.doc('list_users')
    def get(self):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401
        users_list = [u for u in User.get_all() if u['id'] != session['user_id']]
        # users_list = User.get_all()
        return [{'id': u['id'], 'username': u['username']} for u in users_list], 200
    

@kudos_ns.route('')
class GiveKudo(Resource):
    @kudos_ns.expect(kudo_model)
    @kudos_ns.doc('give_kudo')
    def post(self):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401
        data = kudos_ns.payload
        receiver_id = data.get('receiver_id')
        message = data.get('message')

        giver = User.get_by_id(session['user_id'])
        receiver = User.get_by_id(receiver_id)

        if not receiver or receiver['organization_id'] != giver['organization_id']:
            return {'error': 'Invalid receiver'}, 400
        if giver['kudos_available'] <= 0:
            return {'error': 'No kudos available'}, 400
        if not message or len(message.strip()) == 0:
            return {'error': 'Message is required'}, 400

        Kudo.create(giver['id'], receiver_id, message)
        giver['kudos_available'] -= 1
        return {'message': 'Kudo given successfully'}, 200

@kudos_ns.route('/received')
class ReceivedKudos(Resource):
    @kudos_ns.doc('list_received_kudos')
    def get(self):
        if 'user_id' not in session:
            return {'error': 'Unauthorized'}, 401
        kudos_list = Kudo.get_by_receiver(session['user_id'])
        return [{
            'giver': User.get_by_id(k['giver_id'])['username'],
            'message': k['message'],
            'created_at': k['created_at'].isoformat()
        } for k in kudos_list], 200
