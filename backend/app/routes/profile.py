from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.user import User

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify({'user': user.to_dict()})

@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    for field in ['name', 'company', 'bio', 'linkedin', 'twitter', 'avatar']:
        if field in data:
            setattr(user, field, data[field])
    db.session.commit()
    return jsonify({'user': user.to_dict()})

@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    current = data.get('current_password', '')
    new_pass = data.get('new_password', '')
    if not user.check_password(current):
        return jsonify({'error': 'Current password is incorrect'}), 400
    if len(new_pass) < 8:
        return jsonify({'error': 'New password must be at least 8 characters'}), 400
    user.set_password(new_pass)
    db.session.commit()
    return jsonify({'message': 'Password changed successfully'})
