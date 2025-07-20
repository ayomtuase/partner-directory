
To start up the app

```
docker-compose up --build
```

To stop the app

```
docker-compose down
```


### Test questions

Digital Asset Management Application
This is a full-stack web application that allows users to manage digital assets using a Python FastAPI backend and a React frontend.

Challenge: Travel Partner Directory (Mini-SaaS Platform)
Scenario:
Your startup works with global travel partners (hotels, safaris, yachts, trains, etc.). You need a lightweight internal tool to manage and view partner companies and their users.

Requirements:
Backend
Use Python (Flask or Django) or Node.js to:
Create RESTful APIs for managing:
Partner groups (e.g., “Belmond Group”, “Independent”)
Individual partners (e.g., “Belmond Mount Nelson Hotel”)
Users (linked to partners)
Include user authentication (email/password is fine)
Apply basic role logic: admin, manager, viewer
Data store: SQLite or PostgreSQL

Frontend
Use React to:
Build a UI to:
View list of partner groups
Expand to see individual partners and users
Add/edit/delete partners and users
Authenticate and display different views based on role
Make the UI mobile-responsive

Optional Extras (Brownie Points):
Upload logo/image for each partner
Search/filter by country or type
Include a simple dashboard (e.g., # of partners, users)


Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
What things you need to install the software and how to install them:

Python 3.9
NodeJS 16.2.0
Docker (optional)
Git

