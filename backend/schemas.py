from marshmallow import Schema, fields, validate, validates, ValidationError
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from database.models import PartnerGroup, Partner, User, Role

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

class UserBaseSchema(Schema):
    email = fields.Email(
        required=False,
        error_messages={
            "invalid": "Please provide a valid email address",
            "null": "Email cannot be blank!"
        }
    )
    password = fields.String(
        required=False,
        validate=validate.Length(
            min=6,
            error="Password must be at least 6 characters"
        ) if None else None
    )
    role = fields.String(
        required=False,
        validate=validate.OneOf(
            [role.value for role in Role],
            error="Invalid role. Must be one of: {choices}"
        ) if None else None
    )
    first_name = fields.String(
        required=False,
        validate=validate.Length(
            min=1,
            error="First name cannot be blank"
        ) if None else None
    )
    last_name = fields.String(
        required=False,
        validate=validate.Length(
            min=1,
            error="Last name cannot be blank"
        ) if None else None
    )

class UserCreateSchema(UserBaseSchema):
    email = fields.Email(
        required=True,
        error_messages={
            "required": "Email is required",
            "invalid": "Please provide a valid email address",
            "null": "Email cannot be blank!"
        }
    )
    password = fields.String(
        required=True,
        error_messages={
            "required": "Password is required",
            "null": "Password cannot be blank!"
        },
        validate=validate.Length(min=6, error="Password must be at least 6 characters")
    )
    role = fields.String(
        required=True,
        error_messages={
            "required": "Role is required",
            "null": "Role cannot be blank!"
        },
        validate=validate.OneOf(
            [role.value for role in Role],
            error="Invalid role. Must be one of: {choices}"
        )
    )
    first_name = fields.String(
        required=True,
        error_messages={
            "required": "First name is required",
            "null": "First name cannot be blank!"
        },
        validate=validate.Length(min=1, error="First name cannot be blank")
    )
    last_name = fields.String(
        required=True,
        error_messages={
            "required": "Last name is required",
            "null": "Last name cannot be blank!"
        },
        validate=validate.Length(min=1, error="Last name cannot be blank")
    )

    @validates('email')
    def validate_email(self, value):
        if value is not None:
            if not value.strip():
                raise ValidationError("Email cannot be blank!")
            if User.query.filter(User.email == value, User.id != self.context.get('user_id')).first():
                raise ValidationError('Email already exists')

    def load_data(self, data, partial=False):
        try:
            if not partial and isinstance(self, UserCreateSchema):
                missing_fields = [field for field in self.fields if field not in data or data[field] is None]
                if missing_fields:
                    raise ValidationError({
                        field: ["Missing data for required field."]
                        for field in missing_fields
                    })

            result = self.load(data, partial=partial)

            if 'role' in result and result['role'] is not None:
                try:
                    result['role'] = Role(result['role'])
                except ValueError:
                    raise ValidationError({
                        'role': [f"Invalid role. Must be one of: {[r.value for r in Role]}"]
                    })

            return result

        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(str(e))
