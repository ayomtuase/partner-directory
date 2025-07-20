from database.models import Role
from flask import Blueprint, jsonify, request
from flask_restful import reqparse
from schemas import UserSchema
from services.user_service import UserService
from validation.auth import token_required

users_bp = Blueprint("users_bp", __name__)
user_schema = UserSchema()
users_schema = UserSchema(many=True)


@users_bp.route("", methods=["GET"])
@token_required(required_role=Role.MANAGER)
def get_users(current_user_id):
    users = UserService.get_all_users()
    return jsonify(users_schema.dump(users)), 200


@users_bp.route("/<int:user_id>", methods=["GET"])
@token_required(required_role=Role.MANAGER)
def get_user(current_user_id, user_id):
    user = UserService.get_user_by_id(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user_schema.dump(user)), 200


@users_bp.route("", methods=["POST"])
def create_user():
    parser = reqparse.RequestParser()
    parser.add_argument("email", required=True, type=str, help="Email cannot be blank!")
    parser.add_argument(
        "password", required=True, type=str, help="Password cannot be blank!"
    )
    parser.add_argument("role", required=True, type=str, help="Role cannot be blank!")
    parser.add_argument(
        "first_name", required=True, type=str, help="First name cannot be blank!"
    )
    parser.add_argument(
        "last_name", required=True, type=str, help="Last name cannot be blank!"
    )
    args = parser.parse_args()
    if not args:
        return jsonify({"errors": parser.errors}), 400
    data = args
    new_user = UserService.create_user(data)
    return jsonify(user_schema.dump(new_user)), 201


@users_bp.route("/<int:user_id>", methods=["PUT"])
@token_required(required_role=Role.ADMIN)
def update_user(current_user_id, user_id):
    data = request.get_json()
    updated_user = UserService.update_user(user_id, data)
    if not updated_user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(user_schema.dump(updated_user)), 200


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@token_required(required_role=Role.ADMIN)
def delete_user(current_user_id, user_id):
    deleted_user = UserService.delete_user(user_id)
    if not deleted_user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "User deleted successfully"}), 200
