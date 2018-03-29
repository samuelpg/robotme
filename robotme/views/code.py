from .. import app, database, command, socketio
from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory, Response
from werkzeug.utils import secure_filename
import os, time, sys
from flask_socketio import SocketIO, emit, disconnect
from subprocess import PIPE, Popen
from threading import Lock
#RESTFULL ENDPOINTS FOR CODE EDITOR

thread = None
thread_lock = Lock()

def run_code_thread(project_slug):
    print(app.instance_path)
    print(os.path.isfile('projects/'+project_slug+'/code.py'))
    cmds = ['python','projects/'+project_slug+'/code.py']
    #cmds = ['python','test.py']
    print("running code")
    proc = Popen(cmds, stdout=PIPE, bufsize=1)
    app.config['PROCESS'] = proc
    print(proc)
    while proc.poll() is None:
        output = proc.stdout.readline()
        if output != "":
            socketio.emit('log', {'data': output}, namespace='/run')

@app.route('/code/<project_slug>', methods = ['GET', 'POST'])
def code(project_slug):
    return render_template('code.html')

@app.route('/code/get/<project_slug>', methods = ['GET'])
def get_code(project_slug):
    return send_from_directory(directory='projects/'+project_slug,filename='pseudo.txt')

@app.route('/code/set/<project_slug>', methods = ['POST','PUT'])
def set_code(project_slug):
    f = request.files['file']
    f.save(os.path.join('robotme/projects/'+project_slug,"pseudo.txt"))
    return "ok"

@app.route('/code/set_python/<project_slug>', methods = ['POST'])
def set_python(project_slug):
    f = request.files['file']
    f.save(os.path.join('robotme/projects/'+project_slug,"code.py"))
    return "ok"

@socketio.on('connect', namespace='/test')
def connect():
    pass

@socketio.on('run', namespace='/test')
def run_this(project_slug):
    proc = app.config['PROCESS']
    print(project_slug)
    if proc == None:
        global thread
        with thread_lock:
            if thread is None:
                thread = socketio.start_background_task(target=run_code_thread, project_slug=project_slug['data'])
        emit('log', {'data': 'Programa Ejecutandoce'})
    else:
        emit('log', {'data': 'Ya existe un programa ejecutandoce, debes parar el programa anterior para ejecutar este'})

@app.route('/code/kill')
def kill():
    proc = app.config['PROCESS']
    if proc != None:
        proc.kill()
        app.config['process'] = None
        return "Programa terminado"
    else:
        return "No hay programa corriendo"

#python: can't open file 'projects/HouseDogFly/code.py': [Errno 2] No such file or directory
