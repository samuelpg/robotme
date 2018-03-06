from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, jsonify
from .. import app, database, command

#RESTFUL ENDPOINTS FOR USE IN index.html

@app.route('/', methods = ['GET', 'POST'])
def get_template():
    #render index.html with all projects
    return render_template('index.html')

@app.route('/get_projects', methods = ['GET'])
def show_projects():
    #getting all projects in DB
    projects = list(database.get_projects())
    return jsonify(projects=projects)

@app.route('/new',  methods = ['POST'])
def new_project():
    try:
        #getting the data out of the form and insert the new document and get slug
        name = request.form['name']
        author = request.form['author']
        tag = request.form['tag']
        slug = database.new_project(name,author,tag)
        ##create the new directory and files with the slug
        #create_new_project_dir(slug)
        ##redirect to variables
        #redirect(url_for('variables')+'/'+slug)
        return "ok"
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong creating a new project | views/index.py")

@app.route('/delete_project', methods = ['DELETE'])
def delete():
    project_slug = request.form['slug']
    try:
        database.delete_project(project_slug)
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong deleting a project | views/index.py")
        print("slug: "+project_slug)
    