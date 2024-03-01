const todos = [];
const RENDER_EVENT = "render-todo";

function generateID() {
	return +new Date();
}

function generateTodoObject(id, task, timestamp, isCompleted) {
	return {
		id,
		task,
		timestamp,
		isCompleted,
	};
}

const findTodo = (todoId) => {
	for (const todoItem of todos) {
		if (todoItem.id === todoId) {
			return todoItem;
		}
	}
	return null;
};

function findTodoIndex(todoId) {
	for (const index in todos) {
		if (todos[index].id === todoId) {
			return index;
		}
	}

	return -1;
}

const makeTodo = (todoObject) => {
	const { id, task, timestamp, isCompleted } = todoObject;

	const textTitle = document.createElement("h2");
	textTitle.innerText = task;

	const textTimestamp = document.createElement("p");
	textTimestamp.innerText = timestamp;

	const textContainer = document.createElement("div");
	textContainer.classList.add("inner");
	textContainer.append(textTitle, textTimestamp);

	const container = document.createElement("div");
	container.classList.add("item", "shadow");
	container.append(textContainer);
	container.setAttribute("id", `todo-${id}`);

	if (isCompleted) {
		const undoButton = document.createElement("button");
		undoButton.classList.add("undo-button");

		undoButton.addEventListener("click", () => {
			undoTaskFromCompleted(id);
		});

		const trashButton = document.createElement("button");
		trashButton.classList.add("trash-button");

		trashButton.addEventListener("click", () => {
			removeTaskFromCompleted(id);
		});

		container.append(undoButton, trashButton);
	} else {
		const checkButton = document.createElement("button");
		checkButton.classList.add("check-button");

		checkButton.addEventListener("click", () => {
			addTaskToCompleted(id);
		});

		container.append(checkButton);
	}

	return container;
};

function addTodo() {
	const textTodo = document.getElementById("title").value;
	const timestamp = document.getElementById("date").value;

	const generatedID = generateID();
	const todoObject = generateTodoObject(
		generatedID,
		textTodo,
		timestamp,
		false
	);
	todos.push(todoObject);

	document.dispatchEvent(new Event(RENDER_EVENT));
	// saveData();
}

const addTaskToCompleted = (todoId) => {
	const todoTarget = findTodo(todoId);

	if (todoTarget == null) return;

	todoTarget.isCompleted = true;
	document.dispatchEvent(new Event(RENDER_EVENT));
	// saveData();
};

const removeTaskFromCompleted = (todoId) => {
	const todoTarget = findTodoIndex(todoId);

	if (todoTarget === -1) return;

	todos.splice(todoTarget, 1);

	document.dispatchEvent(new Event(RENDER_EVENT));
	// saveData();
};

const undoTaskFromCompleted = (todoId) => {
	const todoTarget = findTodo(todoId);

	if (todoTarget == null) return;

	todoTarget.isCompleted = false;
	document.dispatchEvent(new Event(RENDER_EVENT));
	// saveData();
};

document.addEventListener("DOMContentLoaded", () => {
	const submitForm = document.getElementById("form");
	submitForm.addEventListener("submit", (event) => {
		event.preventDefault();
		addTodo();
	});

	// if (isStorageExist()) {
	// 	loadDataFromStorage();
	// }
});

document.addEventListener(RENDER_EVENT, () => {
	const unCompletedTODOList = document.getElementById("todos");
	unCompletedTODOList.innerHTML = "";

	const listCompleted = document.getElementById("completed-todos");
	listCompleted.innerHTML = "";

	for (todoItem of todos) {
		const todoElement = makeTodo(todoItem);
		if (todoItem.isCompleted) {
			listCompleted.append(todoElement);
		} else {
			unCompletedTODOList.append(todoElement);
		}
	}
});

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO-APPS";

const isStorageExist = () => {
	if (typeof Storage === "undefined") {
		alert("Browser kamu tidak mendukung Web Storage");
		return false;
	}

	return true;
};

const saveData = () => {
	if (isStorageExist()) {
		const parsed = JSON.stringify(todos);
		localStorage.setItem(STORAGE_KEY, parsed);
		document.dispatchEvent(new Event(SAVED_EVENT));
	}
};

document.addEventListener(SAVED_EVENT, () => {
	console.log(localStorage.getItem(STORAGE_KEY));
});

const loadDataFromStorage = () => {
	const serializedData = localStorage.getItem(STORAGE_KEY);
	let data = JSON.parse(serializedData);

	if (data !== null) {
		for (const todo of data) {
			todos.push(todo);
		}
	}
	document.dispatchEvent(new Event(RENDER_EVENT));
};
