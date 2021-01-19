cd
source venvs/piskvorky_env/bin/activate
cd code/piskvorky-flask
export FLASK_APP=hra.py
export FLASK_ENV=development
flask db upgrade
flask run --host=0.0.0.0
