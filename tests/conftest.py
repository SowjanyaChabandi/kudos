import pytest
from flask_request_id import RequestID

from service import models

@pytest.fixture
def app():
    from service.app import create_app
    app = create_app()
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test-secret'
    app.debug = True
    RequestID(app)  # Initializes the extension (not wrapped like WSGI)
    return app


@pytest.fixture
def mock_data(monkeypatch):
    mock_users = [
        {"id": 1, "username": "user1", "password": "user1", "organization_id": 1, "kudos_available": 3, "kudos_last_reset": None},
        {"id": 2, "username": "user2", "password": "user2", "organization_id": 1, "kudos_available": 3, "kudos_last_reset": None}
    ]
    mock_kudos = []

    monkeypatch.setattr(models, 'users', mock_users)
    monkeypatch.setattr(models, 'kudos', mock_kudos)
    monkeypatch.setattr(models, 'save_users', lambda: None)
    monkeypatch.setattr(models, 'save_kudos', lambda: None)

    yield


 

