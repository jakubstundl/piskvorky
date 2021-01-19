from datetime import datetime
from app import db


class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.String(64), index=True, unique=False)    
    fields = db.Column(db.String(64), index=True, unique=False)
    player1=db.Column(db.Boolean, index=True, unique=False)
    player2=db.Column(db.Boolean, index=True, unique=False)

    
    
    

    

