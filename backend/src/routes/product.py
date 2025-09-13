from flask import Blueprint, jsonify, request
from src.models.product import Product, db
import os
import uuid
from werkzeug.utils import secure_filename

product_bp = Blueprint('product', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@product_bp.route('/products', methods=['GET'])
def get_products():
    """Get all products for the current user"""
    products = Product.query.all()
    return jsonify([product.to_dict() for product in products])

@product_bp.route('/products', methods=['POST'])
def create_product():
    """Create a new product with garment upload"""
    try:
        data = request.get_json()
        
        # Create new product
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            fabric_type=data['fabric_type'],
            fit=data['fit'],
            size=data['size'],
            image_url=data.get('image_url', ''),
            user_id=data.get('user_id', 1)  # Default user for MVP
        )
        
        db.session.add(product)
        db.session.commit()
        
        # Mock AI processing - simulate digital twin creation
        # In a real implementation, this would trigger AI processing
        product.digital_twin_url = f"/api/digital-twins/{product.id}.obj"
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product"""
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Update a product"""
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.fabric_type = data.get('fabric_type', product.fabric_type)
    product.fit = data.get('fit', product.fit)
    product.size = data.get('size', product.size)
    
    db.session.commit()
    return jsonify(product.to_dict())

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Delete a product"""
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return '', 204

@product_bp.route('/products/upload', methods=['POST'])
def upload_product_image():
    """Upload product image for processing"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        # Create uploads directory if it doesn't exist
        upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Generate unique filename
        filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        
        # Return the URL path
        file_url = f'/uploads/{filename}'
        return jsonify({'image_url': file_url}), 200
    
    return jsonify({'error': 'Invalid file type'}), 400

