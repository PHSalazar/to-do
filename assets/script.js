const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const nameTask = document.getElementById('name-task');
const btnAdd = document.getElementById('btn-add-newTask');
const saveTask = document.getElementById('save-newTask');
const message = document.getElementById('messages');
const listTasks = document.getElementById('list-tasks');
const numTask = document.getElementById('num-task');
const filter = document.getElementById('filter');
let itemsListStorage = JSON.parse(localStorage.getItem('tasks')) || [];

// Function Add Task
let ultItemClicado;

function addTask(editar = undefined) {
  modal.classList.toggle('show');

  setTimeout(() => {
    //Esperar 100ms para dar foco, evitando erro.
    if (modal.classList.contains('show')) {
      //Verificando se está ativo e definindo foco no campo para NOME DA TAREFA
      nameTask.focus();
    }
  }, 100);

  //Verificar se NOME está undefined (criar nova tarefa)
  if (editar != undefined) {
    nameTask.value = editar.replaceAll('__', ' ');
    ultItemClicado = editar;
    saveTask.innerHTML = 'Editar Tarefa';
    saveTask.setAttribute('f', 'edit');
    document.querySelector(
      '#form-newTask > p',
    ).innerHTML = `Alterando a tarefa: <i><b><span id='original-name'>${editar}</span></b></i>`;
  } else {
    nameTask.value = '';
    saveTask.setAttribute('f', 'add');
    saveTask.innerHTML = 'Salvar Tarefa';
    document.querySelector(
      '#form-newTask > p',
    ).innerHTML = `Para adicionar mais de 1 tarefa de uma vez, digite os nomes separado-as com uma vírgula (,).`;
  }
  // editar != undefined ? (nameTask.value = editar.replaceAll('__', ' ');console.log('')) : '';
}

//Click Add new Task
btnAdd.addEventListener('click', () => {
  addTask(); // Chamar Modal para Adicionar Novo item
});

// Function Close Modal
closeModal.addEventListener('click', () => {
  addTask(); //Fechar modal de Adicionar Novo Item
});

// Function Save Task
function save(val = undefined) {
  if (val == undefined) {
    val = nameTask.value;
  }

  /*
  
  Antes só era possível adicionar um item a cada 8 segundos devido a animação do popup que esperava terminar parar atibar nvamente o botão de Adicionar.
  // btnAdd.setAttribute('disabled', ''); //Desativando botão de Add para não causar conflito
  //btnAdd.innerHTML = `<iconify-icon icon="circum:no-waiting-sign" width="32">><\/iconify-icon> Terminando de adicionar tarefa, aguarde...`; //Mudando texto do botão de Add
  
  */

  modal.classList.remove('show'); //Fechando Modal

  let msg, codeMsg; // Variavel da mensagem que será mostrado.
  let original = document.querySelector('#original-name');

  // let queryExists = itemsListStorage.findIndex(
  //   (item) => item.item === originalName,
  // ); //Query para verificar se já existe o item com o mesmo ID.

  if (original) {
    // verificando se já existe a tarefa na lista. Se existir, então editá-lo.
    msg = `<b>${original.textContent}<\/b> alterado para <b>${val}</b> com sucesso.`;
    codeMsg = 1;
    let indexItem = itemsListStorage.findIndex(
      (item) => item.item === original.textContent,
    );
    itemsListStorage[indexItem].item = val;
    localStorage.setItem('tasks', JSON.stringify(itemsListStorage)); // Salvando ARRAY de itens no LocalSforage
    listTasks.innerHTML = ''; //Limpando lista de tarefas
    loadItemLS(); //Recarregando tarefas
  } else {
    msg = `<b>${val}<\/b> foi incluído na sua Lista de Tarefas!`;
    addItem(val.replaceAll(' ', '__')); //Adicionar item na lista de tarefas
    saveItemLS(val.replaceAll(' ', '__')); //Salvar lista em LocalStorage
  }

  messageShow(msg, codeMsg); // chamar função de mostrar mensagem

  nameTask.value = ''; //Apagando campo NOME DA TAREFA
}
//Function para Mensagem
function messageShow(txt, code = 0) {
  let divNew = document.createElement('div'); //Criando novo elemento PopUp

  code == 1 && divNew.classList.add('suc');

  divNew.classList.add('message'); //Definindo classe do Popup

  divNew.innerHTML = `${txt}<button class="close-popup">x</button>`; //Definindo messagem Popup
  message.appendChild(divNew); //Adicionando novo Popup

  const q = divNew.querySelector('button');
  q.addEventListener('click', () => {
    closePopup(divNew);
  }); // Function para Close Popup criado

  message.classList.add('anim'); //Adicionar Classe com animação
  setTimeout(() => {
    divNew.remove(); //Removendo Elemento de Popup
  }, 8000);
}

// Function Close Popup
function closePopup(ele) {
  ele.remove();
}

// Click Save Task
saveTask.addEventListener('click', () => {
  if (nameTask.value.includes(',')) {
    let v = nameTask.value;
    let s = v.split(',');
    s.forEach((item) => {
      save(item);
    });
  } else {
    save();
  }
});

