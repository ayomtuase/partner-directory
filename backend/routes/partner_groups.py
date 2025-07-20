from database.models import Role
from flask import Blueprint, jsonify, request
from schemas import PartnerGroupSchema
from services.partner_group_service import PartnerGroupService
from validation.auth import token_required

partner_groups_bp = Blueprint("partner_groups_bp", __name__)
partner_group_schema = PartnerGroupSchema()
partner_groups_schema = PartnerGroupSchema(many=True)


@partner_groups_bp.route("", methods=["GET"])
@token_required(required_role=Role.VIEWER)
def get_partner_groups(current_user_id):
    groups = PartnerGroupService.get_all_groups()
    return jsonify(partner_groups_schema.dump(groups)), 200


@partner_groups_bp.route("/<int:group_id>", methods=["GET"])
@token_required(required_role=Role.VIEWER)
def get_partner_group(current_user_id, group_id):
    group = PartnerGroupService.get_group_by_id(group_id)
    if not group:
        return jsonify({"message": "Partner group not found"}), 404
    return jsonify(partner_group_schema.dump(group)), 200


@partner_groups_bp.route("", methods=["POST"])
@token_required(required_role=Role.ADMIN)
def create_partner_group(current_user_id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"message": "Name is required"}), 400
    new_group = PartnerGroupService.create_group(name)
    return jsonify(partner_group_schema.dump(new_group)), 201


@partner_groups_bp.route("/<int:group_id>", methods=["PUT"])
@token_required(required_role=Role.MANAGER)
def update_partner_group(current_user_id, group_id):
    data = request.get_json()
    name = data.get("name")
    if not name:
        return jsonify({"message": "Name is required"}), 400
    updated_group = PartnerGroupService.update_group(group_id, name)
    if not updated_group:
        return jsonify({"message": "Partner group not found"}), 404
    return jsonify(partner_group_schema.dump(updated_group)), 200


@partner_groups_bp.route("/<int:group_id>", methods=["DELETE"])
@token_required(required_role=Role.ADMIN)
def delete_partner_group(current_user_id, group_id):
    deleted_group = PartnerGroupService.delete_group(group_id)
    if not deleted_group:
        return jsonify({"message": "Partner group not found"}), 404
    return jsonify({"message": "Partner group deleted successfully"}), 200
