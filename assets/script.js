// Seleção de Elementos HTML
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
const nameTask = document.getElementById("name-task");
const saveTask = document.getElementById("save-newTask");
const message = document.getElementById("messages");
const listTasks = document.getElementById("list-tasks");
const numTask = document.getElementById("num-task");
const filter = document.getElementById("filter");
let itemsListStorage = JSON.parse(localStorage.getItem("tasks")) || [];

// Function Add Task
let ultItemClicado;

function modalAdicionarTarefa(editar = undefined) {
  modal.classList.toggle("show"); // alterar entre mostrar ou ocultar o modal

  /*  Verificar se EDITAR está undefined (criar nova tarefa)
      Se não estiver undefined, significa que está alterando uma tarefa já existente. */
  if (editar != undefined) {
    nameTask.value = editar.replaceAll("__", " ");
    ultItemClicado = editar;
    saveTask.innerHTML = "Editar Tarefa";
    saveTask.setAttribute("f", "edit");
    document.querySelector(
      "#form-newTask > p"
    ).innerHTML = `Alterando a tarefa: <i><b><span id='original-name'>${editar}</span></b></i>`;
  } else {
    nameTask.value = "";
    saveTask.setAttribute("f", "add");
    saveTask.innerHTML = "Salvar Tarefa";
    document.querySelector(
      "#form-newTask > p"
    ).innerHTML = `Para adicionar mais de 1 tarefa de uma vez, digite os nomes separado-as com uma vírgula (,).`;
  }
}

/* --------------------------------------
------ FUNÇÕES RELACIONADAS AO MODAL ----
---------------------------------------*/
// Function Save Task
function salvarItem(valorItem = undefined) {
  if (valorItem == undefined) {
    valorItem = nameTask.value;
  }

  modal.classList.remove("show"); //Fechando Modal

  let msg, codeMsg; // Variavel da mensagem que será mostrado.
  let original = document.querySelector("#original-name");

  if (original) {
    // verificando se já existe a tarefa na lista. Se existir, então editá-lo.
    msg = `<b>${original.textContent}<\/b> alterado para <b>${valorItem}</b> com sucesso.`;
    codeMsg = 1;
    let indexItem = itemsListStorage.findIndex(
      (item) => item.item === original.textContent
    );
    itemsListStorage[indexItem].item = valorItem;
    localStorage.setItem("tasks", JSON.stringify(itemsListStorage)); // Salvando ARRAY de itens no LocalSforage
    listTasks.innerHTML = ""; //Limpando lista de tarefas
    carregarLocalStorage(); //Recarregando tarefas
  } else if (valorItem.trim().length === 0) {
    alert("Não é possível adicionar uma tarefa em branco.");
    return;
  } else {
    msg = `<b>${valorItem}<\/b> foi incluído na sua Lista de Tarefas!`;
    addItem(valorItem.replaceAll(" ", "__")); //Adicionar item na lista de tarefas
    salvarItemLocalStorage(valorItem.replaceAll(" ", "__")); //Salvar lista em LocalStorage
  }

  alerta(msg, codeMsg); // chamar função de mostrar mensagem
  nameTask.value = ""; //Apagando campo NOME DA TAREFA
}

//Function para alert
function alerta(txt, code = 0) {
  let divNew = document.createElement("div"); //Criando novo elemento PopUp

  code == 1 && divNew.classList.add("sucesso");

  divNew.classList.add("alerta"); //Definindo classe do Popup

  divNew.innerHTML = `${txt}<button class="close-popup">x</button>`; //Definindo messagem Popup
  message.appendChild(divNew); //Adicionando novo Popup

  const q = divNew.querySelector("button");
  q.addEventListener("click", () => {
    divNew.remove(); // Fechar alert
  });

  message.classList.add("anim"); //Adicionar Classe com animação
  setTimeout(() => {
    divNew.remove(); //Removendo Elemento de Popup
  }, 8000);
}

/*----------------------------------------------------------------------------
----------- Funções Relacionadas à Manipulação da Lista de Tarefas -----------
----------------------------------------------------------------------------*/

// Clique para salvar tarefa (dentro do Modal)
saveTask.addEventListener("click", () => {
  if (nameTask.value.includes(",")) {
    let tarefas = nameTask.value;
    let tarefasSeparadas = tarefas.split(",");
    tarefasSeparadas.forEach((item) => {
      salvarItem(item);
    });
  } else {
    salvarItem();
  }
});

function formAddTask(event) {
  event.preventDefault();

  if (nameTask.value.includes(",")) {
    let tarefas = nameTask.value;
    let tarefasSeparadas = tarefas.split(",");
    tarefasSeparadas.forEach((item) => {
      salvarItem(item);
    });
  } else {
    salvarItem();
  }
}

