from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import config

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(app, origins=app.config['CORS_ORIGINS'], supports_credentials=True)

    # Import models to register them
    from app.models import (
        user, startup, market_research, competitor,
        lean_canvas, roadmap, investor,
        marketing_plan, chat_history
    )

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.ideas import ideas_bp
    from app.routes.market import market_bp
    from app.routes.competitors import competitors_bp
    from app.routes.canvas import canvas_bp
    from app.routes.roadmap import roadmap_bp
    from app.routes.revenue import revenue_bp
    from app.routes.branding import branding_bp
    from app.routes.pitchdeck import pitchdeck_bp
    from app.routes.investors import investors_bp
    from app.routes.marketing import marketing_bp
    from app.routes.assessment import assessment_bp
    from app.routes.chat import chat_bp
    from app.routes.trends import trends_bp
    from app.routes.admin import admin_bp
    from app.routes.profile import profile_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(ideas_bp, url_prefix='/api/ideas')
    app.register_blueprint(market_bp, url_prefix='/api/market')
    app.register_blueprint(competitors_bp, url_prefix='/api/competitors')
    app.register_blueprint(canvas_bp, url_prefix='/api/canvas')
    app.register_blueprint(roadmap_bp, url_prefix='/api/roadmap')
    app.register_blueprint(revenue_bp, url_prefix='/api/revenue')
    app.register_blueprint(branding_bp, url_prefix='/api/branding')
    app.register_blueprint(pitchdeck_bp, url_prefix='/api/pitchdeck')
    app.register_blueprint(investors_bp, url_prefix='/api/investors')
    app.register_blueprint(marketing_bp, url_prefix='/api/marketing')
    app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
    app.register_blueprint(chat_bp, url_prefix='/api/chat')
    app.register_blueprint(trends_bp, url_prefix='/api/trends')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(profile_bp, url_prefix='/api/profile')

    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'message': 'StartupOS AI Backend Running'}

    return app
