cd
source venvs/piskvorky_env/bin/activate
cd code/piskvorky-flask
export FLASK_APP=hra.py
export FLASK_ENV=development

pip freeze > requirements.txt
pip install -r requirements.txt