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
            #slu = slug
            #dte = date
            #nme = name
            #aut = author
            #tag = tag
            #var = variables
            c.executescript('''                
                CREATE TABLE IF NOT EXISTS projects (
                    slu_projects VARCHAR(50) NOT NULL,
                    dte_projects VARCHAR(50) NOT NULL,
                    nme_projects VARCHAR(50) NOT NULL,
                    aut_projects VARCHAR(50) NOT NULL,
                    tag_projects VARCHAR(200) NOT NULL,
                    PRIMARY KEY (slu_projects)
                );

                CREATE TABLE IF NOT EXISTS variables (
                    slu_projects VARCHAR(50) NOT NULL,
                    var_variables VARCHAR NOT NULL,
                    FOREIGN KEY (slu_projects)
                    REFERENCES projects (slu_projects)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
                );
                ''')
            conn.commit()
            print("Database just created | database.py")
        except (RuntimeError, TypeError, NameError):
            print("Database already created | database.py")

def new_project(name, author, tag):
    slug = get_slug()
    date = get_date()
    print(date)
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
            return datetime.date.today().strftime("%B %d, %Y")
        except (RuntimeError, TypeError, NameError):
            print("Something went wrong with getting the date | database.py")