from .. import app, database, command, socketio
from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, send_from_directory, Response
from werkzeug.utils import secure_filename
import os, time, sys
from flask_socketio import SocketIO, emit, disconnect
from subprocess import PIPE, Popen
from threading import Lock
import eventlet
""" import eventlet
eventlet.monkey_patch()
 """
#RESTFULL ENDPOINTS FOR CODE EDITOR

thread = None
thread_lock = Lock()

def run_code_thread(project_slug):
    APP_ROOT = os.path.dirname(os.path.abspath(__file__))
    APP_STATIC = os.path.join(APP_ROOT,'/home/pi/robotme/robotme/projects/'+project_slug+'/code.py')
    proc = Popen(['python',APP_STATIC], stdout=PIPE, bufsize=1)
    app.config['PROCESS'] = proc
    for line in iter(proc.stdout.readline,''):
        socketio.emit('log', {'data': line}, namespace='/run')
        print line

def test_thread():
    while True:
        socketio.emit('log', {'data': "F"}, namespace='/run')
        socketio.sleep(2)

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
    emit('msg',{'data':'connected'})

@socketio.on('run', namespace='/test')
def run_this(project_slug):
    proc = app.config['PROCESS']
    if proc == None:
        #eventlet.spawn(run_code_thread, project_slug=project_slug['data'])
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
    print proc
    if proc != None:
        proc.send_signal(signal.SIGINT)
        #proc.terminate()
        app.config['PROCESS'] = None
        print app.config['PROCESS']
        return "Programa terminado"
    else:
        return "No hay programa corriendo"

@app.route('/connected')
def connected():
    def event_stream():
        while True:
            time.sleep(3)
            yield 'data: %s\n\n' % 'hola mundo'
    return Response(event_stream(), mimetype="text/event-stream")
    
#python: can't open file 'projects/HouseDogFly/code.py': [Errno 2] No such file or directory
""" while proc.poll() is None:
    print("F")
    output = proc.stdout.readline()
    if output != "":
        socketio.emit('log', {'data': output}, namespace='/run') """
    
""" global thread
with thread_lock:
    if thread is None:
        thread = socketio.start_background_task(target=run_code_thread, project_slug=project_slug['data']) """