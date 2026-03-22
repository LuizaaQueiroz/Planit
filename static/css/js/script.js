let allTasks = [];
let currentFilter = 'all';
let currentSort = 'newest';
let editingTask = null;
let confirmDeleteId = null;
let currentView = 'list';
let currentMonth = new Date();
let selectedDate = null;

const priorityOrder = { alta: 0, media: 1, baixa: 2 };

// ---------------- TOAST ----------------
function showToast(message, type = 'success') {
const container = document.getElementById('toast-container');
const toast = document.createElement('div');
toast.className = 'toast';
toast.style.background = type === 'success' ? '#22c55e' : '#ef4444';
toast.textContent = message;
container.appendChild(toast);
setTimeout(() => toast.remove(), 2500);
}

// ---------------- MODAL ----------------
function openModal(task = null) {
editingTask = task;
document.getElementById('modal-overlay').classList.remove('hidden');
document.getElementById('input-title').value = task ? task.title : '';
document.getElementById('input-desc').value = task ? task.description || '' : '';
document.getElementById('input-priority').value = task ? task.priority : 'media';
document.getElementById('input-category').value = task ? task.category : 'geral';
document.getElementById('input-due-date').value = task ? task.due_date || '' : '';
}

function closeModal() {
document.getElementById('modal-overlay').classList.add('hidden');
document.getElementById('task-form').reset();
editingTask = null;
}

// ---------------- API ----------------
async function getTarefas() {
const res = await fetch("http://127.0.0.1:5000/tarefas");
return await res.json();
}

async function criarTarefaAPI(data) {
await fetch("http://127.0.0.1:5000/tarefas", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(data)
});
}

async function deletarTarefaAPI(id) {
await fetch(`http://127.0.0.1:5000/tarefas/${id}`, {
method: "DELETE"
});
}

// ---------------- SUBMIT ----------------
async function handleSubmit(e) {
e.preventDefault();

const titulo = document.getElementById('input-title').value;
const descricao = document.getElementById('input-desc').value;
const prioridade = document.getElementById('input-priority').value;
const categoria = document.getElementById('input-category').value;
const data = document.getElementById('input-due-date').value;

await criarTarefaAPI({
titulo,
descricao,
prioridade,
categoria,
data_limite: data
});

closeModal();
carregarTarefas();
}

// ---------------- RENDER ----------------
function renderTasks() {
const container = document.getElementById('task-list');
container.innerHTML = '';

allTasks.forEach(t => {
const div = document.createElement('div');
div.className = 'task-card';
div.innerHTML = `       <div>         <strong>${t.titulo}</strong>         <p>${t.descricao || ''}</p>         <span>${t.prioridade}</span>         <button onclick="deletar(${t.id})">Excluir</button>       </div>
    `;
container.appendChild(div);
});

document.getElementById('stat-total').innerText = allTasks.length;
}

// ---------------- LOAD ----------------
async function carregarTarefas() {
allTasks = await getTarefas();
renderTasks();
}

// ---------------- DELETE ----------------
async function deletar(id) {
await deletarTarefaAPI(id);
carregarTarefas();
}

// ---------------- INIT ----------------
window.onload = carregarTarefas;
