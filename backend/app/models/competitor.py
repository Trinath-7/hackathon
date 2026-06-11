from app import db
from datetime import datetime

class Competitor(db.Model):
    __tablename__ = 'competitors'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    website = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text, nullable=True)
    features = db.Column(db.JSON, nullable=True)
    pricing = db.Column(db.JSON, nullable=True)
    strengths = db.Column(db.JSON, nullable=True)
    weaknesses = db.Column(db.JSON, nullable=True)
    market_share = db.Column(db.Float, nullable=True)
    funding_raised = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'name': self.name,
            'website': self.website,
            'description': self.description,
            'features': self.features,
            'pricing': self.pricing,
            'strengths': self.strengths,
            'weaknesses': self.weaknesses,
            'market_share': self.market_share,
            'funding_raised': self.funding_raised,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

