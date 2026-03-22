let tarefas = [];
let filtro = "todas";

let dataAtual = new Date();
let mesAtual = dataAtual.getMonth();
let anoAtual = dataAtual.getFullYear();

// ===== API =====
async function carregarTarefas() {
    const res = await fetch("/tarefas");
    tarefas = await res.json();
    render();
}

async function salvarTarefa() {
    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    const data = document.getElementById("data").value;

    if (!titulo) {
        alert("Digite um título");
        return;
    }

    await fetch("/tarefas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade,
            data_limite: data || null
        })
    });

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";
    document.getElementById("prioridade").value = "media";
    document.getElementById("categoria").value = "geral";
    document.getElementById("data").value = "";

    fecharModal();
    carregarTarefas();
}

async function deletarTarefa(id) {
    await fetch(`/tarefas/${id}`, { method: "DELETE" });
    carregarTarefas();
}

async function toggleTarefa(t) {
    await fetch(`/tarefas/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...t,
            completed: !t.completed
        })
    });

    carregarTarefas();
}

// ===== MODAL =====
function abrirModal() {
    document.getElementById("modal").classList.add("show");
}

function fecharModal() {
    document.getElementById("modal").classList.remove("show");
}

// ===== RENDER =====
function render() {
    renderLista();
    renderCalendario();
    stats();
}

// ===== LISTA =====
function renderLista() {
    const el = document.getElementById("task-list");
    if (!el) return;

    el.innerHTML = "";

    let lista = tarefas;

    lista.forEach(t => {
        el.innerHTML += `
        <div class="task-item">
            <div class="task-main">
                <span class="task-title">${t.titulo}</span>
                ${t.data_limite ? `<span class="task-date">${t.data_limite}</span>` : ""}
            </div>

            <div class="task-actions">
                <button class="task-delete" onclick="deletarTarefa(${t.id})">🗑</button>
            </div>
        </div>`;
    });

    if (lista.length === 0) {
        el.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>Nenhuma tarefa ainda...</h3>
                <p>Clique em "Nova Tarefa" para começar</p>
            </div>
        `;
    }
}

// ===== CALENDÁRIO =====
function renderCalendario() {
    const grid = document.getElementById("calendarGrid");
    const title = document.getElementById("calendarTitle");

    if (!grid || !title) return;

    grid.innerHTML = "";

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    title.textContent = `${meses[mesAtual]} de ${anoAtual}`;

    const primeiroDia = new Date(anoAtual, mesAtual, 1);
    const ultimoDia = new Date(anoAtual, mesAtual + 1, 0);

    const primeiroDiaSemana = primeiroDia.getDay();
    const diasNoMes = ultimoDia.getDate();

    const ultimoDiaMesAnterior = new Date(anoAtual, mesAtual, 0).getDate();

    const hoje = new Date();
    const hojeDia = hoje.getDate();
    const hojeMes = hoje.getMonth();
    const hojeAno = hoje.getFullYear();

    const totalCelulas = 42;

    for (let i = 0; i < totalCelulas; i++) {
        const dayElement = document.createElement("div");
        dayElement.classList.add("calendar-day");

        const numberElement = document.createElement("div");
        numberElement.classList.add("calendar-day-number");

        const tasksContainer = document.createElement("div");
        tasksContainer.classList.add("calendar-tasks");

        let diaNumero;
        let dataCompleta;
        let outroMes = false;

        if (i < primeiroDiaSemana) {
            diaNumero = ultimoDiaMesAnterior - primeiroDiaSemana + i + 1;
            outroMes = true;

            const mesAnterior = mesAtual === 0 ? 11 : mesAtual - 1;
            const anoMesAnterior = mesAtual === 0 ? anoAtual - 1 : anoAtual;
            dataCompleta = formatarData(anoMesAnterior, mesAnterior, diaNumero);
        } else if (i >= primeiroDiaSemana + diasNoMes) {
            diaNumero = i - (primeiroDiaSemana + diasNoMes) + 1;
            outroMes = true;

            const proximoMes = mesAtual === 11 ? 0 : mesAtual + 1;
            const anoProximoMes = mesAtual === 11 ? anoAtual + 1 : anoAtual;
            dataCompleta = formatarData(anoProximoMes, proximoMes, diaNumero);
        } else {
            diaNumero = i - primeiroDiaSemana + 1;
            dataCompleta = formatarData(anoAtual, mesAtual, diaNumero);
        }

        numberElement.textContent = diaNumero;

        if (outroMes) {
            dayElement.classList.add("other-month");
        }

        if (
            diaNumero === hojeDia &&
            mesAtual === hojeMes &&
            anoAtual === hojeAno &&
            !outroMes
        ) {
            dayElement.classList.add("today");
        }

        const tarefasDoDia = tarefas.filter(t => t.due_date === dataCompleta);

        tarefasDoDia.forEach(tarefa => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("calendar-task");

            if (tarefa.completed) {
                taskItem.classList.add("done");
            }

            taskItem.textContent = tarefa.title;
            tasksContainer.appendChild(taskItem);
        });

        dayElement.appendChild(numberElement);
        dayElement.appendChild(tasksContainer);
        grid.appendChild(dayElement);
    }
}

