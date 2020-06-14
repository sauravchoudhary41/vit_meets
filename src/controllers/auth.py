from flask import request, abort, make_response, jsonify, render_template


from src import app
from src.models import connector
from src.common import exceptions


@app.route('/login',  methods=['POST'])
def login():
    """ Login to Vit Meets """
    app.logger.info('Login: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))
    payload = request.get_json()

    try:
        user = connector.validate_user(payload)
        app.logger.info('[Login][Response]: Status Code: 201')
        return make_response(jsonify(user), 201)
    except exceptions.VitMeetsException as e:
        app.logger.error('[Login][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})

