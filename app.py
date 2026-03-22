from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
db = SQLAlchemy(app)


class Tarefa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    completed = db.Column(db.Boolean, default=False)
    due_date = db.Column(db.String(20))


@app.route("/")
def home():
    return render_template("index.html")


# ================= API =================

@app.route("/tarefas", methods=["GET"])
def get_tarefas():
    tarefas = Tarefa.query.all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "completed": t.completed,
            "due_date": t.due_date
        } for t in tarefas
    ])


@app.route("/tarefas", methods=["POST"])
def criar_tarefa():
    data = request.json

    nova = Tarefa(
        title=data.get("title"),
        due_date=data.get("due_date"),
        completed=False
    )

    db.session.add(nova)
    db.session.commit()

    return jsonify({"msg": "ok"})


@app.route("/tarefas/<int:id>", methods=["DELETE"])
def deletar(id):
    t = Tarefa.query.get(id)
    db.session.delete(t)
    db.session.commit()
    return jsonify({"msg": "deleted"})


@app.route("/tarefas/<int:id>", methods=["PUT"])
def atualizar(id):
    t = Tarefa.query.get(id)
    data = request.json

    t.title = data.get("title")
    t.completed = data.get("completed")
    t.due_date = data.get("due_date")

    db.session.commit()
    return jsonify({"msg": "updated"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)