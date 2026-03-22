from flask import Blueprint, jsonify
from models import Tarefa

estatisticas_bp = Blueprint('estatisticas', __name__)

@estatisticas_bp.route('/estatisticas', methods=['GET'])
def estatisticas():
    tarefas = Tarefa.query.all()

    total = len(tarefas)
    concluidas = len([t for t in tarefas if t.concluida])

    porcentagem = (concluidas / total * 100) if total > 0 else 0

    return jsonify({
        "total": total,
        "concluidas": concluidas,
        "porcentagem_concluidas": round(porcentagem, 2)
    })