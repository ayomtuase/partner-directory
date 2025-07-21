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

def create_field(field_type, required=False, **kwargs):
    """Helper function to create field with common configurations."""
    common_error_messages = {
        "required": f"{field_type.__name__.replace('Field', '').title()} is required",
        "null": f"{field_type.__name__.replace('Field', '').title()} cannot be blank!"
    }
    
    field_args = {
        'required': required,
        'error_messages': {
            **common_error_messages,
            **kwargs.pop('error_messages', {})
        },
        **kwargs
    }
    
    if not required:
        field_args['allow_none'] = True
        field_args['load_default'] = None
    
    return field_type(**field_args)

class UserBaseSchema(Schema):
    """Base schema with common field definitions and validation logic."""
    
    # Common field configurations
    email = fields.Email(
        required=False,
        error_messages={
            "invalid": "Please provide a valid email address"
        },
        allow_none=True
    )
    password = fields.String(
        required=False,
        validate=validate.Length(min=6, error="Password must be at least 6 characters"),
        allow_none=True
    )
    role = fields.String(
        required=False,
        validate=validate.OneOf(
            [role.value for role in Role],
            error="Invalid role. Must be one of: {choices}"
        ),
        allow_none=True
    )
    first_name = fields.String(
        required=False,
        validate=validate.Length(min=1, error="First name cannot be blank"),
        allow_none=True
    )
    last_name = fields.String(
        required=False,
        validate=validate.Length(min=1, error="Last name cannot be blank"),
        allow_none=True
    )

    @validates('email')
    def validate_email(self, value):
        if value is not None and value.strip():
            if User.query.filter(User.email == value, User.id != self.context.get('user_id')).first():
                raise ValidationError('Email already exists')
        elif value is not None:  # Empty string after strip()
            raise ValidationError("Email cannot be blank!")

    def _process_role(self, result):
        if 'role' in result and result['role'] is not None:
            try:
                result['role'] = Role(result['role'])
            except ValueError:
                raise ValidationError({
                    'role': [f"Invalid role. Must be one of: {[r.value for r in Role]}"]
                })
        return result

    def load_data(self, data, partial=False):
        try:
            if not partial and hasattr(self, '_required_fields'):
                missing_fields = [
                    field for field in self._required_fields 
                    if field not in data or data[field] is None
                ]
                if missing_fields:
                    raise ValidationError({
                        field: ["Missing data for required field."]
                        for field in missing_fields
                    })

            result = self.load(data, partial=partial)
            return self._process_role(result)

        except ValidationError as e:
            raise e
        except Exception as e:
            raise ValidationError(str(e))


class UserCreateSchema(UserBaseSchema):
    """Schema for creating new users with all required fields."""
    _required_fields = ['email', 'password', 'role', 'first_name', 'last_name']
    
    email = fields.Email(
        required=True,
        error_messages={"invalid": "Please provide a valid email address"}
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=6, error="Password must be at least 6 characters")
    )
    role = fields.String(
        required=True,
        validate=validate.OneOf(
            [role.value for role in Role],
            error="Invalid role. Must be one of: {choices}"
        )
    )
    first_name = fields.String(
        required=True,
        validate=validate.Length(min=1, error="First name cannot be blank")
    )
    last_name = fields.String(
        required=True,
        validate=validate.Length(min=1, error="Last name cannot be blank")
    )


class UserUpdateSchema(UserBaseSchema):
    """Schema for updating user information. All fields are optional."""
    pass
