from flask import render_template, flash, redirect, url_for
from app import app, db
from flask import Flask, jsonify, request

import json
from app.models import Game
from app.multiplayer import Game_Id
from app.save_to_db import *
from app.qr import *
import qrcode
from PIL import Image
import base64
import io




@app.route('/')
@app.route('/index')
def index():    
    return render_template('index.html')



@app.route('/pravidla')
def pravidla():
    
    return render_template('pravidla.html')

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



@app.route('/setState',methods=['POST'])
def setState():
        data = (request.data.decode('UTF-8'))
        print(data)
        id=json.loads(data)['id']
        state = json.loads(data)['state']
        player = json.loads(data)['player']
        game_edit(id,state,player)
        print(id,state,player)
        return {"Succes":"Succes"}

@app.route('/getState',methods=['GET'])

def getState():
        id = request.args.get('id')  
        

        return game_state(id)

@app.route('/getQR')
def getQr():
    id = request.args.get('id')
    print("qr"+str(id))
    im = qr("https://piskvorky-app.herokuapp.com/hra-p2?id="+id)
    data = io.BytesIO()
    im.save(data, "PNG")
    encoded_img_data = base64.b64encode(data.getvalue())

    return {"img_data":encoded_img_data.decode('utf-8')}


