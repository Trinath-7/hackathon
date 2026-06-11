from app import db
from datetime import datetime

class LeanCanvas(db.Model):
    __tablename__ = 'lean_canvas'

    id = db.Column(db.Integer, primary_key=True)
    startup_id = db.Column(db.Integer, db.ForeignKey('startup_ideas.id'), nullable=False)
    problem = db.Column(db.JSON, nullable=True)
    solution = db.Column(db.JSON, nullable=True)
    unique_value_proposition = db.Column(db.Text, nullable=True)
    unfair_advantage = db.Column(db.Text, nullable=True)
    customer_segments = db.Column(db.JSON, nullable=True)
    key_metrics = db.Column(db.JSON, nullable=True)
    channels = db.Column(db.JSON, nullable=True)
    revenue_streams = db.Column(db.JSON, nullable=True)
    cost_structure = db.Column(db.JSON, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'startup_id': self.startup_id,
            'problem': self.problem,
            'solution': self.solution,
            'unique_value_proposition': self.unique_value_proposition,
            'unfair_advantage': self.unfair_advantage,
            'customer_segments': self.customer_segments,
            'key_metrics': self.key_metrics,
            'channels': self.channels,
            'revenue_streams': self.revenue_streams,
            'cost_structure': self.cost_structure,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
