from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.marketing_plan import MarketingPlan
from app.services.gemini_service import gemini_service

marketing_bp = Blueprint('marketing', __name__)

@marketing_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_marketing(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_marketing_strategy(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        plan = MarketingPlan.query.filter_by(startup_id=idea_id).first()
        if not plan:
            plan = MarketingPlan(startup_id=idea_id)
            db.session.add(plan)
        plan.seo_plan = result.get('seo_plan')
        plan.content_plan = result.get('content_plan')
        plan.social_media_strategy = result.get('social_media_strategy')
        plan.growth_hacks = result.get('growth_hacks')
        plan.customer_acquisition_strategy = result.get('customer_acquisition_strategy')
        plan.weekly_calendar = result.get('weekly_calendar')
        plan.campaign_suggestions = result.get('campaign_suggestions')
        plan.email_marketing = result.get('email_marketing')
        db.session.commit()
        return jsonify({'marketing_plan': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@marketing_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_marketing(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    plan = MarketingPlan.query.filter_by(startup_id=idea_id).first()
    return jsonify({'marketing_plan': plan.to_dict() if plan else None})
