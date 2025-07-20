from app import db
from database.models import Partner

class PartnerRepository:

    @staticmethod
    def get_all():
        return Partner.query.all()

    @staticmethod
    def get_by_id(partner_id):
        return Partner.query.get(partner_id)

    @staticmethod
    def create(name, country, partner_type, partner_group_id, logo_url=None, image_url=None):
        new_partner = Partner(
            name=name, 
            country=country, 
            partner_type=partner_type, 
            partner_group_id=partner_group_id,
            logo_url=logo_url,
            image_url=image_url
        )
        db.session.add(new_partner)
        db.session.commit()
        return new_partner

    @staticmethod
    def update(partner_id, **kwargs):
        partner = Partner.query.get(partner_id)
        if partner:
            for key, value in kwargs.items():
                setattr(partner, key, value)
            db.session.commit()
        return partner

    @staticmethod
    def delete(partner_id):
        partner = Partner.query.get(partner_id)
        if partner:
            db.session.delete(partner)
            db.session.commit()
        return partner

    @staticmethod
    def search(country=None, partner_type=None):
        query = Partner.query
        if country:
            query = query.filter(Partner.country.ilike(f'%{country}%'))
        if partner_type:
            query = query.filter(Partner.partner_type.ilike(f'%{partner_type}%'))
        return query.all()