// Function para adicionar Item
function addItem(nomeTarefa, doneStatus) {
  let ipt = document.createElement('input');
  ipt.checked = doneStatus == true ? 'checked' : '';
  ipt.type = 'checkbox';
  ipt.setAttribute('name', nomeTarefa);
  ipt.classList.add('item-ipt');
  ipt.id = nomeTarefa;

  let label = document.createElement('label');
  label.setAttribute('for', nomeTarefa);

  let html2 = `<div class="item-task"><span class="check"><\/span><span class="item-title">${nomeTarefa.replaceAll(
    '__',
    ' ',
  )}</span><iconify-icon icon="material-symbols:delete-outline" style="color: rgba(0, 0, 0, 0.5);" width="24"></iconify-icon><iconify-icon icon="material-symbols:edit" style="color: rgba(56, 163, 39, .7);" width="24"></iconify-icon></div>`;

  label.innerHTML = html2;
  ipt.addEventListener('change', () => {
    let status = ipt.checked;

    // Procurando Index de NOME_TAREFA
    let item_index_array = itemsListStorage.findIndex(
      (obj) => obj.item == nomeTarefa,
    );

    //Update Status DONE
    itemsListStorage[item_index_array].done = status;
    localStorage.setItem('tasks', JSON.stringify(itemsListStorage)); // Salvando LOCALSTORAGE

    // console.log(`Valor de ${nomeTarefa} alterado para ${status}`);
  });

  ipt.appendChild(label);
  listTasks.appendChild(ipt);
  listTasks.appendChild(label);

  //Click em DELETE
  let icon = label.querySelectorAll('iconify-icon');
  let icon_delete = icon[0];
  let icon_edit = icon[1];

  //Evento Click em DELETE
  icon_delete.addEventListener('click', (event) => {
    event.preventDefault();
    ipt.remove();
    label.remove();
    let valores = itemsListStorage.filter((item) => item.item != nomeTarefa); //Filtro retirando a tarefa clicada.
    localStorage.setItem('tasks', JSON.stringify(valores)); // Salvando ARRAY de itens no LocalSforage
    // console.log('Valores excluídos.');
  });

  //Evento Click em EDIT
  icon_edit.addEventListener('click', (event) => {
    event.preventDefault();
    addTask(nomeTarefa);
  });

  // listTasks.innerHTML += html; // Adicionando novo item ao List Tasks.

  countTasks(); //Contando itens na Lista de Tarefas
}

//Function para Remover Tarefa
function removeTask() {
  let tsk = document.querySelectorAll(`.item-ipt`);
  tsk.forEach((item) => {
    console.log(item);
  });
}

//Function Add localstorage
function saveItemLS(item) {
  const item_array = { item: item, done: false };
  itemsListStorage.push(item_array);

  localStorage.setItem('tasks', JSON.stringify(itemsListStorage)); // Salvando ARRAY de itens no LocalSforage
}

//Function Load LocalStorage
function loadItemLS() {
  //Adicionando item para cada Item que já foi salvo em LOCALSTORAGE
  itemsListStorage.map(({ item, done }) => {
    addItem(item, done);
  });
}
loadItemLS();

// Function Count Tasks
function countTasks() {
  let query = document.querySelectorAll(
    '#list-tasks input[type=checkbox] + label:not(.hide)',
  ); // Query para pegar todos os itena que estao visiveis
  let num = query.length; //Lendo tamanho da array de item-task

  num == 1
    ? (numTask.innerHTML = `${num} tarefa`)
    : (numTask.innerHTML = `${num} tarefas`); //Arrow function para definir plural (texto) corretamente e substituindo texto da Div Num tasks
}

//Function para Filtrar tarefas
function onFilter() {
  let query;

  switch (filter.value) {
    case '0':
      removeFilter(); // Remover todos os filtros
      break;
    case '1':
      removeFilter(); // Remover todos os filtros antes de aplicar um novo PENDINH
      query = document.querySelectorAll(
        '#list-tasks input[type=checkbox]:checked + label',
      );
      query.forEach((item) => {
        item.classList.add('hide'); // adicionar a classe HIDE em todos os itens concluidos
      });
      break;
    case '2':
      removeFilter(); // Remove todos os filtros antes de aplicar um DONE
      query = document.querySelectorAll(
        '#list-tasks input[type=checkbox]:not(:checked) + label',
      );
      query.forEach((item) => {
        item.classList.add('hide'); // Adicionar a classe HIDE em todos os itens PENDENTES
      });
      break;
  }
}

// Function para remover filter
function removeFilter() {
  query = document.querySelectorAll('#list-tasks > label'); // Query para selecionar todos os itens
  query.forEach((item) => {
    item.classList.remove('hide'); // removendo a classe HIDE de todos os itens
  });
}

filter.addEventListener('change', () => {
  onFilter(); //Definindo filtros
  countTasks(); // Contar itens selecionados no filtro
});
