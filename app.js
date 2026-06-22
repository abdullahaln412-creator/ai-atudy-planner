const taskList = document.querySelector("#taskList");
const taskFilter = document.querySelector("#taskFilter");
const quickAddForm = document.querySelector("#quickAddForm");
const progressValue = document.querySelector("#progressValue");
const doneCount = document.querySelector("#doneCount");
const progressMeter = document.querySelector("#progressMeter");
const doneMeter = document.querySelector("#doneMeter");
const adviceText = document.querySelector("#aiAdvice");
const refreshAdvice = document.querySelector("#refreshAdvice");
const timerDisplay = document.querySelector("#timerDisplay");
const startTimer = document.querySelector("#startTimer");
const resetTimer = document.querySelector("#resetTimer");
const resourceSearch = document.querySelector("#resourceSearch");
const resourceGrid = document.querySelector("#resourceGrid");
const chips = document.querySelectorAll(".chip");

const adviceMessages = [
  "Start with the open task that has the closest deadline, then review the generated page on a phone-sized screen.",
  "Spend 20 minutes improving spacing and labels before adding new features.",
  "Use one AI prompt for code review and one prompt for accessibility review; compare the suggestions before editing.",
  "Test both pages locally, then write the review summary while the debugging process is still fresh."
];

function updateProgress() {
  if (!taskList || !progressValue || !doneCount) return;

  const tasks = [...taskList.querySelectorAll("li")];
  const completed = tasks.filter((item) => item.dataset.status === "done").length;
  const total = tasks.length;
  const percent = total ? Math.round((completed / total) * 100) : 0;

  progressValue.textContent = `${percent}%`;
  doneCount.textContent = `${completed} / ${total}`;
  if (progressMeter) progressMeter.style.width = `${percent}%`;
  if (doneMeter) doneMeter.style.width = `${percent}%`;
}

function applyTaskFilter() {
  if (!taskList || !taskFilter) return;

  const value = taskFilter.value;
  taskList.querySelectorAll("li").forEach((item) => {
    item.classList.toggle("is-hidden", value !== "all" && item.dataset.status !== value);
  });
}

function buildTask(title) {
  const item = document.createElement("li");
  item.dataset.status = "open";
  item.innerHTML = `
    <label>
      <input type="checkbox">
      <span>
        <strong></strong>
        <small>Added by student</small>
      </span>
    </label>
    <em>New</em>
  `;
  item.querySelector("strong").textContent = title;
  return item;
}

if (quickAddForm && taskList) {
  quickAddForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = quickAddForm.elements.taskTitle;
    const title = input.value.trim();
    if (!title) return;

    taskList.append(buildTask(title));
    input.value = "";
    updateProgress();
    applyTaskFilter();
  });
}

if (taskList) {
  taskList.addEventListener("change", (event) => {
    if (event.target.matches('input[type="checkbox"]')) {
      const item = event.target.closest("li");
      item.dataset.status = event.target.checked ? "done" : "open";
      item.querySelector("em").textContent = event.target.checked ? "Completed" : "Open";
      updateProgress();
      applyTaskFilter();
    }
  });
}

if (taskFilter) {
  taskFilter.addEventListener("change", applyTaskFilter);
}

if (refreshAdvice && adviceText) {
  refreshAdvice.addEventListener("click", () => {
    const current = adviceMessages.indexOf(adviceText.textContent);
    adviceText.textContent = adviceMessages[(current + 1) % adviceMessages.length];
  });
}

let timerSeconds = 25 * 60;
let timerId = null;

function renderTimer() {
  if (!timerDisplay) return;
  const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
  const seconds = (timerSeconds % 60).toString().padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

if (startTimer) {
  startTimer.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startTimer.textContent = "Start";
      return;
    }

    startTimer.textContent = "Pause";
    timerId = setInterval(() => {
      timerSeconds = Math.max(0, timerSeconds - 1);
      renderTimer();
      if (timerSeconds === 0) {
        clearInterval(timerId);
        timerId = null;
        startTimer.textContent = "Start";
      }
    }, 1000);
  });
}

if (resetTimer) {
  resetTimer.addEventListener("click", () => {
    clearInterval(timerId);
    timerId = null;
    timerSeconds = 25 * 60;
    if (startTimer) startTimer.textContent = "Start";
    renderTimer();
  });
}

function filterResources() {
  if (!resourceGrid) return;

  const activeChip = document.querySelector(".chip.active");
  const activeCategory = activeChip ? activeChip.dataset.filter : "all";
  const query = resourceSearch ? resourceSearch.value.trim().toLowerCase() : "";

  resourceGrid.querySelectorAll(".resource-card").forEach((card) => {
    const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
    const matchesQuery = card.textContent.toLowerCase().includes(query);
    card.classList.toggle("is-hidden", !matchesCategory || !matchesQuery);
  });
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    filterResources();
  });
});

if (resourceSearch) {
  resourceSearch.addEventListener("input", filterResources);
}

updateProgress();
renderTimer();
