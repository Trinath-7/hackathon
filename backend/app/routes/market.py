from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.market_research import MarketResearch
from app.services.gemini_service import gemini_service

market_bp = Blueprint('market', __name__)

@market_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_market_research(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_market_research(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        mr = MarketResearch.query.filter_by(startup_id=idea_id).first()
        if not mr:
            mr = MarketResearch(startup_id=idea_id)
            db.session.add(mr)
        mr.industry_analysis = result.get('industry_analysis')
        mr.market_size = result.get('market_size')
        mr.tam = result.get('tam')
        mr.sam = result.get('sam')
        mr.som = result.get('som')
        mr.market_trends = result.get('market_trends')
        mr.swot_analysis = result.get('swot_analysis')
        mr.customer_personas = result.get('customer_personas')
        mr.growth_opportunities = result.get('growth_opportunities')
        mr.market_growth_rate = result.get('market_growth_rate')
        idea.market_potential_score = min(result.get('market_growth_rate', 0) * 2, 100)
        db.session.commit()
        return jsonify({'market_research': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@market_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_market_research(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    mr = MarketResearch.query.filter_by(startup_id=idea_id).first()
    if not mr:
        return jsonify({'market_research': None})
    return jsonify({'market_research': mr.to_dict()})
