from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User
from app.models.startup import StartupIdea
from app.models.marketing_plan import Report
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        return fn(*args, **kwargs)
    return wrapper

@admin_bp.route('/stats', methods=['GET'])
@admin_required
def get_stats():
    total_users = User.query.count()
    total_startups = StartupIdea.query.count()
    total_reports = Report.query.count()
    recent_users = User.query.order_by(User.created_at.desc()).limit(5).all()
    return jsonify({
        'stats': {
            'total_users': total_users,
            'total_startups': total_startups,
            'total_reports': total_reports,
            'active_users': total_users,
        },
        'recent_users': [u.to_dict() for u in recent_users]
    })

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    users = User.query.order_by(User.created_at.desc()).paginate(page=page, per_page=per_page)
    return jsonify({
        'users': [u.to_dict() for u in users.items],
        'total': users.total,
        'pages': users.pages
    })

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def update_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.role = data.get('role', 'user')
    db.session.commit()
    return jsonify({'user': user.to_dict()})
