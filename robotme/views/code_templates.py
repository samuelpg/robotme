from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory, Response
from .. import app

@app.route('/code/except_template', methods = ['GET'])
def get_except():
    return send_from_directory(directory='static', filename='except.txt')

@app.route('/code/import_template', methods = ['GET'])
def get_import():
    return send_from_directory(directory='static', filename='import.txt')
