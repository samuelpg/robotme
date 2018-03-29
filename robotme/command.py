import subprocess, os, shutil
from robotme import app

def create_new_project_dir(slug, name, author):
    #create dir projects /slug and files slug/program.py and slug/code.txt
    try: 
        new_project_folder = app.config['PROJECT_FOLDER'] + "/" + slug + "/pseudo.txt"
        ensure_dir(new_project_folder)      
        #read project_template
        with open("robotme/project_template.txt", "r") as f:
            lines = f.readlines()
            for i in range(len(lines)):
                lines[i] = lines[i].replace("[project name]",name)
                lines[i] = lines[i].replace("[author name]", author)
            with open("robotme/projects/"+slug+"/pseudo.txt", "w") as p:
                p.writelines(lines)
        return True
    except (RuntimeError, TypeError, NameError):
        return False

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)

def delete_project_dir(slug):
    shutil.rmtree('robotme/projects/'+slug)
    
def run_code_thread(project_slug):
    print(app.instance_path)
    print(os.path.dirname(os.path.abspath(__file__)) )
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
