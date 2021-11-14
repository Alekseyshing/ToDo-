(function () {
  //создаем и возвращаем заголовок приложения 
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createToDoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary')
    button.textContent = 'Добавить дело';
    button.id = 'btn';
    button.disabled = true;


    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createToDoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  function createToDoItem(name, done) {
    let item = document.createElement('li');
    //кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента списка, а так же для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = name;
    buttonGroup.classList.add('btn-group', 'button-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';


    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    if (done) {
      item.classList.add("list-group-item-success");
    } else {
      item.classList.remove("list-group-item-success");
    }


    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton
    };
  }


  function createToDoApp(container, title = 'Список дел') {
    // let container = document.getElementById('todo-App');

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createToDoItemForm();
    let todoList = createToDoList();
    // let todoItems = [createToDoItem('Сходить на хлебом'), createToDoItem('Купить молоко')];

    function loadTodos() {
      const data = localStorage.getItem(title);
      if (data) return JSON.parse(data);
      else return [];
    }

    const todos = loadTodos();

    container.append(todoAppTitle, todoItemForm.form, todoList);

    todoItemForm.input.addEventListener('input', function () {
      todoItemForm.button.disabled = !todoItemForm.input.value;
    })


    const addTodo = (obj) => {
      let todoItem = createToDoItem(obj.name, obj.done);

      //создаем и добавляем список в новое дело с названием из поля ввода
      // todoList.append(createToDoItem(todoItemForm.input.value).item);

      // let todoItem = createToDoItem(todoItemForm.input.value);

      //добавляем обработчики на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        obj.done = !obj.done;
        localStorage.setItem(title, JSON.stringify(todos));
        todoItem.item.classList.toggle('list-group-item-success');
      });
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          todos.splice(todos.indexOf(obj), 1);
          localStorage.setItem(title, JSON.stringify(todos));
        }
      });

      //создаем и добавляем список в новое дело с названием из поля ввода
      todoList.append(todoItem.item);
    }

    todos.forEach(item => {
      addTodo(item)
    })


    //браузер создает событие на форме по нажатию на Enter или кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима чтобы предотвратить стандартное действие браузера
      //в данном случае, мы не хотим чтобы страница перегружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return
      }

      let obj = {
        name: todoItemForm.input.value,
        done: false,
        id: Date.now() + (Math.random().toString().slice(2, 6))
      };


      todos.push(obj);
      localStorage.setItem(title, JSON.stringify(todos));

      addTodo(obj);


      //обнуляем значение в поле чтобы не пришлось стирать его вручную
      todoItemForm.form.reset();
      todoItemForm.button.disabled = true;

    });
  }
  window.createToDoApp = createToDoApp;
})();


