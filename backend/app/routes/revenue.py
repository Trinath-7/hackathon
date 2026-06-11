from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.services.gemini_service import gemini_service

revenue_bp = Blueprint('revenue', __name__)

@revenue_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_revenue(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    data = request.get_json()
    model_type = data.get('model_type', 'SaaS')
    try:
        result = gemini_service.generate_revenue_model(
            idea.name, idea.description, idea.industry, model_type
        )
        return jsonify({'revenue_model': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
