from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    fabric_type = db.Column(db.String(50), nullable=False)  # Cotton, Denim, Silk, etc.
    fit = db.Column(db.String(20), nullable=False)  # Slim, Regular, Oversized
    size = db.Column(db.String(10), nullable=False)  # S, M, L, XL
    image_url = db.Column(db.String(255))  # URL to uploaded product image
    digital_twin_url = db.Column(db.String(255))  # URL to processed 3D model
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Product {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'fabric_type': self.fabric_type,
            'fit': self.fit,
            'size': self.size,
            'image_url': self.image_url,
            'digital_twin_url': self.digital_twin_url,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id
        }

class Avatar(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    ethnicity = db.Column(db.String(50))
    body_type = db.Column(db.String(20))  # ectomorph, mesomorph, endomorph
    age_range = db.Column(db.String(10))  # 18-25, 26-35, etc.
    gender = db.Column(db.String(10))
    image_url = db.Column(db.String(255))  # Preview image
    model_url = db.Column(db.String(255))  # 3D model URL
    is_custom = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # null for preset avatars

    def __repr__(self):
        return f'<Avatar {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'ethnicity': self.ethnicity,
            'body_type': self.body_type,
            'age_range': self.age_range,
            'gender': self.gender,
            'image_url': self.image_url,
            'model_url': self.model_url,
            'is_custom': self.is_custom,
            'user_id': self.user_id
        }

class Scene(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50))  # Urban, Studio, Nature, etc.
    image_url = db.Column(db.String(255))  # Preview image
    environment_url = db.Column(db.String(255))  # 3D environment URL
    lighting_preset = db.Column(db.String(50))  # Golden Hour, Studio, Natural, etc.

    def __repr__(self):
        return f'<Scene {self.name}>'

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'image_url': self.image_url,
            'environment_url': self.environment_url,
            'lighting_preset': self.lighting_preset
        }

class GeneratedContent(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    avatar_id = db.Column(db.Integer, db.ForeignKey('avatar.id'), nullable=False)
    scene_id = db.Column(db.Integer, db.ForeignKey('scene.id'), nullable=False)
    content_type = db.Column(db.String(20), nullable=False)  # image, video
    content_url = db.Column(db.String(255), nullable=False)
    pose = db.Column(db.String(50))  # pose name or description
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    # Relationships
    product = db.relationship('Product', backref='generated_content')
    avatar = db.relationship('Avatar', backref='generated_content')
    scene = db.relationship('Scene', backref='generated_content')

    def __repr__(self):
        return f'<GeneratedContent {self.id}>'

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'avatar_id': self.avatar_id,
            'scene_id': self.scene_id,
            'content_type': self.content_type,
            'content_url': self.content_url,
            'pose': self.pose,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'user_id': self.user_id,
            'product': self.product.to_dict() if self.product else None,
            'avatar': self.avatar.to_dict() if self.avatar else None,
            'scene': self.scene.to_dict() if self.scene else None
        }

