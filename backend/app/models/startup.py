from app import db
from datetime import datetime

class StartupIdea(db.Model):
    __tablename__ = 'startup_ideas'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    industry = db.Column(db.String(100), nullable=False)
    target_audience = db.Column(db.String(300), nullable=False)
    
    # AI Generated Scores
    validation_score = db.Column(db.Float, default=0)
    success_probability = db.Column(db.Float, default=0)
    market_potential_score = db.Column(db.Float, default=0)
    funding_readiness_score = db.Column(db.Float, default=0)
    overall_health_score = db.Column(db.Float, default=0)
    
    # AI Generated Content
    feasibility_report = db.Column(db.Text, nullable=True)
    risk_analysis = db.Column(db.JSON, nullable=True)
    improvement_suggestions = db.Column(db.JSON, nullable=True)
    
    # Status
    status = db.Column(db.String(50), default='draft')  # draft | validated | funded
    is_bookmarked = db.Column(db.Boolean, default=False)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    market_research = db.relationship('MarketResearch', backref='startup', uselist=False, cascade='all, delete-orphan')
    competitors = db.relationship('Competitor', backref='startup', lazy='dynamic', cascade='all, delete-orphan')
    lean_canvas = db.relationship('LeanCanvas', backref='startup', uselist=False, cascade='all, delete-orphan')
    roadmaps = db.relationship('Roadmap', backref='startup', lazy='dynamic', cascade='all, delete-orphan')
    pitch_decks = db.relationship('PitchDeck', backref='startup', lazy='dynamic', cascade='all, delete-orphan')
    marketing_plans = db.relationship('MarketingPlan', backref='startup', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'description': self.description,
            'industry': self.industry,
            'target_audience': self.target_audience,
            'validation_score': self.validation_score,
            'success_probability': self.success_probability,
            'market_potential_score': self.market_potential_score,
            'funding_readiness_score': self.funding_readiness_score,
            'overall_health_score': self.overall_health_score,
            'feasibility_report': self.feasibility_report,
            'risk_analysis': self.risk_analysis,
            'improvement_suggestions': self.improvement_suggestions,
            'status': self.status,
            'is_bookmarked': self.is_bookmarked,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
