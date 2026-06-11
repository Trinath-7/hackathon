from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.services.gemini_service import gemini_service

ideas_bp = Blueprint('ideas', __name__)

@ideas_bp.route('/', methods=['GET'])
@jwt_required()
def get_ideas():
    user_id = get_jwt_identity()
    ideas = StartupIdea.query.filter_by(user_id=user_id).order_by(StartupIdea.created_at.desc()).all()
    return jsonify({'ideas': [i.to_dict() for i in ideas]})

@ideas_bp.route('/', methods=['POST'])
@jwt_required()
def create_idea():
    user_id = get_jwt_identity()
    data = request.get_json()
    idea = StartupIdea(
        user_id=user_id,
        name=data.get('name'),
        description=data.get('description'),
        industry=data.get('industry'),
        target_audience=data.get('target_audience')
    )
    db.session.add(idea)
    db.session.commit()
    return jsonify({'idea': idea.to_dict()}), 201

@ideas_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_idea(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    return jsonify({'idea': idea.to_dict()})

@ideas_bp.route('/<int:idea_id>', methods=['PUT'])
@jwt_required()
def update_idea(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    data = request.get_json()
    for field in ['name', 'description', 'industry', 'target_audience', 'status', 'is_bookmarked']:
        if field in data:
            setattr(idea, field, data[field])
    db.session.commit()
    return jsonify({'idea': idea.to_dict()})

@ideas_bp.route('/<int:idea_id>', methods=['DELETE'])
@jwt_required()
def delete_idea(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    db.session.delete(idea)
    db.session.commit()
    return jsonify({'message': 'Idea deleted'})

@ideas_bp.route('/<int:idea_id>/validate', methods=['POST'])
@jwt_required()
def validate_idea(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.validate_startup_idea(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        idea.validation_score = result.get('validation_score', 0)
        idea.success_probability = result.get('success_probability', 0)
        idea.feasibility_report = result.get('feasibility_report', '')
        idea.risk_analysis = result.get('risk_analysis', [])
        idea.improvement_suggestions = result.get('improvement_suggestions', [])
        idea.market_potential_score = result.get('market_fit', 0)
        idea.status = 'validated'
        db.session.commit()
        return jsonify({'validation': result, 'idea': idea.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
