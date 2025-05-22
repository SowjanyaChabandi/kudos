import pytest


@pytest.mark.parametrize("username,password", [
    pytest.param("alice", "alice123"),
    pytest.param("bob", "bob123")
])
def test_login_success(client, username, password):
    response = client.post('/login', json={
        'username': username,
        'password': password
    })
    assert response.status_code == 200
    assert 'username' in response.json
    assert 'kudos_available' in response.json
    assert response.json['organization'] == 'Mitratech'


def test_login_invalid(client):
    response = client.post('/login', json={
        'username': 'alice',
        'password': 'password'
    })
    assert response.status_code == 404


def test_get_current_user_success(client):
    response = client.post('/login', json={'username': 'alice', 'password': 'alice123'})
    assert response.status_code == 200
    assert response.json['username'] == 'alice'


def test_get_current_user_unauthorized(client):
    response = client.post('/login', json={'username': 'alice', 'password': 'password'})
    assert response.status_code == 404


def test_list_users(client):
    client.post('/login', json={'username': 'bob', 'password': 'bob123'})
    response = client.get('/users/available')
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_give_kudo(client, mock_data):
    # Login first
    login_response = client.post('/login', json={'username': 'user1', 'password': 'user1'})
    assert login_response.status_code == 200

    # Send kudo
    response = client.post('/kudos/send', json= {
                    "id": 1,
                    "giver_id": 1,
                    "receiver_id": 2,
                    "message": "hi",
                    "created_at": "2025-05-19T12:55:21.558565"
                })

    assert response.status_code == 200
    assert response.json['message'] == 'Kudo given successfully'


def test_received_kudos(client):
    client.post('/login', json={'username': 'alice', 'password': 'alice123'})
    response = client.get('/kudos/received')
    assert response.status_code == 200
    assert isinstance(response.json, list)
