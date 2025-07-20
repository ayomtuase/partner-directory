from app import db
from database.models import User
from sqlalchemy.orm import joinedload


class UserRepository:

    @staticmethod
    def get_all():
        return User.query.options(joinedload(User.partner)).all()

    @staticmethod
    def get_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_by_email(email):
        return User.query.filter_by(email=email).first()

    @staticmethod
    def create(email, password, role, first_name, last_name, partner_id=None):
        new_user = User(
            email=email,
            role=role,
            first_name=first_name,
            last_name=last_name,
            partner_id=partner_id,
        )
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return new_user

    @staticmethod
    def update(user_id, **kwargs):
        user = User.query.get(user_id)
        if user:
            if "password" in kwargs:
                user.set_password(kwargs.pop("password"))
            for key, value in kwargs.items():
                setattr(user, key, value)
            db.session.commit()
        return user

    @staticmethod
    def delete(user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
        return user
