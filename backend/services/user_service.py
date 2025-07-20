from repository.user_repository import UserRepository
from database.models import User

class UserService:

    @staticmethod
    def get_all_users():
        return UserRepository.get_all()

    @staticmethod
    def get_user_by_id(user_id):
        return UserRepository.get_by_id(user_id)

    @staticmethod
    def create_user(data):
        return UserRepository.create(**data)

    @staticmethod
    def update_user(user_id, data):
        return UserRepository.update(user_id, **data)

    @staticmethod
    def delete_user(user_id):
        return UserRepository.delete(user_id)
        
    @staticmethod
    def get_current_user(user_id):
        user = UserRepository.get_by_id(user_id)
        if not user:
            return None
        return user
