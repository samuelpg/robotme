from flask import Flask, request, g, redirect, url_for, abort, render_template, flash
from robotme import app, database
#RESTFUL ENDPOINTS
#index
@app.route('/', methods = ['GET', 'POST'])
def show_projects():
    #getting all projects in DB
    projects = list(database.get_projects())
    #render index.html with all projects
    return render_template('index.html', projects = projects)

@app.route('/new',  methods = ['POST'])
def new_project():
    form = request.form
    try:
        name = form['name']
        author = form['author']
        tag = form['tag']
        slug = database.new_project(name, author, tag)
        redirect(url_for('variables')+'/'+slug)
    Exception
        print("Something went wrong creating new project")

@app.route('/open/<project_slug>', methods = ['GET'])
def open(project_slug):
    pass

@app.route('/delete/<project_slug>', methods = ['DELETE'])
def delete(project_slug):
    pass