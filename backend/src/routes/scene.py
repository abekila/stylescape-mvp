from flask import Blueprint, jsonify, request
from src.models.product import Scene, db

scene_bp = Blueprint('scene', __name__)

@scene_bp.route('/scenes', methods=['GET'])
def get_scenes():
    """Get all available scenes"""
    scenes = Scene.query.all()
    return jsonify([scene.to_dict() for scene in scenes])

@scene_bp.route('/scenes', methods=['POST'])
def create_scene():
    """Create a new scene"""
    try:
        data = request.get_json()
        
        scene = Scene(
            name=data['name'],
            description=data.get('description', ''),
            category=data.get('category', ''),
            image_url=data.get('image_url', ''),
            environment_url=data.get('environment_url', ''),
            lighting_preset=data.get('lighting_preset', 'Natural')
        )
        
        db.session.add(scene)
        db.session.commit()
        
        return jsonify(scene.to_dict()), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@scene_bp.route('/scenes/<int:scene_id>', methods=['GET'])
def get_scene(scene_id):
    """Get a specific scene"""
    scene = Scene.query.get_or_404(scene_id)
    return jsonify(scene.to_dict())

@scene_bp.route('/scenes/preset', methods=['POST'])
def create_preset_scenes():
    """Create preset scenes for the MVP"""
    try:
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
        
        created_scenes = []
        for scene_data in preset_scenes:
            # Check if scene already exists
            existing = Scene.query.filter_by(name=scene_data['name']).first()
            if not existing:
                scene = Scene(**scene_data)
                db.session.add(scene)
                created_scenes.append(scene_data['name'])
        
        db.session.commit()
        
        return jsonify({
            'message': f'Created {len(created_scenes)} preset scenes',
            'scenes': created_scenes
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

