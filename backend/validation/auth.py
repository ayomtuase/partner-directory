from functools import wraps
from flask import request, jsonify
from services.auth_service import AuthService
from database.models import Role

def token_required(required_role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = None
            if 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header.split(' ')[1]

            if not token:
                return jsonify({'message': 'Token is missing!'}), 401

            user_id, user_role = AuthService.verify_token(token)

            if not user_id:
                return jsonify({'message': 'Token is invalid or expired!'}), 401

            if required_role == Role.ADMIN and user_role != 'ADMIN':
                return jsonify({'message': 'Admin role required!'}), 403
            if required_role == Role.MANAGER and user_role not in ['ADMIN', 'MANAGER']:
                return jsonify({'message': 'Manager or Admin role required!'}), 403

            return f(user_id, *args, **kwargs)
        return decorated_function
    return decorator
