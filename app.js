// API calls
const BASE_URL = 'http://localhost:3000';
const postsPath = 'todos';
const getTaskList = () => {
  const getEndPoint = [BASE_URL, postsPath].join('/');
  return fetch(getEndPoint).then(response => {
      return response.json();
  });
};

// DOM selector
const DomSelectors = {
    root: 'task__list',
    taskSection: {
        taskContainer: 'task__container',
        taskEntry: 'task__entry',
        markedTaskEntry: 'task__entry-marked',
        title: 'task__title',
        edit: 'task__edit',
        deleteTask: 'task__delete',
    },
};

// State
class Task {
    constructor() {
        this._tasks = [];
    }

    get tasks() {
        return this._tasks;
    }

    set tasks(newTasks) {
        const sortedTasks = sortTasks(newTasks);
        this._tasks = newTasks;
        // render upon recieve new tasks and sort it based on its status
        renderTasks(this._tasks, document.querySelector('.task__list'));
    }

}

let taskList = new Task();

// Sort the tasks on list
const sortTasks = (taskList) => {
    taskList.sort(function (x, y) {
        return (x.completed === y.completed) ? 0 : x.completed ? 1 : -1;
    });
};


const createTask = (title, completed) => {
    const postsEndPoint = [BASE_URL, postsPath].join('/');
    const configObject = {
        method: 'POST',
        headers:
        {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            title,
            completed
        })
    };
    fetch(postsEndPoint, configObject)
        .then((response) => {
            return response.json();
        });

};

const updateTask =(id, title, completed) =>{
    const updateEndPoint = [BASE_URL, postsPath, id].join('/');
    const configObject = {
        method: 'PUT',
        headers:
        {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            completed
        })
    };

    fetch(updateEndPoint, configObject)
        .then((response) => {
            return response.json();
        });

}

const deleteTask = (id) => {
    const delEndPoint = [BASE_URL, postsPath, id].join('/');
    return fetch(delEndPoint, {
        method: "DELETE",
    }).then(response => response.json());
};

//  VIEW RENDER
const render = (tmp, element) => {
    element.innerHTML = tmp;
};


const renderTasks = (tasks, element) => {
    const tmp =
        tasks !== undefined
            ? tasks
                .map(task => generateTaskEntry(task, DomSelectors.taskSection))
                .join('')
            : [];

    element !== undefined ? render(tmp, element) : null;

}

// TEMPLATE
const generateTaskEntry = (task, { taskEntry, markedTaskEntry, title, edit, deleteTask }) => {
    const switchElement = true ?
        `<h3 id="title-click-${task.id}" style="cursor:grab">${task.title}</h3>` :
        `<input type="text" id="input__box-edit-${task.id}" name="create-task" placeholder=${task.title}/>`;


    return ` 
        <section class= "${taskEntry}" style= "${task.completed ? "text-decoration: line-through;" : null}">
            <div class="${title}" id="div-${task.id}">
                <h3 id="title-click-${task.id}" style="cursor:grab">${task.title}</h3>
            </div>

            <div class="${edit}"  style="${task.completed ? "display: none" : null}" >
                <svg  id="btn-edit-${task.id}" focusable="false" aria-hidden="true" viewBox="0 0 24 24" 
                data-testid="EditIcon" aria-label="fontSize small">
                    <path  id="btn-edit-${task.id}"fill="#ffffff" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 
                    0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z">
                    </path>
                </svg>
            </div>

            <div class="${deleteTask}" id="btn-delete-${task.id}">
                <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DeleteIcon" aria-label="fontSize small">
                    <path  id="btn-delete-${task.id}" fill="#ffffff" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z">
                    </path>
                </svg>
            <div>
        </section>
    `;
}


const setUpCardsEventInputBox = cardsElement => {
    cardsElement.addEventListener('click', event => {
        const inputVal = document.getElementById("input__box").value;
        if (event?.target?.id?.startsWith('input__submit')) {
            createTask(inputVal, false);
            window.location.reload();
        }
    });
};

const setUpCardsEventTaskEntry = (cardsElement) => {
    cardsElement.addEventListener('click', event => {
        // Delete
        if (event.target.id.startsWith('btn-delete')) {
            const id = event.target.id.substring(11);
            deleteTask(id);
            window.location.reload();
        }
        // Edit
        if (event.target.id.startsWith('btn-edit')) {
            const id = event.target.id.substring(9);
            const task = taskList.tasks.find(val => val.id == id);
            const editBox = `<input type="text" id="input__box-edit-${task.id}" 
                name="create-task" 
                placeholder="${task.title}"/>`;
            document.getElementById(`div-${id}`).innerHTML = editBox;

        }
        //  Completed
        if (event.target.id.startsWith('title-click')) {
            const id = event.target.id.substring(12);
            const task = taskList.tasks.find(val => val.id == id);
            updateTask(id, task.title, !task.completed);
            window.location.reload();
        }

    });
    // Submit
    cardsElement.addEventListener('keyup', event => {
        console.log(event.target).value;
        if (event.target.id.startsWith('input__box-edit-') && event.keyCode === 13) {
            event.preventDefault();
            event.stopImmediatePropagation();
            const id = event.target.id.substring(16);
            const task = taskList.tasks.find(val => val.id == id);
            const title = document.getElementById(event.target.id).value;
            updateTask(id,title,task.complete);
            window.location.reload();
        }
    })
};

// INIT
const init = () => {
    getTaskList().then(data => { taskList.tasks = data });
    const inputElement = document.querySelector(
        ".header"
    );
    const taskElement = document.querySelector(`.${DomSelectors.root}`);
    setUpCardsEventTaskEntry(taskElement);
    setUpCardsEventInputBox(inputElement);
}

init();