from app import db
from datetime import datetime

class MarketingPlan(db.Model):
    __tablename__ = 'marketing_plans'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    seo_plan = db.Column(db.JSON, nullable=True)
    content_plan = db.Column(db.JSON, nullable=True)
    social_media_strategy = db.Column(db.JSON, nullable=True)
    growth_hacks = db.Column(db.JSON, nullable=True)
    customer_acquisition_strategy = db.Column(db.JSON, nullable=True)
    weekly_calendar = db.Column(db.JSON, nullable=True)
    campaign_suggestions = db.Column(db.JSON, nullable=True)
    email_marketing = db.Column(db.JSON, nullable=True)
    budget_breakdown = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'seo_plan': self.seo_plan,
            'content_plan': self.content_plan,
            'social_media_strategy': self.social_media_strategy,
            'growth_hacks': self.growth_hacks,
            'customer_acquisition_strategy': self.customer_acquisition_strategy,
            'weekly_calendar': self.weekly_calendar,
            'campaign_suggestions': self.campaign_suggestions,
            'email_marketing': self.email_marketing,
            'budget_breakdown': self.budget_breakdown,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class ChatHistory(db.Model):
    __tablename__ = 'chat_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    session_id = db.Column(db.String(100), nullable=False)
    messages = db.Column(db.JSON, default=list)  # [{role, content, timestamp}]
    title = db.Column(db.String(300), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'session_id': self.session_id,
            'messages': self.messages,
            'title': self.title,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class Report(db.Model):
    __tablename__ = 'reports'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=True)
    report_type = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(300), nullable=False)
    content = db.Column(db.JSON, nullable=True)
    is_bookmarked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'startup_id': self.startup_id,
            'report_type': self.report_type,
            'title': self.title,
            'content': self.content,
            'is_bookmarked': self.is_bookmarked,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
