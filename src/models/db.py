import os
from datetime import datetime
from sqlalchemy import create_engine

from src import DB as db


class Users(db.Model):
    """
    Table to store users data.
    """
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('user_name', db.String(45))
    email = db.Column('email', db.String(100))
    password = db.Column('password', db.String(200))
    created_at = db.Column('created_at', db.DateTime)
    updated_at = db.Column('updated_at', db.DateTime)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.updated_at = datetime.now()
        self.created_at = datetime.now()

    def __repr__(self):
        return '<Users %r>' % self.name


class Meetings(db.Model):
    """
    Table to store meetings information
    """
    __tablename__ = 'meetings'
    id = db.Column(db.Integer, primary_key=True)
    created_by = db.Column('created_by', db.String(200))
    created_at = db.Column('created_at', db.DateTime)
    start_at = db.Column('start_at', db.DateTime)
    end_at = db.Column('end_at', db.DateTime)
    description = db.Column('description', db.String(200))
    booked_by = db.Column('booked_by', db.String(200))
    booked_at = db.Column('booked_at', db.DateTime)
    is_booked = db.Column('is_booked', db.Boolean, default=False)

    def __init__(self, created_by, start_at, end_at, description,
                 booked_by, booked_at, is_booked):
        self.created_by = created_by
        self.created_at = datetime.now()
        self.start_at = start_at
        self.end_at = end_at
        self.description = description
        self.booked_by = booked_by
        self.booked_at = booked_at
        self.is_booked = is_booked

    def __repr__(self):
        return '<Meetings %r>' % self.description


# Create and initialize database and all required tables
db_name = "vit_meets_db"
db_uri = os.environ["DATABASE_URL"].rsplit("/", 1)[0] + "/mysql"

engine = create_engine(db_uri)
create_db_cmd = "CREATE DATABASE IF NOT EXISTS %s;" % db_name
engine.execute(create_db_cmd)
engine.execute("USE %s;" % db_name)

db.create_all()
db.session.commit()
