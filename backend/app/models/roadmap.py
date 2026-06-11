from app import db
from datetime import datetime

class Roadmap(db.Model):
    __tablename__ = 'roadmaps'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    title = db.Column(db.String(200), default='MVP Roadmap')
    phase1 = db.Column(db.JSON, nullable=True)  # Core features
    phase2 = db.Column(db.JSON, nullable=True)  # Growth features
    phase3 = db.Column(db.JSON, nullable=True)  # Scale features
    milestones = db.Column(db.JSON, nullable=True)
    timeline_months = db.Column(db.Integer, default=12)
    tech_stack_suggestions = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'title': self.title,
            'phase1': self.phase1,
            'phase2': self.phase2,
            'phase3': self.phase3,
            'milestones': self.milestones,
            'timeline_months': self.timeline_months,
            'tech_stack_suggestions': self.tech_stack_suggestions,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class PitchDeck(db.Model):
    __tablename__ = 'pitch_decks'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    title_slide = db.Column(db.JSON, nullable=True)
    problem_slide = db.Column(db.JSON, nullable=True)
    solution_slide = db.Column(db.JSON, nullable=True)
    market_slide = db.Column(db.JSON, nullable=True)
    product_slide = db.Column(db.JSON, nullable=True)
    business_model_slide = db.Column(db.JSON, nullable=True)
    gtm_slide = db.Column(db.JSON, nullable=True)
    financials_slide = db.Column(db.JSON, nullable=True)
    funding_ask_slide = db.Column(db.JSON, nullable=True)
    team_slide = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'title_slide': self.title_slide,
            'problem_slide': self.problem_slide,
            'solution_slide': self.solution_slide,
            'market_slide': self.market_slide,
            'product_slide': self.product_slide,
            'business_model_slide': self.business_model_slide,
            'gtm_slide': self.gtm_slide,
            'financials_slide': self.financials_slide,
            'funding_ask_slide': self.funding_ask_slide,
            'team_slide': self.team_slide,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
