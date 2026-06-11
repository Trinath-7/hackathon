from app import db
from datetime import datetime

class Investor(db.Model):
    __tablename__ = 'investors'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    firm = db.Column(db.String(200), nullable=True)
    email = db.Column(db.String(200), nullable=True)
    linkedin = db.Column(db.String(500), nullable=True)
    website = db.Column(db.String(500), nullable=True)
    industries = db.Column(db.JSON, nullable=True)
    funding_stages = db.Column(db.JSON, nullable=True)  # seed, series_a, etc.
    geographies = db.Column(db.JSON, nullable=True)
    min_investment = db.Column(db.Float, nullable=True)
    max_investment = db.Column(db.Float, nullable=True)
    portfolio_companies = db.Column(db.JSON, nullable=True)
    bio = db.Column(db.Text, nullable=True)
    avatar = db.Column(db.String(500), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'firm': self.firm,
            'email': self.email,
            'linkedin': self.linkedin,
            'website': self.website,
            'industries': self.industries,
            'funding_stages': self.funding_stages,
            'geographies': self.geographies,
            'min_investment': self.min_investment,
            'max_investment': self.max_investment,
            'portfolio_companies': self.portfolio_companies,
            'bio': self.bio,
            'avatar': self.avatar,
        }
