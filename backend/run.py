from app import create_app, db
from app.models.user import User

app = create_app('development')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Seed demo user
        demo_user = User.query.filter_by(email='demo@startupos.ai').first()
        if not demo_user:
            demo_user = User(
                name='Demo Founder',
                email='demo@startupos.ai',
                role='admin',
                is_verified=True,
                company='StartupOS AI Inc.'
            )
            demo_user.set_password('password123')
            db.session.add(demo_user)
            db.session.commit()
            print("Demo user seeded successfully!")
    app.run(debug=True, port=5000)
