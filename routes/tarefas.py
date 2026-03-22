from flask import Blueprint, request, jsonify
from models import db, Tarefa
from datetime import datetime

tarefas_bp = Blueprint('tarefas', __name__)

@tarefas_bp.route('/tarefas', methods=['GET'])
def listar_tarefas():
    tarefas = Tarefa.query.all()
    return jsonify([t.to_dict() for t in tarefas])

@tarefas_bp.route('/tarefas', methods=['POST'])
def criar_tarefa():
    data = request.get_json()

    data_limite = None
    if data.get("data_limite"):
        data_limite = datetime.strptime(data.get("data_limite"), "%Y-%m-%d").date()

    nova = Tarefa(
        titulo=data.get('titulo'),
        descricao=data.get('descricao'),
        prioridade=data.get('prioridade'),
        data_limite=data_limite
    )

    db.session.add(nova)
    db.session.commit()

    return jsonify(nova.to_dict()), 201