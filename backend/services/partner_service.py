from repository.partner_repository import PartnerRepository

class PartnerService:

    @staticmethod
    def get_all_partners():
        return PartnerRepository.get_all()

    @staticmethod
    def get_partner_by_id(partner_id):
        return PartnerRepository.get_by_id(partner_id)

    @staticmethod
    def create_partner(data):
        return PartnerRepository.create(**data)

    @staticmethod
    def update_partner(partner_id, data):
        return PartnerRepository.update(partner_id, **data)

    @staticmethod
    def delete_partner(partner_id):
        return PartnerRepository.delete(partner_id)

    @staticmethod
    def search_partners(country=None, partner_type=None):
        return PartnerRepository.search(country, partner_type)
