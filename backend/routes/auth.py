from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from services.user_service import UserService
from database.models import Role
from validation.auth import token_required


auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Email and password are required'}), 400

    user = AuthService.authenticate(email, password)

    if not user:
        return jsonify({'message': 'Invalid credentials'}), 401

    token = AuthService.generate_token(user)
    return jsonify({'token': token})


@auth_bp.route('/me', methods=['GET'])
@token_required(required_role=Role.VIEWER)
def get_current_user(current_user_id):
    user = UserService.get_current_user(current_user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'role': user.role.value,
        'created_at': user.created_at.isoformat() if user.created_at else None,
        'updated_at': user.updated_at.isoformat() if user.updated_at else None
    }), 200
