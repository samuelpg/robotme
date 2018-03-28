from celery import Celery
from robotme import app
import subprocess

app.config['CELERY_BROKER_URL'] = 'redis://localhost:6379/0'
app.config['CELERY_RESULT_BACKEND'] = 'redis://localhost:6379/0'

celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

@celery.task
def run_python_script(slug):
    #python projects/slug/program.py
    programm_dir = 'projects/' + slug + '/code.py'
    process = subprocess.popopen(['python',programm_dir])

def stop_python_script():
    pass

""" def echo_a_bunch(thing):
    bash_cmd = "for _ in $(seq 1 10); do echo '{}'; sleep 0.5; done".format(thing)
    cmd = ["bash", "-c", bash_cmd]
    proc = Popen(cmd, stdout=PIPE)
    for line in proc.stdout:
        thing = line.decode('utf-8').strip()
        socketio.emit('message', {'data': thing}, namespace="/test")
    proc.wait() """