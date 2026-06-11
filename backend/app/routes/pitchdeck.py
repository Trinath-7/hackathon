from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.roadmap import PitchDeck
from app.services.gemini_service import gemini_service

pitchdeck_bp = Blueprint('pitchdeck', __name__)

@pitchdeck_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_pitch_deck(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_pitch_deck(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        deck = PitchDeck.query.filter_by(startup_id=idea_id).first()
        if not deck:
            deck = PitchDeck(startup_id=idea_id)
            db.session.add(deck)
        deck.title_slide = result.get('title_slide')
        deck.problem_slide = result.get('problem_slide')
        deck.solution_slide = result.get('solution_slide')
        deck.market_slide = result.get('market_slide')
        deck.product_slide = result.get('product_slide')
        deck.business_model_slide = result.get('business_model_slide')
        deck.gtm_slide = result.get('gtm_slide')
        deck.financials_slide = result.get('financials_slide')
        deck.funding_ask_slide = result.get('funding_ask_slide')
        deck.team_slide = result.get('team_slide')
        db.session.commit()
        return jsonify({'pitch_deck': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pitchdeck_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_pitch_deck(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    deck = PitchDeck.query.filter_by(startup_id=idea_id).first()
    return jsonify({'pitch_deck': deck.to_dict() if deck else None})
