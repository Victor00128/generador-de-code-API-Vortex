from flask import Blueprint, request, jsonify
from src.models.api_key import db, ApiKey
from datetime import datetime
import uuid

api_keys_bp = Blueprint('api_keys', __name__)

# Constantes
MAX_KEYS = 2
EXPIRATION_DAYS = 15

@api_keys_bp.route('/keys', methods=['GET'])
def get_keys():
    """Obtiene todas las claves API activas y no expiradas"""
    try:
        # Obtener todas las claves activas
        keys = ApiKey.query.filter_by(is_active=True).all()
        
        # Filtrar las claves no expiradas
        active_keys = []
        for key in keys:
            if not key.is_expired():
                active_keys.append(key.to_dict())
            else:
                # Marcar como inactiva si ha expirado
                key.is_active = False
                db.session.commit()
        
        return jsonify({
            'success': True,
            'keys': active_keys,
            'count': len(active_keys),
            'maxKeys': MAX_KEYS
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_keys_bp.route('/keys', methods=['POST'])
def create_key():
    """Genera una nueva clave API"""
    try:
        data = request.get_json()
        
        # Verificar el límite de claves activas
        active_keys_count = ApiKey.query.filter_by(is_active=True).count()
        
        # Filtrar claves expiradas y actualizar su estado
        expired_keys = ApiKey.query.filter_by(is_active=True).all()
        for key in expired_keys:
            if key.is_expired():
                key.is_active = False
                active_keys_count -= 1
        
        db.session.commit()
        
        if active_keys_count >= MAX_KEYS:
            return jsonify({
                'success': False,
                'error': f'API limit reached. You can only have {MAX_KEYS} active keys.'
            }), 400
        
        # Crear nueva clave
        key_id = str(uuid.uuid4())
        name = data.get('name', f'API Key {active_keys_count + 1}')
        
        new_key = ApiKey(id=key_id, name=name, expiration_days=EXPIRATION_DAYS)
        
        db.session.add(new_key)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'key': new_key.to_dict(),
            'message': 'New API Key generated successfully!'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_keys_bp.route('/keys/<key_id>', methods=['DELETE'])
def delete_key(key_id):
    """Revoca (elimina) una clave API"""
    try:
        key = ApiKey.query.filter_by(id=key_id, is_active=True).first()
        
        if not key:
            return jsonify({
                'success': False,
                'error': 'API Key not found or already inactive'
            }), 404
        
        # Marcar como inactiva en lugar de eliminar
        key.is_active = False
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'API Key revoked successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_keys_bp.route('/keys/<key_id>', methods=['PUT'])
def update_key(key_id):
    """Actualiza el nombre de una clave API"""
    try:
        data = request.get_json()
        key = ApiKey.query.filter_by(id=key_id, is_active=True).first()
        
        if not key:
            return jsonify({
                'success': False,
                'error': 'API Key not found or already inactive'
            }), 404
        
        if key.is_expired():
            return jsonify({
                'success': False,
                'error': 'Cannot update expired API Key'
            }), 400
        
        # Actualizar nombre si se proporciona
        if 'name' in data:
            key.name = data['name']
            db.session.commit()
        
        return jsonify({
            'success': True,
            'key': key.to_dict(),
            'message': 'API Key updated successfully'
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@api_keys_bp.route('/config', methods=['GET'])
def get_config():
    """Obtiene la configuración del sistema"""
    return jsonify({
        'success': True,
        'config': {
            'maxKeys': MAX_KEYS,
            'expirationDays': EXPIRATION_DAYS
        }
    })

