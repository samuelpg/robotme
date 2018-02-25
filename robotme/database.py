import sqlite3 as sql
import datetime, random
import json
from robotme import app

db = app.config['RTDB_NAME']

def get_conn():
    try:
        return sql.connect(db)
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong with the connection | database.py")

def config_db():
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('''                
                CREATE TABLE projects (
                    slu_projects VARCHAR(50) NOT NULL,
                    dte_projects VARCHAR(50) NOT NULL,
                    nme_projects VARCHAR(50) NOT NULL,
                    aut_projects VARCHAR(50) NOT NULL,
                    tag_projects VARCHAR(200) NOT NULL,
                    CONSTRAINT sl_projects PRIMARY KEY (slu_projects)
                );

                CREATE TABLE variables (
                    slu_projects VARCHAR(50) NOT NULL,
                    var_variables VARCHAR NOT NULL,
                    CONSTRAINT pk_variables PRIMARY KEY (slu_projects)
                );
                
                ALTER TABLE variables ADD CONSTRAINT projects_variables_fk
                FOREIGN KEY (slu_projects)
                REFERENCES projects (slu_projects)
                ON DELETE CASCADE
                ON UPDATE CASCADE
                ''')
            conn.commit()
            print("Database just created | database.py")
        except (RuntimeError, TypeError, NameError):
            print("Database already created | database.py")

def new_project(name, author, tag):
    slug = get_slug()
    date = get_date()
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('INSERT INTO projects (slu_projects, nme_projects, aut_projects, tag_projects, dte_projects) VALUES (?,?,?,?,?)',[slug, name, author, tag, date])
            c.commit()
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong inserting in the database: projects | database.py")
    return slug

def delete_project(slug):
    with get_conn as conn:
        try:
            c = conn.cursor()
            c.execute('DELETE * FROM projects WHERE slu_projects = ?', slug)
            conn.commit()

def get_slug():
    dictonary = app.config["DICTIONARY_EN"]
    found = False
    slug = ""
    while not found:
        try:
            for i in range(0, 3):
                slug += dictonary.pop(random.randint(0, len(dictonary)))
            with get_conn() as conn:
                    c = conn.cursor()
                    c.execute('SELECT * FROM projects WHERE slu_projects = ?', slug)
                    conn.commit()
                    if not c.fetchone:
                        found = True
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong getting the slug | database.py")
    return slug

def get_projects():
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('SELECT * FROM projects')
            conn.commit()
            return json.dumps( [dict(ix) for ix in rows] ) 
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong getting the projects | database.py")

def get_variables(slug):
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('SELECT var_variables FROM variables WHERE slu_projects = ?', slug)
            conn.commit()
            return json.dumps( [dict(ix) for ix in rows] ) 
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong getting the variables | database.py")

def set_variables(slug, variables):
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('INSERT INTO variables (slu_projects, var_variables )VALUES (?,?)',[slug, variables])
            c.commit()
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong with setting up variables | database.py")

def get_date():
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute("SELECT datetime('now')")
            return c.fetchone()
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong with getting the date | database.py")