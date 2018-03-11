import subprocess, os
from robotme import app

def create_new_project_dir(slug):
    #create dir projects /slug and files slug/program.py and slug/code.txt
    try: 
        new_project_folder = app.config['PROJECT_FOLDER'] + "/" + slug + "/pseudo.txt"
        ensure_dir(new_project_folder)      
        #read project_template
        with open("robotme/project_template.txt", "r") as f:
            lines = f.readlines()
            print(lines)
            lines = [l for l in lines if "ROW" in l]
            with open("robotme/projects/"+slug+"/pseudo.txt", "w") as p:
                p.writelines(lines)
        print("pseudo.txt created")
        #call(['touch','code.py'])
        return True
    except (RuntimeError, TypeError, NameError):
        return False

def ensure_dir(file_path):
    directory = os.path.dirname(file_path)
    if not os.path.exists(directory):
        os.makedirs(directory)
        print("Folder created")