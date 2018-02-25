from flask import Flask, request, g, redirect, url_for, abort, render_template, flash
from robotme import app, database, command

#RESTFUL ENDPOINTS FOR INDEX

@app.route('/', methods = ['GET', 'POST'])
def show_projects():
    #getting all projects in DB
    projects = list(get_projects())
    #render index.html with all projects
    return render_template('index.html', projects = projects)

@app.route('/new',  methods = ['POST'])
def new_project():
    try:
        #getting the data out of the form and insert the new document and get slug
        slug = new_project(request.form['name'], request.form['author'], request.form['tag'])
        #create the new directory and files with the slug
        create_new_project_dir(slug)
        #redirect to variables
        redirect(url_for('variables')+'/'+slug)
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong creating a new project | views/index.py")

@app.route('/delete/<project_slug>', methods = ['DELETE'])
def delete(project_slug):
    try:
        delete_project(project_slug)
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong deleting a project | views/index.py")
        print("slug: "+project_slug)
    