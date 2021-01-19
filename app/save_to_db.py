from app import app, db
from app.models import Game


def save_to_db(id):
    g = Game(game_id=str(id),fields='',player1=True,player2=False)
    db.session.add(g)
    db.session.commit()
    
def game_edit(id,state,player):
    game = Game.query.filter_by(game_id=id).first()
    game.fields=state
    if(player=="circle"):
        game.player1=False
        game.player2=True
    else:
        if(player=="cross"):
            game.player1=True
            game.player2=False
    
    db.session.commit()
    print(game.game_id,game.fields,game.player1,game.player2)

def game_state(id):
    game = Game.query.filter_by(game_id=id).first()
    return game.fields
    