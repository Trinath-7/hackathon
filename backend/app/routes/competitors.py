from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.competitor import Competitor
from app.services.gemini_service import gemini_service

competitors_bp = Blueprint('competitors', __name__)

@competitors_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def analyze_competitors(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_competitor_analysis(
            idea.name, idea.description, idea.industry
        )
        # Clear existing competitors
        Competitor.query.filter_by(startup_id=idea_id).delete()
        for comp_data in result.get('competitors', []):
            comp = Competitor(
                startup_id=idea_id,
                name=comp_data.get('name'),
                website=comp_data.get('website'),
                description=comp_data.get('description'),
                features=comp_data.get('features'),
                pricing=comp_data.get('pricing'),
                strengths=comp_data.get('strengths'),
                weaknesses=comp_data.get('weaknesses'),
                market_share=comp_data.get('market_share'),
                funding_raised=comp_data.get('funding_raised')
            )
            db.session.add(comp)
        db.session.commit()
        return jsonify({'competitor_analysis': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@competitors_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_competitors(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    competitors = Competitor.query.filter_by(startup_id=idea_id).all()
    return jsonify({'competitors': [c.to_dict() for c in competitors]})
