from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.marketing_plan import ChatHistory
from app.services.gemini_service import gemini_service
import uuid
from datetime import datetime

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/sessions', methods=['GET'])
@jwt_required()
def get_sessions():
    user_id = get_jwt_identity()
    sessions = ChatHistory.query.filter_by(user_id=user_id)\
        .order_by(ChatHistory.updated_at.desc()).limit(20).all()
    return jsonify({'sessions': [s.to_dict() for s in sessions]})

@chat_bp.route('/sessions', methods=['POST'])
@jwt_required()
def create_session():
    user_id = get_jwt_identity()
    session = ChatHistory(
        user_id=user_id,
        session_id=str(uuid.uuid4()),
        messages=[],
        title='New Chat'
    )
    db.session.add(session)
    db.session.commit()
    return jsonify({'session': session.to_dict()}), 201

@chat_bp.route('/sessions/<session_id>', methods=['GET'])
@jwt_required()
def get_session(session_id):
    user_id = get_jwt_identity()
    session = ChatHistory.query.filter_by(session_id=session_id, user_id=user_id).first_or_404()
    return jsonify({'session': session.to_dict()})

@chat_bp.route('/sessions/<session_id>/message', methods=['POST'])
@jwt_required()
def send_message(session_id):
    user_id = get_jwt_identity()
    session = ChatHistory.query.filter_by(session_id=session_id, user_id=user_id).first_or_404()
    data = request.get_json()
    user_message = data.get('message', '').strip()
    if not user_message:
        return jsonify({'error': 'Message is required'}), 400
    try:
        messages = session.messages or []
        ai_response = gemini_service.chat(messages, user_message)
        messages.append({'role': 'user', 'content': user_message, 'timestamp': datetime.utcnow().isoformat()})
        messages.append({'role': 'assistant', 'content': ai_response, 'timestamp': datetime.utcnow().isoformat()})
        session.messages = messages
        # Auto-title from first message
        if len(messages) == 2:
            session.title = user_message[:60] + ('...' if len(user_message) > 60 else '')
        db.session.commit()
        return jsonify({'response': ai_response, 'session': session.to_dict()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/sessions/<session_id>', methods=['DELETE'])
@jwt_required()
def delete_session(session_id):
    user_id = get_jwt_identity()
    session = ChatHistory.query.filter_by(session_id=session_id, user_id=user_id).first_or_404()
    db.session.delete(session)
    db.session.commit()
    return jsonify({'message': 'Chat session deleted'})
