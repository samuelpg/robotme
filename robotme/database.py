import rethinkdb as r
import datetime
from robotme import app

host = app.config['RTDB_HOST']
port = app.config['RTDB_PORT']
db = app.config['RTDB_NAME']

def get_conn():
    return r.connect(host, port, db).repl()

def new_project(name, author, tag):
    with get_conn() as conn:
        conn.table("projects").insert(
            {
                "name":name,
                "author": author,
                "date": datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S'),
                "tag":tag,
                "slug":get_slug()
            }
        )

def get_slug():
    pass