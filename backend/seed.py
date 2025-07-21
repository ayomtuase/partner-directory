import random
from datetime import datetime, timedelta

from app import app, db
from database.models import Partner, PartnerGroup, Role, User
from werkzeug.security import generate_password_hash


def seed_database():
    with app.app_context():
        # Clear existing data
        print("Clearing existing data...")
        db.session.query(User).delete()
        db.session.query(Partner).delete()
        db.session.query(PartnerGroup).delete()
        db.session.commit()

        print("Creating partner groups...")
        group_names = [
            "Technology Partners",
            "Consulting Partners",
            "Integration Partners",
            "Reseller Partners",
        ]
        groups = []
        for name in group_names:
            group = PartnerGroup(name=name)
            db.session.add(group)
            groups.append(group)
        db.session.commit()

        print("Creating partners...")
        partner_data = [
            {
                "name": "Tech Solutions Inc.",
                "country": "United States",
                "type": "Enterprise",
                "group": 1,
            },
            {
                "name": "Cloud Innovators",
                "country": "Canada",
                "type": "Cloud",
                "group": 1,
            },
            {
                "name": "Data Systems",
                "country": "United Kingdom",
                "type": "Data",
                "group": 2,
            },
            {
                "name": "Web Services Co.",
                "country": "Germany",
                "type": "Web",
                "group": 3,
            },
            {"name": "Mobile First", "country": "Japan", "type": "Mobile", "group": 3},
        ]

        partners = []
        for data in partner_data:
            partner = Partner(
                name=data["name"],
                country=data["country"],
                partner_type=data["type"],
                logo_url=f"https://logo.clearbit.com/{data['name'].lower().replace(' ', '')}.com?size=200",
                image_url=f"https://source.unsplash.com/random/800x400?{data['type']}",
                partner_group_id=groups[data["group"]].id,
            )
            db.session.add(partner)
            partners.append(partner)
        db.session.commit()

        print("Creating users...")
        user_data = [
            {
                "first_name": "Admin",
                "last_name": "User",
                "email": "admin@example.com",
                "role": Role.ADMIN,
                "partner": None,
            },
            {
                "first_name": "Manager",
                "last_name": "One",
                "email": "manager1@example.com",
                "role": Role.MANAGER,
                "partner": 1,
            },
            {
                "first_name": "Manager",
                "last_name": "Two",
                "email": "manager2@example.com",
                "role": Role.MANAGER,
                "partner": 2,
            },
            {
                "first_name": "Viewer",
                "last_name": "One",
                "email": "viewer1@example.com",
                "role": Role.VIEWER,
                "partner": 3,
            },
            {
                "first_name": "Viewer",
                "last_name": "Two",
                "email": "viewer2@example.com",
                "role": Role.VIEWER,
                "partner": 4,
            },
        ]

        for data in user_data:
            user = User(
                first_name=data["first_name"],
                last_name=data["last_name"],
                email=data["email"],
                role=data["role"],
                partner_id=(
                    partners[data["partner"]].id
                    if data["partner"] is not None
                    else None
                ),
            )
            user.set_password("password123")
            db.session.add(user)

        for partner in partners:
            for i in range(1, 4):
                user = User(
                    first_name=f"User{i}",
                    last_name=partner.name.split()[0],
                    email=f"user{i}.{partner.name.lower().replace(' ', '')}@example.com",
                    role=random.choice([Role.VIEWER, Role.MANAGER]),
                    partner_id=partner.id,
                )
                user.set_password("password123")
                db.session.add(user)

        db.session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    seed_database()
