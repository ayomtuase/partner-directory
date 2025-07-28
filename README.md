To start up the app

```
docker-compose up --build
```

To stop the app

```
docker-compose down
```

Frontend runs on http://localhost:5173
Backend runs on http://localhost:8000
Database runs on http://localhost:5432
PgAdmin runs on http://localhost:8888

To seed DB

Attach a shell to the backend service and run:

```bash
python3 seed.py
```

### Challenge

Backend
Use Python (Flask or Django) or Node.js to:
Create RESTful APIs for managing:
Partner groups (e.g., “Belmond Group”, “Independent”)
Individual partners (e.g., “Belmond Mount Nelson Hotel”)
Users (linked to partners)
Include user authentication (email/password is fine)
Apply basic role logic: admin, manager, viewer

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

Above is the requirements for a travel agency application.

I want you to help build the frontend
