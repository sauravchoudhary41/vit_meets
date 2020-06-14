import sys
from datetime import datetime
from sqlalchemy import exc as db_exception
from werkzeug.security import generate_password_hash, check_password_hash

from src import app
from src import DB as db
from src.models.db import Users
from src.models.db import Meetings
from src.common import exceptions, constants, utils


def check_user(email):
    """ Check the email id exists or not """
    try:
        user_obj = Users.query.filter_by(email=email).first()
        if user_obj:
            return True
        else:
            return False
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()


def validate_user(user_creds):
    """ Validate user credentials """
    email = user_creds['email']
    if not check_user(email):
        raise exceptions.InvalidCredentials()

    try:
        user = Users.query.filter_by(email=email).first()
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()

    user_password = str(user.password)
    if not check_password_hash(user_password, user_creds['password']):
        raise exceptions.InvalidCredentials()

    user_info = utils.from_db_object(constants.USER_FIELDS, user)
    return user_info


def read_users():
    """ Read all users from DB"""
    users_info = dict()
    try:
        users = Users.query.all()
        users_list = utils.from_db_object_list(constants.USER_FIELDS, users)
        users_info['users'] = users_list

        app.logger.debug("Users read successfully")
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()

    return users_info


def read_user(user_id):
    """ Read a user from DB"""
    try:
        user = Users.query.get(user_id)
        if not user:
            raise exceptions.NotFound('user', user_id)
        users_info = utils.from_db_object(constants.USER_FIELDS, user)
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()

    return users_info


def write_user(user_data):
    """ Write a new user to DB """
    pwd_hash = generate_password_hash(user_data['password'])
    name = user_data['name']
    email = user_data['email']

    if check_user(email):
        raise exceptions.AlreadyExists('user')

    try:
        user = Users(name, email, pwd_hash)
        db.session.add(user)
        db.session.commit()
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        db.session.rollback()
        raise exceptions.DBError()


def read_meetings(user_id):
    """ Read all meetings for a user from DB"""
    try:
        meetings = Meetings.query.filter_by(created_by=user_id).all()
        meetings_info = utils.from_db_object_list(constants.MEETINGS_FIELDS,
                                                  meetings)
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()

    return meetings_info


def read_meeting(meeting_id):
    """ Read a meeting from DB """
    try:
        meeting = Meetings.query.get(meeting_id)
        meeting_info = utils.from_db_object(constants.MEETINGS_FIELDS,
                                            meeting)
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        raise exceptions.DBError()

    return meeting_info


def write_meeting(user_id, slot_data):
    """ Write a new meeting to DB """
    start_at = slot_data['start_at']

    try:
        meeting = Meetings(user_id, start_at, "", "", False)
        db.session.add(meeting)
        db.session.commit()
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        db.session.rollback()
        raise exceptions.DBError()


def update_meeting(slot_data):
    """ Update a meeting to DB"""
    meeting = read_meeting(slot_data['meeting_id'])

    meeting.description = slot_data['description']
    meeting.booked_by = slot_data['booked_by']
    meeting.booked_at = datetime.now()
    meeting.is_booked = True

    try:
        db.session.commit()
    except db_exception.SQLAlchemyError as e:
        app.logger.error("DB exception: {}".format(e))
        db.session.rollback()
        raise exceptions.DBError()

