from flask import Flask

app = Flask(__name__)
app.config.from_object('config')

from views import index, code, variables, code_templates, states