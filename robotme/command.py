import subprocess, os
from robotme import app

def create_new_project_dir(slug):
    #create dir projects /slug and files slug/program.py and slug/code.txt
    try: 
        dir_path = os.path.dirname(os.path.realpath(__file__))
        print(dir_path)
        cwd = os.getcwd()
        print(cwd)
        print("BBBB")
        new_project_folder = app.config['PROJECT_FOLDER'] + "/" + slug
        print(new_project_folder)
        subprocess.Popen(["mkdir","-p",new_project_folder])
        print("Folder created")
        #read project_template
        with open("project_template.txt", "r") as f:
            lines = f.readlines()
            lines = [l for l in lines if "ROW" in l]
            with open(slug+"projects/"+slug+"/pseudo.txt", "w") as p:
                p.writelines(lines)
        print("pseudo.txt created")
        #call(['touch','code.py'])
        return True
    except (RuntimeError, TypeError, NameError):
        return False