from flask import Flask
from flask_socketio import SocketIO
""" app = Flask(__name__)
app.config.from_object('config')
 """

app = Flask(__name__)
app.config.from_object('config')
app.debug = True
async_mode = None
socketio = SocketIO(app, async_mode='threading')

from views import index, code, variables, code_templates, states