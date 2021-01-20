from app import app, db
from app.models import Game


def save_to_db(id):
    g = Game(game_id=str(id),fields='',player='circle')
    
    db.session.add(g)
    db.session.commit()
    
    
def game_edit(id,state,player):
    game = Game.query.filter_by(game_id=id).first()
    game.fields=state
    print("gameedit:"+id+state+player)
    if(player=="circle"):
        print("first if proc")
        game.player="cross"
        
    else:
        if(player=="cross"):
            print("second if proc")
            game.player="circle"
            
    
    db.session.commit()
    print(game.game_id,game.fields,game.player)

def game_state(id):
    game = Game.query.filter_by(game_id=id).first()
    #print('state'+game.fields+"player1"+str(game.player1)+"player2"+str(game.player2))
    return {'state':game.fields,"player":game.player}
    