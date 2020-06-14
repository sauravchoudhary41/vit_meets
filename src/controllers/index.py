from flask import request, render_template

from src import app

# Route to render 'Vit Meetings' UI's index.html
@app.route('/index')
@app.route('/')
def index():
    """
    Render the Home page.
    """
    app.logger.info('Home: [{}]:[{}] from host: [{}]'.format(
        request.url, request.method, request.remote_addr))
    return render_template('index.html')
