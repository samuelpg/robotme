import rethinkdb as r
import datetime, random
from robotme import app

host = app.config['RTDB_HOST']
port = app.config['RTDB_PORT']
db = app.config['RTDB_NAME']

def get_conn():
    try:
        return r.connect(host, port, db).repl()
    Exception
        print("Something went wrong with the connection")

def config_db():
    with get_conn() as conn:
        try:
            conn.create_db(db).run()
            conn.db(db).table_create("projects").run()
            conn.db(db).table_create("variables").run()
            print("Database created")
        Exception:
            print("Database already created")

def new_project(name, author, tag):
    slug = get_slug()
    with get_conn() as conn:
        try:
            conn.table("projects").insert(
                {
                    "name":name,
                    "author": author,
                    "date": datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'),
                    "tag":tag,
                    "slug":slug
                }
            ).run()
        Exception:
            print("Something went wrong")
    return slug

def get_slug():
    dictonary = app.config["DICTIONARY_EN"]
    found = False
    slug = ""
    while not found:
        for i in range(0, 3):
            slug += dictonary.pop(random.randint(0, len(dictonary)))
        with get_conn() as conn:
            if not conn.db(db).table("projects").filter({"slug":slug}).count().eq(1)
                found = True
    return slug

def get_projects():
    with get_conn() as conn:
        return conn.table("projects").run()