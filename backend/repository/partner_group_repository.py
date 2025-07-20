from app import db
from database.models import PartnerGroup

class PartnerGroupRepository:

    @staticmethod
    def get_all():
        return PartnerGroup.query.all()

    @staticmethod
    def get_by_id(group_id):
        return PartnerGroup.query.get(group_id)

    @staticmethod
    def create(name):
        new_group = PartnerGroup(name=name)
        db.session.add(new_group)
        db.session.commit()
        return new_group

    @staticmethod
    def update(group_id, name):
        group = PartnerGroup.query.get(group_id)
        if group:
            group.name = name
            db.session.commit()
        return group

    @staticmethod
    def delete(group_id):
        group = PartnerGroup.query.get(group_id)
        if group:
            db.session.delete(group)
            db.session.commit()
        return group
