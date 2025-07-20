from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from database.models import PartnerGroup, Partner, User

class PartnerGroupSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = PartnerGroup
        load_instance = True
        include_fk = True

class PartnerSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Partner
        load_instance = True
        include_fk = True

class UserSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = User
        load_instance = True
        include_fk = True
        exclude = ('password_hash',)
