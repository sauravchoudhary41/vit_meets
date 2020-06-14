
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import os
import logging
import time
from logging.handlers import RotatingFileHandler

app = Flask(__name__)

# Get the SQL url
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get('DATABASE_URL')
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY') or 'dev_key'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialize SQLAlchemy Database Connector
DB = SQLAlchemy(app)

from src.controllers import auth, index, meetings, users
HOME = os.environ.get('HOME')
LOG_DIR = os.path.join(HOME, 'log/vit_meets')
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

LOG_FILE_NAME = os.path.join(LOG_DIR, 'rest_api.log')
LOG_FILE_HANDLER = RotatingFileHandler(
    filename=LOG_FILE_NAME,
    maxBytes=1024 * 1024,
    backupCount=10)
LOG_FORMAT = r"[%(asctime)s] %(levelname)s [%(name)s." \
             r"%(funcName)s:%(lineno)d] %(message)s"
FORMATTER = logging.Formatter(LOG_FORMAT)
FORMATTER.converter = time.localtime
LOG_FILE_HANDLER.setFormatter(FORMATTER)
app.logger.addHandler(LOG_FILE_HANDLER)
app.logger.setLevel(logging.DEBUG)
