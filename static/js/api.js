const API_URL = "/tarefas"

// ================= GET =================
export async function getTarefas() {
    const res = await fetch(API_URL)

    if (!res.ok) {
        throw new Error("Erro ao buscar tarefas")
    }

    return await res.json()
}

// ================= POST =================
export async function createTarefa(dados) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })

    if (!res.ok) {
        throw new Error("Erro ao criar tarefa")
    }

    return await res.json()
}

// ================= DELETE =================
export async function deleteTarefa(id) {
    const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
    })

    if (!res.ok) {
        throw new Error("Erro ao deletar tarefa")
    }

    return await res.json()
}

// ================= PUT =================
export async function updateTarefa(tarefa) {
    const res = await fetch(`${API_URL}/${tarefa.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tarefa)
    })

    if (!res.ok) {
        throw new Error("Erro ao atualizar tarefa")
    }

    return await res.json()
}