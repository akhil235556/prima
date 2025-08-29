python3 migration_entrypoint.py

gunicorn -b 0.0.0.0:8000 --timeout=0 --workers=4  server:app
