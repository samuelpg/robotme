from flask import Flask, request, g, redirect, url_for, abort, render_template, flash
from robotme import app

#RESTFUL ENDPOINTS FOR VARIABLES

@app.route('variables/<project_slug>', methods = ['GET', 'POST'])
def variables(project_slug):
    pass

@app.route('variables/<project_slug>/get', methods = ['GET'])
def get_variables(project_slug):
    pass

@app.route('variables/<project_slug>/set', methods = ['POST','PUT'])
def set_variables(project_slug):
    pass