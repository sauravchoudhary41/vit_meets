#!/usr/bin/env bash

APP_PATH=`pwd`

# Deploy the app
#echo "Installing the required python packages.."
#pip install -r requirements.txt

echo ""
#mkdir -p /var/log/vim_meets/

echo "Provision the Heroku MySQL.."
heroku addons:create cleardb:ignite

read SQLALCHEMY_DATABASE_URI <<< $(heroku config | grep CLEARDB_DATABASE_URL | cut -f2 -d'=' | cut -f2 -d' ')
export SQLALCHEMY_DATABASE_URI=SQLALCHEMY_DATABASE_URI

echo "Starting Vit Meets app in the background.."
cd app
python main.py > /var/log/vim_meets/app.log 2>&1 &
