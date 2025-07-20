import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

load_dotenv()

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)
api = Api(app)

from database.models import *

migrate = Migrate(app, db)

# Register Blueprints
from routes.auth import auth_bp
from routes.partner_groups import partner_groups_bp
from routes.partners import partners_bp
from routes.users import users_bp

app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(partner_groups_bp, url_prefix="/partner-groups")
app.register_blueprint(partners_bp, url_prefix="/partners")
app.register_blueprint(users_bp, url_prefix="/users")

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})


@app.route("/")
def index():
    return "Travel Partner Directory REST API!"
