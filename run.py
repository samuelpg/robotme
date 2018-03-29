from robotme import app
from robotme import database
from flask_socketio import SocketIO

database.config_db()
async_mode = None
socketio = SocketIO(app, async_mode=async_mode)

if __name__ == "__main__":
    socketio.run(host='0.0.0.0', port=8081, app = app)