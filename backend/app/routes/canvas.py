from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.startup import StartupIdea
from app.models.lean_canvas import LeanCanvas
from app.services.gemini_service import gemini_service

canvas_bp = Blueprint('canvas', __name__)

@canvas_bp.route('/<int:idea_id>', methods=['POST'])
@jwt_required()
def generate_canvas(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    try:
        result = gemini_service.generate_lean_canvas(
            idea.name, idea.description, idea.industry, idea.target_audience
        )
        canvas = LeanCanvas.query.filter_by(startup_id=idea_id).first()
        if not canvas:
            canvas = LeanCanvas(startup_id=idea_id)
            db.session.add(canvas)
        canvas.problem = result.get('problem')
        canvas.solution = result.get('solution')
        canvas.unique_value_proposition = result.get('unique_value_proposition')
        canvas.unfair_advantage = result.get('unfair_advantage')
        canvas.customer_segments = result.get('customer_segments')
        canvas.key_metrics = result.get('key_metrics')
        canvas.channels = result.get('channels')
        canvas.revenue_streams = result.get('revenue_streams')
        canvas.cost_structure = result.get('cost_structure')
        db.session.commit()
        return jsonify({'lean_canvas': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@canvas_bp.route('/<int:idea_id>', methods=['GET'])
@jwt_required()
def get_canvas(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    canvas = LeanCanvas.query.filter_by(startup_id=idea_id).first()
    return jsonify({'lean_canvas': canvas.to_dict() if canvas else None})

@canvas_bp.route('/<int:idea_id>', methods=['PUT'])
@jwt_required()
def update_canvas(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    canvas = LeanCanvas.query.filter_by(startup_id=idea_id).first_or_404()
    data = request.get_json()
    for field in ['problem', 'solution', 'unique_value_proposition', 'unfair_advantage',
                  'customer_segments', 'key_metrics', 'channels', 'revenue_streams', 'cost_structure']:
        if field in data:
            setattr(canvas, field, data[field])
    db.session.commit()
    return jsonify({'lean_canvas': canvas.to_dict()})
