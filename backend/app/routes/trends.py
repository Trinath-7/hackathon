from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.gemini_service import gemini_service

trends_bp = Blueprint('trends', __name__)

@trends_bp.route('/', methods=['POST'])
@jwt_required()
def predict_trends():
    data = request.get_json()
    industry = data.get('industry', 'Technology')
    try:
        result = gemini_service.predict_trends(industry)
        return jsonify({'trends': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
