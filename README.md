# PlanIt — Gerenciador de Tarefas com Calendário

O **PlanIt** é uma aplicação web desenvolvida com **Flask (Python)** que permite gerenciar tarefas de forma simples e visual, integrando uma **lista de tarefas** com uma **visualização em calendário mensal**.

O projeto combina backend em Flask com frontend em HTML, CSS e JavaScript, oferecendo uma interface moderna e responsiva.

---

## Funcionalidades

* **Gerenciamento de tarefas**

  * Criar tarefas com título, descrição, prioridade e data
  * Excluir tarefas
  * Listagem dinâmica

*  **Visualização em calendário**

  * Organização das tarefas por data
  * Navegação entre meses
  * Destaque do dia atual

* **Interface moderna**

  * Tema dark
  * Layout responsivo
  * Modal interativo para criação de tarefas

*  **Estatísticas**

  * Total de tarefas
  * Progresso geral (estrutura pronta para evolução)

---

## Tecnologias utilizadas

### Backend

* Python
* Flask
* SQLite

### Frontend

* HTML5
* CSS3
* JavaScript (Vanilla)
* Tailwind CSS

---

##  Estrutura do projeto

```
PLANIT/
│
├── instance/
│   └── database.db          # Banco de dados SQLite
│
├── routes/
│   ├── tarefas.py           # Rotas da API de tarefas
│   └── estatisticas.py      # Rotas de estatísticas
│
├── static/
│   ├── css/
│   │   └── style.css        # Estilos da aplicação
│   │
│   └── js/
│       ├── script.js        # Lógica principal (renderização + calendário)
│       └── api.js           # Comunicação com backend (opcional)
│
├── templates/
│   └── index.html           # Interface principal
│
├── app.py                   # Inicialização do Flask
├── models.py                # Modelos do banco de dados
├── utils.py                 # Funções auxiliares
├── requirements.txt         # Dependências do projeto
└── README.md
```

---

##  Como executar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/planit.git
cd planit
```

---

### 2. Crie um ambiente virtual

```bash
python -m venv venv
```

Ative o ambiente:

* Windows:

```bash
venv\Scripts\activate
```

* Linux/macOS:

```bash
source venv/bin/activate
```

---

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

---

### 4. Execute o projeto

```bash
python app.py
```

Acesse no navegador:

```
http://127.0.0.1:5000
```

---

##  API (Rotas principais)

### Criar tarefa

`POST /tarefas`

```json
{
  "titulo": "Estudar Flask",
  "descricao": "Revisar rotas e models",
  "prioridade": "media",
  "data_limite": "2026-03-20"
}
```

---

### Listar tarefas

`GET /tarefas`

---

### Deletar tarefa

`DELETE /tarefas/<id>`

---

##  Arquitetura

O projeto segue uma arquitetura simples baseada em:

* **Frontend:** responsável pela interface e interação do usuário
* **Backend (Flask):** responsável pela lógica e persistência de dados
* **Banco de dados (SQLite):** armazenamento das tarefas

Fluxo:

```
Usuário → Frontend → API Flask → Banco de Dados
                        ↑
                     JSON
```


