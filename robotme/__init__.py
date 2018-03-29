from flask import Flask
from flask_socketio import SocketIO
""" app = Flask(__name__)
app.config.from_object('config')
 """
socketio = SocketIO()
app = Flask(__name__)
app.config.from_object('config')
socketio.init_app(app)

from views import index, code, variables, code_templates, states