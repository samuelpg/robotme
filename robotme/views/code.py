from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory, Response
from werkzeug.utils import secure_filename
from .. import app, database, command
import os, time

#RESTFULL ENDPOINTS FOR CODE EDITOR

@app.route('/code/<project_slug>', methods = ['GET', 'POST'])
def code(project_slug):
    return render_template('code.html')

@app.route('/code/get/<project_slug>', methods = ['GET'])
def get_code(project_slug):
    return send_from_directory(directory='projects/'+project_slug,filename='pseudo.txt')

@app.route('/code/set/<project_slug>', methods = ['POST','PUT'])
def set_code(project_slug):
    f = request.files['file']
    filename = secure_filename(f.filename)
    f.save(os.path.join('robotme/projects/'+project_slug,"pseudo.txt"))
    return "ok"

@app.route('/code/set_python/<project_slug>', methods = ['POST'])
def set_python(project_slug):
    f = request.files['file']
    filename = secure_filename(f.filename)
    f.save(os.path.join('robotme/projects/'+project_slug,"code.py"))
    return "ok"

@app.route('/code/run/<project_slug>', methods = ['GET'])
def run_code(project_slug):
    #Run Celery task and return process ID
    pass

@app.route('/code/stop/<project_slug>', methods = ['GET'])
def stop_code(project_slug):
    #Stop task with process ID
    pass

@app.route('/connected')
def connected():
    def event_stream():
        while True:
            time.sleep(3)
            yield 'data: %s\n\n' % 'hola mundo'
    return Response(event_stream(), mimetype="text/event-stream")

@app.route('/test/<project_slug>')
def test_this(project_slug):
    command.create_py_file(project_slug)
    return "ok"