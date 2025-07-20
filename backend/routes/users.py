from database.models import Role, User
from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from schemas import UserCreateSchema, UserSchema, UserUpdateSchema
from services.user_service import UserService
from validation.auth import token_required
from werkzeug.security import generate_password_hash

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
    try:
        # Get JSON data from request
        request_data = request.get_json()
        if not request_data:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "No input data provided",
                        "errors": ["Request body must be JSON"],
                    }
                ),
                400,
            )

        # Validate and deserialize input
        schema = UserCreateSchema()
        try:
            # This will validate and convert the data
            data = schema.load_data(request_data)
        except ValidationError as e:
            # Handle marshmallow validation errors
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Validation error",
                        "errors": [
                            f"{field}: {msg}"
                            for field, msgs in e.messages.items()
                            for msg in (msgs if isinstance(msgs, list) else [msgs])
                        ],
                    }
                ),
                400,
            )
        except ValueError as e:
            # Handle value errors (e.g., invalid enum values)
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Validation error",
                        "errors": [str(e)],
                    }
                ),
                400,
            )

        # Create user with validated data
        new_user = UserService.create_user(data)
        return (
            jsonify(
                {
                    "success": True,
                    "message": "User created successfully",
                    "data": user_schema.dump(new_user),
                }
            ),
            201,
        )

    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected error occurred",
                    "error": str(e),
                }
            ),
            500,
        )


@users_bp.route("/<int:user_id>", methods=["PUT"])
@token_required(required_role=Role.ADMIN)
def update_user(current_user_id, user_id):
    try:
        request_data = request.get_json()
        if not request_data:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "No input data provided",
                        "errors": ["Request body must be JSON"],
                    }
                ),
                400,
            )

        user = UserService.get_user_by_id(user_id)
        if not user:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "User not found",
                        "errors": [f"User with ID {user_id} does not exist"],
                    }
                ),
                404,
            )

        schema = UserUpdateSchema(user_id=user_id)
        try:
            data = schema.load_data(request_data, partial=True)
            if 'password' in data and data['password'] is not None:
                data['password_hash'] = generate_password_hash(data.pop('password'))

            updated_user = UserService.update_user(user_id, data)

            if not updated_user:
                return (
                    jsonify(
                        {
                            "success": False,
                            "message": "Failed to update user",
                            "errors": ["An error occurred while updating the user"],
                        }
                    ),
                    500,
                )

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "User updated successfully",
                        "data": user_schema.dump(updated_user),
                    }
                ),
                200,
            )

        except ValidationError as e:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Validation error",
                        "errors": [
                            f"{field}: {msg}"
                            for field, msgs in e.messages.items()
                            for msg in (msgs if isinstance(msgs, list) else [msgs])
                        ],
                    }
                ),
                400,
            )
        except ValueError as e:
            return (
                jsonify(
                    {
                        "success": False,
                        "message": "Validation error",
                        "errors": [str(e)],
                    }
                ),
                400,
            )

    except Exception as e:
        return (
            jsonify(
                {
                    "success": False,
                    "message": "An unexpected error occurred",
                    "error": str(e),
                }
            ),
            500,
        )


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@token_required(required_role=Role.ADMIN)
def delete_user(current_user_id, user_id):
    deleted_user = UserService.delete_user(user_id)
    if not deleted_user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({"message": "User deleted successfully"}), 200
