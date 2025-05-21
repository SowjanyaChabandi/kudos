# kudos

A lightweight application that allows users within an organization to send kudos to each other, view received kudos, and see available kudos. Kudos are reset every Monday at midnight.

## Setup development environment

Dependency management is done via [poetry](https://python-poetry.org/), therefore is has to be present or must be installed. The recommended way is to use their installer as it will install it for the current user within an isolated environment.

### Backend Setup (Flask)

1. Navigate to the backend directory (if not already in root):
        `cd kudos`
2. Create and activate a virtual environment:
        `python -m venv .venv`
3. activate virtual environment: 
        `source .venv/bin/activate`
4. Install dependencies:
       `poetry install`
5. Run the Flask app:
        1. `set FLASK_APP=service/app.py`
        2. `set FLASK_ENV=development`
        3. `flask run`

### Frontend Setup (React)

1. Navigate to the frontend directory:
        `cd kudos-ui`
2. Install dependencies:
        `npm install`
3. Start the React app:
        `npm start`

## Running Tests

1. Backend tests:
    In the appropriate module folder (kudos) tests can be executed via: `pytest tests`
2. Frontend tests:
    In the appropriate module folder (kudos-ui) tests can be executed via: `npx cypress run` or `npx cypress open`


# Kudos API
It provides the endpoints for the UI to check the kudos available and give the kudos to users, and it resets the kudos weekly(for example if a user has 3 kudos and not used in a week it won't be added to next week still the user has 3 kudos) It has below endpoints:

| Description                | Endpoint                             | Method | Request body/parameters                                                                                                                                                                                                                     | Sample Response                                                                                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Login               | /login                       | POST    | **"username"**: name of the user, **"password"**: password, **"timestamp"**: timestamp for which the instance data is requested, **"plant_name"**: name of the power plant,                                                                     | {"username": "user1","password": "user1"}                                                                                                                                                                                                                                                    |
| Users        | /availabe                       | GET   |                                                                                                                                                                                                                                             | [{"id": 1,"username": "alice"},{"id": 2,"username": "bob"}]                                                                                                                                                                                                                                                                                     |
| GiveKudo | /send                        | POST  | **"receiver_id"**: id of the receiver, **"message"**: message to give as kudo, **"giver_name"***: name who is giving the kudos, **"receiver_name"**: name of the receiver | {"receiver_id": 1,"message": "Hi","giver_name": "user1","receiver_name": "user2"}                                                                                                                                                                                                                                                                                      |
| ReceivedKudos  | /received                  | GET   | **"giver"**: name who is giving the kudos, **"receiver"**: name of the receiver, **"message"**: message to give as kudo **"created_at"**: timestamp at which kudo is received,                                          | {"giver": "sowjanya","receiver": "alice","message": "hi","created_at": "2025-05-19T12:55:21.558565"},  


- Kudos do not accumulate. Each user starts with a fixed number (e.g., 3) of kudos per week. Unused kudos are reset every Monday at midnight.
- A scheduled task resets all users' available kudos every Monday at midnight.

# Kudos UI
- A React-based frontend that allows users to interact with the system.
- It provides the frontend to send kudos and receive the kudos.
### Features:
- Login to the application.
- View available users and send kudos.
- Kudos are limited per user per week.
- Modal displays if no kudos are available.
- Received kudos are viewable with sender name and timestamp.
