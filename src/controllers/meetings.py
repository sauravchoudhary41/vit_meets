from flask import request, abort, make_response, jsonify


from src import app
from src.models import connector
from src.common import exceptions


@app.route('/meetings/<user_id>',  methods=['GET'])
def get_meetings(user_id):
    """ Get all meetings for a user """
    app.logger.info('Meetings: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))
    try:
        meetings = connector.read_meetings(int(user_id))
        app.logger.info('[Meetings][Response]: Status Code: 200')
        return make_response(jsonify(meetings))
    except exceptions.VitMeetsException as e:
        app.logger.error('[Meetings][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})


@app.route('/meetings/<user_id>',  methods=['POST'])
def create_meetings(user_id):
    """ Create meeting space(s) for a user """
    app.logger.info('Meetings: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))
    payload = request.get_json()

    try:
        for slot in payload['slots']:
            connector.write_meeting(int(user_id), slot)

        app.logger.info('[Meetings][Response]: Status Code: 201')
        return make_response("", 201)
    except exceptions.VitMeetsException as e:
        app.logger.error('[Meetings][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})


@app.route('/meetings/<user_id>',  methods=['PUT'])
def book_meetings(user_id):
    """ Book a available meeting """
    app.logger.info('Meetings: [{}]:[{}] from host: [{}]'
                    .format(request.url, request.method, request.remote_addr))
    payload = request.get_json()

    invalid_meetings = list()
    status_code = '204'
    response = ""
    try:
        for slot in payload['slots']:
            meeting_info = connector.read_meeting(slot['meeting_id'])
            if meeting_info['booked_by']:
                invalid_meetings.append(slot['meeting_id'])
                continue

            connector.update_meeting(slot)

        if invalid_meetings:
            response = dict(slots=list())
            response['slots'] = invalid_meetings
            response = jsonify(response)
            status_code = '207'

        app.logger.info('[Meetings][Response]: Status Code: {}'
                        .format(status_code))
        return make_response(response, status_code)
    except exceptions.VitMeetsException as e:
        app.logger.error('[Meetings][Error]: Code: {} Message: '
                         '{}'.format(e.code, e.message))
        abort(e.code, {'message': e.message})

