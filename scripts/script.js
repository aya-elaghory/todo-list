import {
  DarkThemeToggleElemnt,
  AppElemnt,
  inputElemnt,
  taskListElemnt,
  getDeletIcons,
  CheckBoxElemnt,
  taskListLink,
  TaskSearchBarButton,
} from "./elemnts.js";

const toggleDarkMode = () => {
  AppElemnt?.classList.toggle("App--isDark");
  saveToDB("darkModeFlag", AppElemnt?.classList.contains("App--isDark"));
};

DarkThemeToggleElemnt.addEventListener("click", toggleDarkMode);

const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
};

const renderEmptyList = () => {
  taskListElemnt.innerHTML = `<li class='EmptyList'>
      <img class='EmptyList__img' src="./assets/icon-empty.svg" alt="list is empty" />
      <p>قائمة المهام فارغة</p>
    </li>`;
};

const renderTaskList = (tasks) => {
  if (!tasks || tasks.length === 0) {
    renderEmptyList();
    return;
  }

  let taskList = "";
  tasks.forEach((task) => {
    taskList += `
    <li class="TaskList__taskContent${
      task.isCompleted ? " TaskList__taskContent--isActive" : ""
    }">
      <div class='TaskList__checkbox' tabindex="0" role="button">
        <img class='TaskList__checkboxImg' src="./assets/icon-checkmark.svg" alt="checkmark" />
      </div>
      
      <div class='TaskList__valueContent'>
        <p class='TaskList__value'>
          ${task.value}
        </p>
        <img src="./assets/icon-basket.svg"
             class='TaskList__deleteIcon'
             alt="basket-icon"
        />
      </div>
      
    </li>`;
  });
  taskListElemnt.innerHTML = taskList;
  inputElemnt.value = "";
  initiTaskListeners();
};
const addTask = (e) => {
  e.preventDefault();

  const taskValue = inputElemnt.value;

  if (!taskValue) return;

  const task = {
    value: taskValue,
    isCompleted: false,
  };

  const tasks = fetchData("tasks") || [];

  tasks.push(task);
  saveToDB("tasks", tasks);
  renderTaskList(tasks);
};

const saveToDB = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

TaskSearchBarButton?.addEventListener("click", addTask);

const deletTask = (e, index) => {
  const answer = confirm("هل انت متاكد انك تريد مسح المهمة");
  if (answer === false) return;
  const tasks = fetchData("tasks");

  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  renderTaskList(tasks);
};

TaskSearchBarButton?.addEventListener("click", addTask);

const initiTaskListeners = () => {
  getDeletIcons().forEach((icon, index) => {
    icon.addEventListener("click", (e) => deletTask(e, index));
  });

  CheckBoxElemnt().forEach((box, index) => {
    box.addEventListener("click", (e) => toggleTask(e, index));
    box.addEventListener(
      "keydown",
      (e) => e.key === "Enter" && toggleTask(e, index)
    );
  });
};

const initDataOnStartup = () => {
  fetchData("darkModeFlag") && toggleDarkMode();
  renderTaskList(fetchData("tasks"));
};

initDataOnStartup();

const toggleTask = (e, index) => {
  const tasks = fetchData("tasks");
  e.currentTarget.parentElement.classList.toggle(
    "TaskList__taskContent--isActive"
  );

  tasks[index].isCompleted = !tasks[index].isCompleted;
  saveToDB("tasks", tasks);
};

taskListLink?.addEventListener("click", () => {
  taskListElemnt.classList.toggle("TaskList__list--hideCompleted");
  taskListLink?.classList.toggle("TaskList__link--isActive");
});

initDataOnStartup();
