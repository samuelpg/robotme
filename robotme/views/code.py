from flask import Flask, request, g, redirect, url_for, abort, render_template, flash
from robotme import app

#RESTFUL ENDPOINTS FOR CODE EDITOR

@app.route('/code/<project_slug>', methods = ['GET', 'POST'])
def code(project_slug):
    pass

@app.route('/code/<project_slug>/get', methods = ['GET'])
def get_code(project_slug):
    pass

@app.route('/code/<project_slug>/set', methods = ['POST','PUT'])
def set_code(project_slug):
    pass

@app.route('/code/<project_slug>/run', methods = ['GET'])
def run_code(project_slug):
    pass

@app.route('/code/<project_slug>/stop', methods = ['GET'])
def stop_code(project_slug):
    pass
