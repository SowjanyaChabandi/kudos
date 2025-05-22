from flask import Flask, Blueprint
from flask_cors import CORS
from flask_restx import Api
from service.routes import init_routes

def create_app():
    app = Flask(__name__)
    app.secret_key = 'supersecretkey'
    app.url_map.strict_slashes = False

    # Initialize Flask-RESTX API
    blueprint = Blueprint('api', __name__, url_prefix='/')
    api = Api(
        blueprint,
        title='Kudos',
        version='1.0',
        description='Provides Endpoints exclusively for the Kudos Frontend'
    )

    # Initialize routes
    init_routes(api)

    # Register blueprint
    app.register_blueprint(blueprint)

    CORS(app)

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
