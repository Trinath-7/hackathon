from app import db
from datetime import datetime

class MarketResearch(db.Model):
    __tablename__ = 'market_research'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    industry_analysis = db.Column(db.Text, nullable=True)
    market_size = db.Column(db.String(200), nullable=True)
    tam = db.Column(db.String(200), nullable=True)  # Total Addressable Market
    sam = db.Column(db.String(200), nullable=True)  # Serviceable Addressable Market
    som = db.Column(db.String(200), nullable=True)  # Serviceable Obtainable Market
    market_trends = db.Column(db.JSON, nullable=True)
    swot_analysis = db.Column(db.JSON, nullable=True)
    customer_personas = db.Column(db.JSON, nullable=True)
    growth_opportunities = db.Column(db.JSON, nullable=True)
    market_growth_rate = db.Column(db.Float, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'industry_analysis': self.industry_analysis,
            'market_size': self.market_size,
            'tam': self.tam,
            'sam': self.sam,
            'som': self.som,
            'market_trends': self.market_trends,
            'swot_analysis': self.swot_analysis,
            'customer_personas': self.customer_personas,
            'growth_opportunities': self.growth_opportunities,
            'market_growth_rate': self.market_growth_rate,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

