from .. import app, database, command
from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory, Response
from werkzeug.utils import secure_filename
import os, time, sys
from flask_socketio import SocketIO, emit, disconnect
from subprocess import PIPE, Popen
from threading import Lock
from .. import socketio
#RESTFULL ENDPOINTS FOR CODE EDITOR

thread = None
thread_lock = Lock()

def run_code_thread(project_slug):
    cmds = ['python','projects/'+project_slug+'/code.py']
    proc = Popen(cmds, stdout=PIPE, bufsize=1)
    app.config['process'] = proc
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

""" @app.route('/code/run/<project_slug>', methods = ['GET'])
def run_code(project_slug):
    #Run Celery task and return process ID
    pass

@app.route('/code/stop/<project_slug>', methods = ['GET'])
def stop_code(project_slug):
    #Stop task with process ID
    pass """

@socketio.on('run', namespace="/run")
def run(data):
    proc = app.config['process']
    if proc == None:
        project_slug = data['project_slug']
        global thread
        with thread_lock:
            if thread is None:
                thread = socketio.start_background_task(target=run_code_thread, args=[project_slug])
        emit('log', {'data': 'Programa Ejecutandoce'})
    else:
        emit('log', {'data': 'Ya existe un programa ejecutandoce, debes parar el programa anterior para ejecutar este'})

@app.route('/code/kill')
def kill():
    proc = app.config['process']
    if proc != None:
        proc.kill()
        app.config['process'] = None
        return "Programa terminado"
    else:
        return "No hay programa corriendo"