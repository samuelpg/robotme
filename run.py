from robotme import app
from robotme import database

database.config_db()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8081)