// Function para adicionar Item
function addItem(nomeTarefa, doneStatus) {
  let ipt = document.createElement("input");
  ipt.checked = doneStatus == true ? "checked" : "";
  ipt.type = "checkbox";
  ipt.setAttribute("name", nomeTarefa);
  ipt.classList.add("item-ipt");
  ipt.id = nomeTarefa;

  let label = document.createElement("label");
  label.setAttribute("for", nomeTarefa);

  let html2 = `<div class="item-task"><span class="check"><\/span><span class="item-title">${nomeTarefa.replaceAll(
    "__",
    " "
  )}</span><iconify-icon icon="material-symbols:delete-outline" style="color: rgba(0, 0, 0, 0.5);" width="24"></iconify-icon><iconify-icon icon="material-symbols:edit" style="color: rgba(56, 163, 39, .7);" width="24"></iconify-icon></div>`;

  label.innerHTML = html2;
  ipt.addEventListener("change", () => {
    let status = ipt.checked;

    // Procurando Index de NOME_TAREFA
    let item_index_array = itemsListStorage.findIndex(
      (obj) => obj.item == nomeTarefa
    );

    //Update Status DONE
    itemsListStorage[item_index_array].done = status;
    localStorage.setItem("tasks", JSON.stringify(itemsListStorage)); // Salvando LOCALSTORAGE

    // console.log(`Valor de ${nomeTarefa} alterado para ${status}`);
  });

  ipt.appendChild(label);
  listTasks.appendChild(ipt);
  listTasks.appendChild(label);

  //Click em DELETE
  let icon = label.querySelectorAll("iconify-icon");
  let icon_delete = icon[0];
  let icon_edit = icon[1];

  //Evento Click em DELETE
  icon_delete.addEventListener("click", (event) => {
    event.preventDefault();
    ipt.remove();
    label.remove();
    recarregarLocalStorage();
    contarTarefas();
    let valores = itemsListStorage.filter((item) => item.item != nomeTarefa); //Filtro retirando a tarefa clicada.
    localStorage.setItem("tasks", JSON.stringify(valores)); // Salvando ARRAY de itens no LocalSforage
    console.log(valores);
  });

  //Evento Click em EDIT
  icon_edit.addEventListener("click", (event) => {
    event.preventDefault();
    modalAdicionarTarefa(nomeTarefa);
  });

  contarTarefas(); //Contando itens na Lista de Tarefas
}

/*---------------------------------
------- FUNÇÕES PARA SALVAR NO LOCALSTORAGE
-------------------------------- */
function salvarItemLocalStorage(item) {
  const item_array = { item: item, done: false };
  itemsListStorage.push(item_array);

  localStorage.setItem("tasks", JSON.stringify(itemsListStorage)); // Salvando ARRAY de itens no LocalSforage
}

//Function Load LocalStorage
function carregarLocalStorage() {
  //Adicionando item para cada Item que já foi salvo em LOCALSTORAGE
  itemsListStorage.map(({ item, done }) => {
    addItem(item, done);
  });
}
carregarLocalStorage();

function getLocalStorage() {
  return localStorage.getItem("tasks");
}

function recarregarLocalStorage() {
  itemsListStorage = JSON.parse(localStorage.getItem("tasks")) || [];
}

/* ---------------
---- Funções Relacionadas ao Filtro de Tarefas
----------------*/

function contarTarefas() {
  let query = document.querySelectorAll(
    "#list-tasks input[type=checkbox] + label:not(.hide)"
  ); // Query para pegar todos os itena que estao visiveis
  let num = query.length; //Lendo tamanho da array de item-task

  if (num == 0) {
    numTask.innerHTML = "";
    listTasks.classList.add("no-tasks");
  } else if (num == 1) {
    numTask.innerHTML = `${num} tarefa`;
    listTasks.classList.remove("no-tasks");
  } else if (num > 1) {
    numTask.innerHTML = `${num} tarefas`;
    listTasks.classList.remove("no-tasks");
  }
}

//Function para Filtrar tarefas
function onFilter() {
  let query;

  switch (filter.value) {
    case "0":
      removerFiltro(); // Remover todos os filtros
      break;
    case "1":
      removerFiltro(); // Remover todos os filtros antes de aplicar um novo
      query = document.querySelectorAll(
        "#list-tasks input[type=checkbox]:checked + label"
      );
      query.forEach((item) => {
        item.classList.add("hide"); // adicionar a classe HIDE em todos os itens concluidos
      });
      break;
    case "2":
      removerFiltro(); // Remove todos os filtros antes de aplicar um DONE
      query = document.querySelectorAll(
        "#list-tasks input[type=checkbox]:not(:checked) + label"
      );
      query.forEach((item) => {
        item.classList.add("hide"); // Adicionar a classe HIDE em todos os itens PENDENTES
      });
      break;
  }
}

// Function para remover filter
function removerFiltro() {
  query = document.querySelectorAll("#list-tasks > label"); // Query para selecionar todos os itens
  query.forEach((item) => {
    item.classList.remove("hide"); // removendo a classe HIDE de todos os itens
  });
}

filter.addEventListener("change", () => {
  onFilter(); //Definindo filtros
  contarTarefas(); // Recontar itens selecionados no filtro
});
