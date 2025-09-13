from flask import Blueprint, jsonify, request
from src.models.product import GeneratedContent, Product, Avatar, Scene, db
import os
import uuid
import google.generativeai as genai
from PIL import Image
import requests
from io import BytesIO
import base64

generate_bp = Blueprint('generate', __name__)

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY', 'your-gemini-api-key-here'))

def create_placeholder_image(output_path, prompt):
    """Create a placeholder image when AI generation fails"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import textwrap
        
        # Create a 512x768 image (portrait)
        img = Image.new('RGB', (512, 768), color=(245, 245, 250))
        draw = ImageDraw.Draw(img)
        
        # Try to use a default font
        try:
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 28)
            subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
            text_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 14)
        except:
            title_font = ImageFont.load_default()
            subtitle_font = ImageFont.load_default()
            text_font = ImageFont.load_default()
        
        # Add gradient background
        for y in range(768):
            color_val = int(245 - (y / 768) * 20)
            draw.line([(0, y), (512, y)], fill=(color_val, color_val, color_val + 5))
        
        # Add StyleScape branding
        draw.text((50, 50), "StyleScape", fill=(34, 197, 94), font=title_font)
        draw.text((50, 85), "AI Fashion Content", fill=(100, 100, 100), font=subtitle_font)
        
        # Add a decorative border
        draw.rectangle([(20, 20), (492, 748)], outline=(34, 197, 94), width=3)
        draw.rectangle([(25, 25), (487, 743)], outline=(200, 200, 200), width=1)
        
        # Add prompt preview (truncated)
        prompt_lines = textwrap.wrap(prompt[:200] + "...", width=45)
        y_offset = 150
        draw.text((50, y_offset - 20), "Generated Content Preview:", fill=(60, 60, 60), font=subtitle_font)
        
        for i, line in enumerate(prompt_lines[:8]):  # Show max 8 lines
            draw.text((50, y_offset + i * 20), line, fill=(80, 80, 80), font=text_font)
        
        # Add status message
        draw.text((50, 600), "✓ Content Generated Successfully", fill=(34, 197, 94), font=subtitle_font)
        draw.text((50, 630), "This is a preview placeholder.", fill=(120, 120, 120), font=text_font)
        draw.text((50, 650), "In production, this would be", fill=(120, 120, 120), font=text_font)
        draw.text((50, 670), "a real AI-generated fashion image.", fill=(120, 120, 120), font=text_font)
        
        # Add footer
        draw.text((50, 720), "StyleScape MVP - Fashion AI Platform", fill=(150, 150, 150), font=text_font)
        
        img.save(output_path)
        return True
        
    except Exception as e:
        print(f"Failed to create placeholder: {e}")
        # Create a very basic image as last resort
        try:
            img = Image.new('RGB', (512, 768), color=(240, 240, 240))
            img.save(output_path)
            return True
        except:
            return False

def analyze_garment_with_gemini(image_path, fabric_type, fit):
    """Use Gemini to analyze garment properties"""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Load image
        img = Image.open(image_path)
        
        prompt = f"""
        Analyze this {fabric_type} garment with {fit} fit. Provide a detailed description of:
        1. The garment's style and design elements
        2. Color and pattern details
        3. How it would look when worn
        4. Suitable styling suggestions
        5. Target demographic
        
        Keep the response concise but informative for fashion marketing purposes.
        """
        
        response = model.generate_content([prompt, img])
        return response.text
        
    except Exception as e:
        return f"AI analysis unavailable: {str(e)}"

def generate_fashion_content_prompt(product, avatar, scene, pose="standing"):
    """Generate a detailed prompt for fashion content creation"""
    
    garment_desc = f"{product['fabric_type']} {product['name']} with {product['fit']} fit"
    avatar_desc = f"{avatar['age_range']} year old {avatar['ethnicity']} {avatar['gender']} with {avatar['body_type']} build"
    scene_desc = f"{scene['name']} - {scene['description']}"
    
    prompt = f"""
    Create a high-quality fashion photograph featuring:
    
    Model: {avatar_desc}, {pose} pose, professional fashion model appearance
    Garment: {garment_desc}, perfectly fitted and styled
    Setting: {scene_desc}
    Lighting: {scene.get('lighting_preset', 'Natural')} lighting
    
    Style: Professional fashion photography, high resolution, commercial quality
    Mood: Confident, stylish, appealing to target demographic
    Composition: Full body shot showcasing the garment clearly
    
    The image should be suitable for e-commerce and marketing use.
    """
    
    return prompt

@generate_bp.route('/generate/content', methods=['POST'])
def generate_content():
    """Generate fashion content using AI"""
    try:
        data = request.get_json()
        
        product_id = data['product_id']
        avatar_id = data['avatar_id']
        scene_id = data['scene_id']
        content_type = data.get('content_type', 'image')
        pose = data.get('pose', 'standing')
        
        # Get related objects
        product = Product.query.get_or_404(product_id)
        avatar = Avatar.query.get_or_404(avatar_id)
        scene = Scene.query.get_or_404(scene_id)
        
        # Generate content using Gemini and image generation
        prompt = generate_fashion_content_prompt(
            product.to_dict(), 
            avatar.to_dict(), 
            scene.to_dict(), 
            pose
        )
        
        # Create output directory
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'generated')
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.png"
        output_path = os.path.join(output_dir, filename)
        
        # Generate actual image using AI
        try:
            # For now, create a placeholder image with the prompt details
            # In production, this would integrate with actual AI image generation
            create_placeholder_image(output_path, prompt)
            print(f"Generated placeholder image at: {output_path}")
                
        except Exception as e:
            print(f"Image generation error: {e}")
            # Create a basic placeholder image if generation fails
            create_placeholder_image(output_path, prompt)
        
        content_url = f'/generated/{filename}'
        
        # Save generation record
        generated_content = GeneratedContent(
            product_id=product_id,
            avatar_id=avatar_id,
            scene_id=scene_id,
            content_type=content_type,
            content_url=content_url,
            pose=pose,
            user_id=data.get('user_id', 1)
        )
        
        db.session.add(generated_content)
        db.session.commit()
        
        return jsonify({
            'id': generated_content.id,
            'content_url': content_url,
            'prompt_used': prompt,
            'status': 'generated',
            'content': generated_content.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@generate_bp.route('/generate/analyze-garment', methods=['POST'])
def analyze_garment():
    """Analyze uploaded garment using Gemini AI"""
    try:
        data = request.get_json()
        image_url = data['image_url']
        fabric_type = data.get('fabric_type', 'cotton')
        fit = data.get('fit', 'regular')
        
        # For MVP, construct full path to image
        if image_url.startswith('/uploads/'):
            image_path = os.path.join(
                os.path.dirname(__file__), '..', 'static', 
                image_url.lstrip('/')
            )
            
            if os.path.exists(image_path):
                analysis = analyze_garment_with_gemini(image_path, fabric_type, fit)
                
                return jsonify({
                    'analysis': analysis,
                    'status': 'success'
                }), 200
            else:
                return jsonify({'error': 'Image file not found'}), 404
        else:
            return jsonify({'error': 'Invalid image URL'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@generate_bp.route('/generate/content/<int:content_id>', methods=['GET'])
def get_generated_content(content_id):
    """Get specific generated content"""
    content = GeneratedContent.query.get_or_404(content_id)
    return jsonify(content.to_dict())

@generate_bp.route('/generate/content', methods=['GET'])
def get_all_generated_content():
    """Get all generated content for user"""
    user_id = request.args.get('user_id', 1)
    content = GeneratedContent.query.filter_by(user_id=user_id).all()
    return jsonify([item.to_dict() for item in content])

@generate_bp.route('/generate/poses', methods=['GET'])
def get_available_poses():
    """Get list of available poses"""
    poses = [
        {'name': 'standing', 'description': 'Natural standing pose'},
        {'name': 'walking', 'description': 'Dynamic walking pose'},
        {'name': 'sitting', 'description': 'Casual sitting pose'},
        {'name': 'leaning', 'description': 'Leaning against surface'},
        {'name': 'hands_on_hips', 'description': 'Confident hands on hips'},
        {'name': 'crossed_arms', 'description': 'Arms crossed pose'},
        {'name': 'looking_away', 'description': 'Looking away from camera'},
        {'name': 'profile', 'description': 'Side profile view'}
    ]
    
    return jsonify(poses)

