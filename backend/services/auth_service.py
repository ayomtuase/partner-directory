import os
import datetime
import jwt
from repository.user_repository import UserRepository

class AuthService:

    @staticmethod
    def authenticate(email, password):
        user = UserRepository.get_by_email(email)
        if user and user.check_password(password):
            return user
        return None

    @staticmethod
    def generate_token(user):
        payload = {
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7),
            'iat': datetime.datetime.now(datetime.timezone.utc),
            'sub': user.id,
            'role': user.role.value
        }
        return jwt.encode(
            payload,
            os.getenv('SECRET_KEY', 'my_precious_secret_key'),
            algorithm='HS256'
        )

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, os.getenv('SECRET_KEY', 'my_precious_secret_key'), algorithms=['HS256'])
            return payload['sub'], payload['role']
        except jwt.ExpiredSignatureError:
            return None, None
        except jwt.InvalidTokenError:
            return None, None
