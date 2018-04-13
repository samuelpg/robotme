from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, jsonify
from .. import app, database, command

#RESTFUL ENDPOINTS FOR VARIABLES

@app.route('/variables/<project_slug>', methods = ['GET', 'POST'])
def variables(project_slug):
    if(database.see_if_exist(project_slug)):
        return render_template('variables.html')
    else:
        abort(404)

@app.route('/variables/get/<project_slug>', methods = ['GET'])
def get_variables(project_slug):
    variables = list(database.get_variables(project_slug))
    return jsonify(variables = variables)   

@app.route('/variables/set/<project_slug>', methods = ['POST','PUT'])
def set_variables(project_slug):
    variables = request.form['variables']
    database.set_variables(project_slug, variables)
    return '/code/'+project_slug