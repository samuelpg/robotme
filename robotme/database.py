import sqlite3 as sql
import datetime, random, json
from robotme import app

db = app.config['RTDB_NAME']

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_conn():
    try:
        connection = sql.connect(db)
        connection.row_factory = dict_factory
        connection.text_factory = str
        return connection
    except (RuntimeError, TypeError, NameError):
        print("Something went wrong with the connection | database.py")

def config_db():
    with get_conn() as conn:
        try:
            c = conn.cursor()
            with app.open_resource('schema.sql', mode='r') as f:
                c.executescript(f.read())
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
            conn.commit()
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong inserting in the database: projects | database.py")
    return slug

def delete_project(slug):
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('DELETE FROM projects WHERE slu_projects = ?', [slug])
            conn.commit()
        except (RuntimeError, TypeError, NameError):
            print("something went wrong deleting in the database")

def get_slug():
    dictonary = app.config["DICTIONARY_EN"]
    found = False
    slug = ""
    while not found:
        try:
            for i in range(0, 3):
                slug += dictonary.pop(random.randint(0, len(dictonary)-1))
            with get_conn() as conn:
                    c = conn.cursor()
                    c.execute('SELECT * FROM projects WHERE slu_projects = ?', [slug])
                    conn.commit()
                    if not c.fetchone():
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
            return c.fetchall()
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong getting the projects | database.py")

def get_variables(slug):
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('SELECT nme_variable, pin_variable, tpe_variable FROM variable WHERE slu_projects = ?', [slug])
            conn.commit()
            return c.fetchall() 
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong getting the variables | database.py")

def delete_variables(slug):
    with get_conn() as conn:
        try:
            c = conn.cursor()
            c.execute('DELETE FROM variable WHERE slu_projects = ?', [slug])
            conn.commit()
            return True
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong deleting the variables | database.py")
            return False

def set_variables(slug, variables_json):
    variables = json.loads(variables_json)
    ok = delete_variables(slug)
    if ok:
        with get_conn() as conn:
            for var in variables['vars']:
                try:
                    c = conn.cursor()
                    c.execute('INSERT OR REPLACE INTO variable (slu_projects, nme_variable, pin_variable, tpe_variable) VALUES (?,?,?,?)',[slug, var['name'], var['pin'], var['type']])
                    conn.commit()
                except (RuntimeError, TypeError, NameError):
                    print("Something went wrong with setting up variables | database.py")

def get_date():
    with get_conn() as conn:
        try:
            return datetime.date.today().strftime("%B %d, %Y")
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong with getting the date | database.py")