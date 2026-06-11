from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.roadmap import Roadmap
from app.services.gemini_service import gemini_service

roadmap_bp = Blueprint('roadmap', __name__)

@roadmap_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_roadmap(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_roadmap(idea.name, idea.description, idea.industry)
        roadmap = Roadmap.query.filter_by(startup_id=idea_id).first()
        if not roadmap:
            roadmap = Roadmap(startup_id=idea_id)
            db.session.add(roadmap)
        roadmap.phase1 = result.get('phase1')
        roadmap.phase2 = result.get('phase2')
        roadmap.phase3 = result.get('phase3')
        roadmap.milestones = result.get('milestones')
        roadmap.tech_stack_suggestions = result.get('tech_stack_suggestions')
        db.session.commit()
        return jsonify({'roadmap': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@roadmap_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_roadmap(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    roadmap = Roadmap.query.filter_by(startup_id=idea_id).first()
    return jsonify({'roadmap': roadmap.to_dict() if roadmap else None})


# Revenue routes
from flask import Blueprint as RBlueprint
revenue_bp = RBlueprint('revenue', __name__)

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
