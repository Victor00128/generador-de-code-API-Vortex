from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import secrets
import string

db = SQLAlchemy()

class ApiKey(db.Model):
    __tablename__ = 'api_keys'
    
    id = db.Column(db.String(36), primary_key=True)
    key = db.Column(db.String(64), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expiration_date = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    def __init__(self, id, name, expiration_days=15):
        self.id = id
        self.name = name
        self.key = self._generate_secure_key()
        self.expiration_date = datetime.utcnow() + timedelta(days=expiration_days)
    
    def _generate_secure_key(self):
        """Genera una clave API criptográficamente segura"""
        # Genera una clave de 32 caracteres con letras, números y algunos símbolos seguros
        alphabet = string.ascii_letters + string.digits + '-_'
        return 'ak_' + ''.join(secrets.choice(alphabet) for _ in range(32))
    
    def is_expired(self):
        """Verifica si la clave ha expirado"""
        return datetime.utcnow() > self.expiration_date
    
    def to_dict(self):
        """Convierte el objeto a diccionario para JSON"""
        return {
            'id': self.id,
            'key': self.key,
            'name': self.name,
            'expirationDate': int(self.expiration_date.timestamp() * 1000),  # Timestamp en milisegundos
            'createdAt': int(self.created_at.timestamp() * 1000),
            'isActive': self.is_active and not self.is_expired()
        }

