// API calls
const BASE_URL = 'http://localhost:3000';
const postsPath = 'todos';
const getToDoLists = () => {
  const postsEndPoint = [BASE_URL, postsPath].join('/');
  return fetch(postsEndPoint).then((response) => {
    return response.json();
  });
};


// CONST
const DomSelectors = {
  root:'todo_list',
  taskElements: {
    title: 'task_title',
    update: 'task_update',
    delete: 'task_delete'
  }
};


// STATE
class State {
  constructor() {
    this._task = [];
  }

  get tasks(){

  } 

  set tasks(newTasks) {
    this._task = newTasks;
    // 
  }

}

// recording how many tasks on the page
let state = new State();

// Task
const renderTask = (task,element) => {
  // render sth 
  const tmp = tasks.map((task) => generateTaskTmp(task, DomSelectors.taskElements))
    .join('');
};

const generateTaskTmp = (task, {title, update, delete}) => {
  return 
   `<li>
   <h1 style= "${completed == true ? "text-decoration: line-through" : ""}"  
   name ="btn-title-${task.id}"> ${task.title}</h1>
   <button class="btn_update" name="btn-update-${task.id}">Update</button>    
   <button class="btn_delete" name="btn-delete-${task.id}">Delete</button>
   </li> `;
};


// INIT
const init = () => {
  getToDoList().then((data) => {
  state.posts = data
  });
  renderTask();
};
  
init();
  