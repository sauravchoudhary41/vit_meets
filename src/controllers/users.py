from flask import request, abort, make_response, jsonify


from src import app
from src.models import connector
from src.common import exceptions


@app.route('/users',  methods=['GET'])
def get_users():
    """ List all users """
    app.logger.info('[Users][Request]: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))

    try:
        users = connector.read_users()
        app.logger.info('[Users][Response]: Code: 200')
        return make_response(jsonify(users))
    except exceptions.VitMeetsException as e:
        abort(e.code, {'message': e.message})


@app.route('/users/<user_id>',  methods=['GET'])
def get_user(user_id):
    """ Get a user """
    app.logger.info('Users: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))

    try:
        user = connector.read_user(int(user_id))
        app.logger.info('[Users][Response]: Status Code: 200')
        return make_response(jsonify(user))
    except exceptions.VitMeetsException as e:
        app.logger.error('[Users][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})


@app.route('/users',  methods=['POST'])
def register_user():
    """ Register a user """
    app.logger.info('Users: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))
    payload = request.get_json()

    try:
        connector.write_user(payload)
        app.logger.info('[Users][Response]: Status Code: 201')
        return make_response("", 201)
    except exceptions.VitMeetsException as e:
        app.logger.error('[Users][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})

