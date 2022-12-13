const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const nameTask = document.getElementById('name-task');
const btnAdd = document.getElementById('btn-add-newTask');
const saveTask = document.getElementById('save-newTask');
const message = document.getElementById('message');
const listTasks = document.getElementById('list-tasks');

// Function Add Task
function addTask() {
  modal.classList.toggle('show');

  if (modal.classList.contains('show')) {
    //Verificando se está ativo e definindo foco no campo para NOME DA TAREFA
    nameTask.focus();
  }
}

//Click Add new Task
btnAdd.addEventListener('click', () => {
  addTask();
});

// Function Close Modal
closeModal.addEventListener('click', () => {
  addTask();
});

// Function Save Task
function save() {
  btnAdd.setAttribute('disabled', ''); //Desativando botão de Add para não causar conflito
  btnAdd.innerHTML = `<iconify-icon icon="circum:no-waiting-sign" width="32">><\/iconify-icon> Terminando de adicionar tarefa, aguarde...`; //Mudando texto do botão de Add

  addItem(nameTask.value); //Adicionar item na lista de tarefas

  modal.classList.toggle('show'); //Fechando Modal
  message.innerHTML = `<b>${nameTask.value}<\/b> foi incluído na sua Lista de Tarefas!`; //Definindo messagem Popup
  nameTask.value = ''; //Apagando campo NOME DA TAREFA

  message.classList.add('anim'); //Adicionar Classe com animação
  setTimeout(() => {
    message.classList.remove('anim'); //Aguardando 5s e removendo Classe de animação
    btnAdd.removeAttribute('disabled'); //Desativando botão de Add para não causar conflito
    btnAdd.innerHTML = `<iconify-icon icon="material-symbols:add-circle-rounded" style="color: #026c9c;" width="32"><\/iconify-icon> Add a task
  `; //Mudando texto do botão de Add
  }, 8000);
}

// Click Save Task
saveTask.addEventListener('click', () => {
  save();
});

// Function para adicionar Item
function addItem(nomeTarefa) {
  let html = `<input type="checkbox" name="${nomeTarefa}" id="${nomeTarefa}">
  <label for="${nomeTarefa}">
    <div class="item-task"><span class="check"><\/span>${nomeTarefa}</div>
  </label>`;

  listTasks.innerHTML += html;
}