function formatarData(ano, mes, dia) {
    const mesFormatado = String(mes + 1).padStart(2, "0");
    const diaFormatado = String(dia).padStart(2, "0");
    return `${ano}-${mesFormatado}-${diaFormatado}`;
}

// ===== NAVEGAÇÃO DO CALENDÁRIO =====
function mesAnterior() {
    mesAtual--;

    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }

    renderCalendario();
}

function proximoMes() {
    mesAtual++;

    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }

    renderCalendario();
}

function irParaHoje() {
    const hoje = new Date();
    mesAtual = hoje.getMonth();
    anoAtual = hoje.getFullYear();
    renderCalendario();
}

function mostrarAba(aba) {
    const abaLista = document.getElementById("abaLista");
    const abaCalendario = document.getElementById("abaCalendario");
    const tabLista = document.getElementById("tabLista");
    const tabCalendario = document.getElementById("tabCalendario");

    if (aba === "lista") {
        abaLista.style.display = "block";
        abaCalendario.style.display = "none";
        tabLista.classList.add("active");
        tabCalendario.classList.remove("active");
    } else {
        abaLista.style.display = "none";
        abaCalendario.style.display = "block";
        tabCalendario.classList.add("active");
        tabLista.classList.remove("active");
    }
}

// ===== FILTRO =====
function setFiltro(f) {
    filtro = f;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    if (f === "todas") {
        document.querySelectorAll(".filter-btn")[0].classList.add("active");
    }

    if (f === "pendentes") {
        document.querySelectorAll(".filter-btn")[1].classList.add("active");
    }

    if (f === "concluidas") {
        document.querySelectorAll(".filter-btn")[2].classList.add("active");
    }

    renderLista();
}

// ===== STATS =====
function stats() {
    const total = tarefas.length;
    const done = tarefas.filter(t => t.completed).length;

    const statTotal = document.getElementById("stat-total");
    const statDone = document.getElementById("stat-done");
    const statPending = document.getElementById("stat-pending");
    const statProgress = document.getElementById("stat-progress");

    if (statTotal) statTotal.innerText = total;
    if (statDone) statDone.innerText = done;
    if (statPending) statPending.innerText = total - done;
    if (statProgress) {
        statProgress.innerText = total ? Math.round((done / total) * 100) + "%" : "0%";
    }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");
    const todayBtn = document.getElementById("todayBtn");

    if (prevBtn) prevBtn.addEventListener("click", mesAnterior);
    if (nextBtn) nextBtn.addEventListener("click", proximoMes);
    if (todayBtn) todayBtn.addEventListener("click", irParaHoje);

    mostrarAba("calendario");
    carregarTarefas();
});
