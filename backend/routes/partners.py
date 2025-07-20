from database.models import Role
from flask import Blueprint, jsonify, request
from schemas import PartnerSchema
from services.partner_service import PartnerService
from validation.auth import token_required

partners_bp = Blueprint("partners_bp", __name__)
partner_schema = PartnerSchema()
partners_schema = PartnerSchema(many=True)


@partners_bp.route("", methods=["GET"])
@token_required(required_role=Role.VIEWER)
def get_partners(current_user_id):
    country = request.args.get("country")
    partner_type = request.args.get("type")
    if country or partner_type:
        partners = PartnerService.search_partners(country, partner_type)
    else:
        partners = PartnerService.get_all_partners()
    return jsonify(partners_schema.dump(partners)), 200


@partners_bp.route("/<int:partner_id>", methods=["GET"])
@token_required(required_role=Role.VIEWER)
def get_partner(current_user_id, partner_id):
    partner = PartnerService.get_partner_by_id(partner_id)
    if not partner:
        return jsonify({"message": "Partner not found"}), 404
    return jsonify(partner_schema.dump(partner)), 200


@partners_bp.route("", methods=["POST"])
@token_required(required_role=Role.MANAGER)
def create_partner(current_user_id):
    data = request.get_json()
    new_partner = PartnerService.create_partner(data)
    return jsonify(partner_schema.dump(new_partner)), 201


@partners_bp.route("/<int:partner_id>", methods=["PUT"])
@token_required(required_role=Role.MANAGER)
def update_partner(current_user_id, partner_id):
    data = request.get_json()
    updated_partner = PartnerService.update_partner(partner_id, data)
    if not updated_partner:
        return jsonify({"message": "Partner not found"}), 404
    return jsonify(partner_schema.dump(updated_partner)), 200


@partners_bp.route("/<int:partner_id>", methods=["DELETE"])
@token_required(required_role=Role.ADMIN)
def delete_partner(current_user_id, partner_id):
    deleted_partner = PartnerService.delete_partner(partner_id)
    if not deleted_partner:
        return jsonify({"message": "Partner not found"}), 404
    return jsonify({"message": "Partner deleted successfully"}), 200
