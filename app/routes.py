from flask import render_template, flash, redirect, url_for
from app import app, db
from flask import Flask, jsonify, request

import json
from app.models import Game
from app.multiplayer import Game_Id
from app.save_to_db import *





@app.route('/')
@app.route('/index')
def index():    
    return render_template('index.html')



@app.route('/pravidla')
def pravidla():
    
    return render_template('pravidla.html')


'''
@app.route('/hra',methods=['GET', 'POST'])
def hra():
    data = (request.data.decode('UTF-8'))
    
    if(data==''):
        newGame = Game_Id.get_game_id()
        player1_id=Game_Id.get_player1_id()
        player2_id=Game_Id.get_player2_id()
        save_to_db(newGame,player1_id,player2_id)
        return render_template('hra-p1.html',gameID=newGame,player1ID=player1_id,player2ID=player2_id)
    else:
        print("false")
        print(data)
        v1 = json.loads(data)['game_id']
        v2 = json.loads(data)['player']
        v3 = json.loads(data)['state_of_game']
        v4 = json.loads(data)['last_push']
        game_edit(v1,v2,v3,v4)
        return render_template('hra-p1.html')
'''
@app.route('/hra')
def hra():
    return render_template('hra.html')

@app.route('/hra-p1')
def hra_p1():
    return render_template('hra-p1.html')




@app.route('/hra-p2')
def hra_2():
    return render_template('hra-p2.html')

@app.route('/newGame')
def newGame():
    print("setting up new game")
    newGame = Game_Id.get_game_id()
    save_to_db(newGame)
    return {"id":str(newGame)}



@app.route('/gameState',methods=['POST'])
def getState():
        data = (request.data.decode('UTF-8'))
        print(data)
        state = json.loads(data)['state']
        player = json.loads(data)['player']
        

        return "Succes"





