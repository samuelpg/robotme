import eventlet
eventlet.monkey_patch() 

from robotme import app, socketio, database
from flask_socketio import SocketIO

database.config_db()

if __name__ == "__main__":
    socketio.run(host='0.0.0.0', port=8080, app = app)