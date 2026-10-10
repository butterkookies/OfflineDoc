"""
app.main - Fast API app entrypoint mapping directly to server:app
Enables running: py -m uvicorn app.main:app --host 127.0.0.1 --port 8000
"""
from server import app

__all__ = ["app"]
