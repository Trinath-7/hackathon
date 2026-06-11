from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.investor import Investor
from app.models.startup import StartupIdea
from app.services.gemini_service import gemini_service

investors_bp = Blueprint('investors', __name__)

@investors_bp.route('/match/<int:idea_id>', methods=['POST'])
@jwt_required()
def match_investors(idea_id):
    user_id = get_jwt_identity()
    idea = StartupIdea.query.filter_by(id=idea_id, user_id=user_id).first_or_404()
    data = request.get_json()
    stage = data.get('stage', 'seed')
    geography = data.get('geography', 'Global')
    amount = data.get('amount', '$500K - $2M')
    try:
        result = gemini_service.match_investors(idea.industry, stage, geography, amount)
        return jsonify({'investors': result.get('investors', [])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@investors_bp.route('/', methods=['GET'])
@jwt_required()
def list_investors():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    industry = request.args.get('industry', '')
    investors = Investor.query
    if industry:
        investors = investors.filter(Investor.industries.contains([industry]))
    paginated = investors.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'investors': [i.to_dict() for i in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page
    })
