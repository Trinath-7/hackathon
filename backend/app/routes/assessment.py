from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.startup import StartupIdea
from app.services.gemini_service import gemini_service

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_assessment(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_assessment(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        return jsonify({'assessment': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
