from flask import Flask
from models import db
from routes.tarefas import tarefas_bp
from routes.estatisticas import estatisticas_bp

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Registrar rotas
app.register_blueprint(tarefas_bp)
app.register_blueprint(estatisticas_bp)

@app.route('/')
def home():
    return {"mensagem": "PlanIt API rodando!"}

if __name__ == '__main__':
    app.run(debug=True)