from flask_sqlalchemy import SQLAlchemy
from utils import calcular_prioridade
db = SQLAlchemy()

class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    titulo = db.Column(db.String(100), nullable=False)
    descricao = db.Column(db.String(200))
    prioridade = db.Column(db.String(10))  # baixa, media, alta
    concluida = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
        "id": self.id,
        "titulo": self.titulo,
        "descricao": self.descricao,
        "prioridade": self.prioridade,
        "prioridade_calculada": calcular_prioridade(self),
        "data_limite": str(self.data_limite),
        "concluida": self.concluida
    }