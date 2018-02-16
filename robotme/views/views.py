from flask import Flask, request, g, redirect, url_for, abort, render_template, flash
from robotme import app

#RESTFUL ENDPOINTS
#index
@app.route('/', methods = ['GET', 'POST'])
def show_projects():
    #code for getting all projects in DB
    return render_template('index.html')

@app.route('/new',  methods = ['POST'])
def new_project():
    pass

@app.route('/open/<project_id>', methods = ['GET'])
def open(project_id):
    pass

@app.route('/delete/<project_id>', methods = ['DELETE'])
def delete(project_id):
    pass

#variables
@app.route('variables/<project_id>', methods = ['GET', 'POST'])
def variables(project_id):
    pass

@app.route('variables/<project_id>/get', methods = ['GET'])
def get_variables(project_id):
    pass

@app.route('variables/<project_id>/set', methods = ['POST','PUT'])
def set_variables(project_id):
    pass

#IDE or Code Editor
@app.route('code/<project_id>', methods = ['GET', 'POST'])
def code(project_id):
    pass

@app.route('code/<project_id>/get', methods = ['GET'])
def get_code(project_id):
    pass

@app.route('code/<project_id>/set', methods = ['POST','PUT'])
def set_code(project_id):
    pass

@app.route('code/<project_id>/run', methods = ['GET'])
def run_code(project_id):
    pass

@app.route('code/<project_id>/stop', methods = ['GET'])
def stop_code(project_id):
    pass

