import subprocess
from . import app

def create_new_project_dir(slug):
    #create dir projects /slug and files slug/program.py and slug/code.txt
    new_project_folder = app['PROJECT_FOLDER'] + "/" + slug
    call(['mkdir',new_project_folder])
    call(['touch','pseudo.txt'])
    call(['touch','code.py'])