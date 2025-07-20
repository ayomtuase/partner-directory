from repository.partner_group_repository import PartnerGroupRepository

class PartnerGroupService:

    @staticmethod
    def get_all_groups():
        return PartnerGroupRepository.get_all()

    @staticmethod
    def get_group_by_id(group_id):
        return PartnerGroupRepository.get_by_id(group_id)

    @staticmethod
    def create_group(name):
        return PartnerGroupRepository.create(name)

    @staticmethod
    def update_group(group_id, name):
        return PartnerGroupRepository.update(group_id, name)

    @staticmethod
    def delete_group(group_id):
        return PartnerGroupRepository.delete(group_id)
