from datetime import datetime
from enum import Enum

from app import db
from sqlalchemy import func
from werkzeug.security import check_password_hash, generate_password_hash


class Role(Enum):
    ADMIN = "ADMIN"
    MANAGER = "MANAGER"
    VIEWER = "VIEWER"


class PartnerGroup(db.Model):
    __tablename__ = "partner_groups"
    id = db.Column(db.Integer, db.Sequence("partner_groups_id_seq"), primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    partners = db.relationship("Partner", backref="group", lazy=True)


class Partner(db.Model):
    __tablename__ = "partners"
    id = db.Column(db.Integer, db.Sequence("partners_id_seq"), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    partner_type = db.Column(db.String(50), nullable=False)
    logo_url = db.Column(db.String(255), nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    partner_group_id = db.Column(
        db.Integer, db.ForeignKey("partner_groups.id"), nullable=False
    )
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    users = db.relationship("User", back_populates="partner", lazy="select")


class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, db.Sequence("users_id_seq"), primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.Enum(Role), default=Role.VIEWER, nullable=False)
    partner_id = db.Column(db.Integer, db.ForeignKey("partners.id"), nullable=True)
    partner = db.relationship("Partner", back_populates="users")
    created_at = db.Column(db.DateTime, server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
