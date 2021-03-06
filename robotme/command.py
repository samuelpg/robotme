import subprocess, os, shutil
from robotme import app, socketio
from flask_socketio import SocketIO, emit, disconnect
from subprocess import PIPE, Popen

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
