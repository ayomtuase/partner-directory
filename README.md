
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
