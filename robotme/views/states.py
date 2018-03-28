from flask import Flask, request, g, redirect, url_for, abort, render_template, flash, jsonify
from .. import app
import time, os

@app.route('/connected')
def connected():
    def event_stream():
        while True:
            time.sleep(3)
            yield 'data: %s\n\n' % 'hola mundo'
    return Response(event_stream(), mimetype="text/event-stream")
