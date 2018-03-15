from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory
from werkzeug.utils import secure_filename
from .. import app, database, command
import os

#RESTFULL ENDPOINTS FOR CODE EDITOR

@app.route('/code/<project_slug>', methods = ['GET', 'POST'])
def code(project_slug):
    return render_template('code.html')

@app.route('/code/<project_slug>/get', methods = ['GET'])
def get_code(project_slug):
    return send_from_directory(directory='projects/'+project_slug,filename='pseudo.txt')

@app.route('/code/<project_slug>/set', methods = ['POST','PUT'])
def set_code(project_slug):
    f = request.files['file']
    filename = secure_filename(f.filename)
    f.save(os.path.join('robotme/projects/'+project_slug,"pseudo.txt"))
    return "ok"

@app.route('/code/<project_slug>/run', methods = ['GET'])
def run_code(project_slug):
    pass

@app.route('/code/<project_slug>/stop', methods = ['GET'])
def stop_code(project_slug):
    pass

@app.route('/connected')
def connected():
    print("HELLO")
    return "data:"+'yes'+"\n\n"

@app.route('/test/<project_slug>')
def test_this(project_slug):
    command.create_py_file(project_slug)
    return "ok"