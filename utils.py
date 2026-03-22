from datetime import date

def calcular_prioridade(tarefa):
    hoje = date.today()

    if tarefa.concluida:
        return "concluida"

    if tarefa.data_limite:
        dias = (tarefa.data_limite - hoje).days

        if dias < 0:
            return "atrasada"
        elif dias == 0:
            return "urgente"
        elif dias <= 2:
            return "alta"

    return tarefa.prioridade