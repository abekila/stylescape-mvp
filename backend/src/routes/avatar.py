from flask import Blueprint, jsonify, request
from src.models.product import Avatar, db

avatar_bp = Blueprint('avatar', __name__)

@avatar_bp.route('/avatars', methods=['GET'])
def get_avatars():
    """Get all available avatars"""
    avatars = Avatar.query.all()
    return jsonify([avatar.to_dict() for avatar in avatars])

@avatar_bp.route('/avatars', methods=['POST'])
def create_avatar():
    """Create a new custom avatar"""
    try:
        data = request.get_json()
        
        avatar = Avatar(
            name=data['name'],
            description=data.get('description', ''),
            ethnicity=data.get('ethnicity', ''),
            body_type=data.get('body_type', ''),
            age_range=data.get('age_range', ''),
            gender=data.get('gender', ''),
            image_url=data.get('image_url', ''),
            model_url=data.get('model_url', ''),
            is_custom=True,
            user_id=data.get('user_id', 1)
        )
        
        db.session.add(avatar)
        db.session.commit()
        
        return jsonify(avatar.to_dict()), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@avatar_bp.route('/avatars/<int:avatar_id>', methods=['GET'])
def get_avatar(avatar_id):
    """Get a specific avatar"""
    avatar = Avatar.query.get_or_404(avatar_id)
    return jsonify(avatar.to_dict())

@avatar_bp.route('/avatars/preset', methods=['POST'])
def create_preset_avatars():
    """Create preset avatars for the MVP"""
    try:
        preset_avatars = [
            {
                'name': 'Alex - Urban Style',
                'description': 'Young professional, urban aesthetic',
                'ethnicity': 'Mixed',
                'body_type': 'mesomorph',
                'age_range': '25-30',
                'gender': 'male',
                'image_url': '/avatars/alex.jpg',
                'model_url': '/models/alex.obj',
                'is_custom': False
            },
            {
                'name': 'Maya - Fashion Forward',
                'description': 'Fashion-forward model with elegant style',
                'ethnicity': 'Asian',
                'body_type': 'ectomorph',
                'age_range': '22-28',
                'gender': 'female',
                'image_url': '/avatars/maya.jpg',
                'model_url': '/models/maya.obj',
                'is_custom': False
            },
            {
                'name': 'Jordan - Athletic',
                'description': 'Athletic build, sporty aesthetic',
                'ethnicity': 'African American',
                'body_type': 'mesomorph',
                'age_range': '20-25',
                'gender': 'male',
                'image_url': '/avatars/jordan.jpg',
                'model_url': '/models/jordan.obj',
                'is_custom': False
            },
            {
                'name': 'Sofia - Classic',
                'description': 'Classic beauty with timeless appeal',
                'ethnicity': 'Latina',
                'body_type': 'mesomorph',
                'age_range': '26-32',
                'gender': 'female',
                'image_url': '/avatars/sofia.jpg',
                'model_url': '/models/sofia.obj',
                'is_custom': False
            }
        ]
        
        created_avatars = []
        for avatar_data in preset_avatars:
            # Check if avatar already exists
            existing = Avatar.query.filter_by(name=avatar_data['name']).first()
            if not existing:
                avatar = Avatar(**avatar_data)
                db.session.add(avatar)
                created_avatars.append(avatar_data['name'])
        
        db.session.commit()
        
        return jsonify({
            'message': f'Created {len(created_avatars)} preset avatars',
            'avatars': created_avatars
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

