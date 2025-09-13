from flask import Blueprint, jsonify
from src.models.product import Avatar, Scene, db

init_bp = Blueprint('init', __name__)

@init_bp.route('/init/database', methods=['POST'])
def initialize_database():
    """Initialize database with preset data"""
    try:
        # Create preset avatars
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
        
        # Create preset scenes
        preset_scenes = [
            {
                'name': 'Urban Street',
                'description': 'Modern city street with urban architecture',
                'category': 'Urban',
                'image_url': '/scenes/urban_street.jpg',
                'environment_url': '/environments/urban_street.hdr',
                'lighting_preset': 'Natural'
            },
            {
                'name': 'Minimalist Studio',
                'description': 'Clean white studio with professional lighting',
                'category': 'Studio',
                'image_url': '/scenes/minimalist_studio.jpg',
                'environment_url': '/environments/studio.hdr',
                'lighting_preset': 'Studio'
            },
            {
                'name': 'Golden Hour Park',
                'description': 'Beautiful park setting during golden hour',
                'category': 'Nature',
                'image_url': '/scenes/golden_hour_park.jpg',
                'environment_url': '/environments/park.hdr',
                'lighting_preset': 'Golden Hour'
            },
            {
                'name': 'Industrial Loft',
                'description': 'Modern industrial loft with exposed brick',
                'category': 'Indoor',
                'image_url': '/scenes/industrial_loft.jpg',
                'environment_url': '/environments/loft.hdr',
                'lighting_preset': 'Moody'
            },
            {
                'name': 'Beach Sunset',
                'description': 'Tropical beach with stunning sunset backdrop',
                'category': 'Nature',
                'image_url': '/scenes/beach_sunset.jpg',
                'environment_url': '/environments/beach.hdr',
                'lighting_preset': 'Golden Hour'
            },
            {
                'name': 'Rooftop City View',
                'description': 'Modern rooftop with city skyline view',
                'category': 'Urban',
                'image_url': '/scenes/rooftop_city.jpg',
                'environment_url': '/environments/rooftop.hdr',
                'lighting_preset': 'Natural'
            }
        ]
        
        created_avatars = []
        created_scenes = []
        
        # Add avatars
        for avatar_data in preset_avatars:
            existing = Avatar.query.filter_by(name=avatar_data['name']).first()
            if not existing:
                avatar = Avatar(**avatar_data)
                db.session.add(avatar)
                created_avatars.append(avatar_data['name'])
        
        # Add scenes
        for scene_data in preset_scenes:
            existing = Scene.query.filter_by(name=scene_data['name']).first()
            if not existing:
                scene = Scene(**scene_data)
                db.session.add(scene)
                created_scenes.append(scene_data['name'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Database initialized successfully',
            'created_avatars': len(created_avatars),
            'created_scenes': len(created_scenes),
            'avatars': created_avatars,
            'scenes': created_scenes
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@init_bp.route('/init/status', methods=['GET'])
def get_init_status():
    """Check initialization status"""
    try:
        avatar_count = Avatar.query.count()
        scene_count = Scene.query.count()
        
        return jsonify({
            'avatars': avatar_count,
            'scenes': scene_count,
            'initialized': avatar_count > 0 and scene_count > 0
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

