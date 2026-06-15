const timerDisplay = document.getElementById("timer-display");
const timerStatus = document.getElementById("timer-status");
const timerProgress = document.getElementById("timer-progress");
const timerError = document.getElementById("timer-error");
const completionCard = document.getElementById("completion-card");
const completionQuote = document.getElementById("completion-quote");
const completionAuthor = document.getElementById("completion-author");
const activityLog = document.getElementById("activity-log");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const clearLogBtn = document.getElementById("clear-log-btn");

const RING_CIRCUMFERENCE = 2 * Math.PI * 54;

// Timer state
let totalSeconds = 0;
let remainingSeconds = 0;
let isRunning = false;
let isPaused = false;
let pauseResolver = null;
let countdownGeneration = 0;


// Activity log - makes async behavior visible in the UI
function logActivity(message, kind = "sync") {
  const item = document.createElement("li");
  item.dataset.kind = kind;
  const time = new Date().toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  item.textContent = `[${time}] ${message}`;
  activityLog.prepend(item);

  while (activityLog.children.length > 40) {
    activityLog.removeChild(activityLog.lastChild);
  }
}

function showError(message) {
  timerError.textContent = message;
  timerError.hidden = false;
  logActivity(`Error: ${message}`, "error");
}

function clearError() {
  timerError.hidden = true;
  timerError.textContent = "";
}

// 1. Synchronous helpers (run on the call stack immediately)
function formatTime(total) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readDurationFromInputs() {
  const minutes = Number(minutesInput.value) || 0;
  const seconds = Number(secondsInput.value) || 0;
  return minutes * 60 + seconds;
}

function updateDisplay(secondsLeft) {
  timerDisplay.textContent = formatTime(secondsLeft);

  if (totalSeconds > 0) {
    const progress = secondsLeft / totalSeconds;
    timerProgress.style.strokeDashoffset = String(
      RING_CIRCUMFERENCE * (1 - progress)
    );
  } else {
    timerProgress.style.strokeDashoffset = "0";
  }
}

function setControls({ running, paused }) {
  startBtn.disabled = running && !paused;
  pauseBtn.disabled = !running;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  minutesInput.disabled = running;
  secondsInput.disabled = running;
}


// 2. Callbacks — classic async pattern (used for validation)
function validateDurationCallback(seconds, callback) {
  logActivity("validateDurationCallback() entered (sync)", "sync");

  setTimeout(() => {
    logActivity("Validation callback fired after 300ms", "callback");

    if (!Number.isFinite(seconds) || seconds <= 0) {
      callback(new Error("Duration must be greater than zero."));
      return;
    }

    if (seconds > 3600) {
      callback(new Error("Maximum duration is 60 minutes."));
      return;
    }

    callback(null, seconds);
  }, 300);
}


// 3. Promises — delay, validation, and chaining
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

function validateDuration(seconds) {
  return new Promise((resolve, reject) => {
    logActivity("validateDuration() Promise created (pending)", "promise");

    setTimeout(() => {
      if (!Number.isFinite(seconds) || seconds <= 0) {
        reject(new Error("Duration must be greater than zero."));
        return;
      }

      if (seconds > 3600) {
        reject(new Error("Maximum duration is 60 minutes."));
        return;
      }

      logActivity("validateDuration() fulfilled", "promise");
      resolve(seconds);
    }, 300);
  });
}


function prepareCountdown(seconds) {
  logActivity("prepareCountdown() chain started", "promise");

  return validateDuration(seconds)
    .then((validSeconds) => {
      logActivity(`Step 1 done: ${validSeconds}s validated`, "promise");
      timerStatus.textContent = "Warming up…";
      return delay(500).then(() => validSeconds);
    })
    .then((validSeconds) => {
      logActivity("Step 2 done: warm-up delay finished", "promise");
      timerStatus.textContent = "Starting countdown…";
      return validSeconds;
    })
    .catch((error) => {
      logActivity(`Chain rejected: ${error.message}`, "error");
      throw error;
    });
}


// 4. Fetch — asynchronous API call when timer completes
const QUOTE_API = "https://api.quotable.io/random?maxLength=120";

function fetchCompletionQuote() {
  logActivity("fetch() started — request is async", "async");
  timerStatus.textContent = "Fetching completion quote…";

  return fetch(QUOTE_API)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Quote API responded with ${response.status}`);
      }
      logActivity("fetch() response received", "async");
      return response.json();
    })
    .then((data) => ({
      text: data.content,
      author: data.author,
    }))
    .catch((error) => {
      logActivity(`fetch() failed: ${error.message}`, "error");
      return {
        text: "Great job staying focused until the timer ended!",
        author: "Fallback message",
      };
    });
}


// 5. async / await — main countdown loop
async function waitWhilePaused() {
  while (isPaused) {
    await new Promise((resolve) => {
      pauseResolver = resolve;
    });
    pauseResolver = null;
  }
}

async function runCountdown(seconds) {
  const generation = ++countdownGeneration;

  try {
    clearError();
    completionCard.hidden = true;

    const validSeconds = await prepareCountdown(seconds);

    if (generation !== countdownGeneration) return;

    totalSeconds = validSeconds;
    remainingSeconds = validSeconds;
    isRunning = true;
    isPaused = false;
    setControls({ running: true, paused: false });
    updateDisplay(remainingSeconds);
    logActivity(`async runCountdown() — ticking ${validSeconds}s`, "async");

    while (remainingSeconds > 0) {
      if (generation !== countdownGeneration) return;

      await waitWhilePaused();
      if (generation !== countdownGeneration) return;

      await delay(1000);

      if (generation !== countdownGeneration) return;

      remainingSeconds -= 1;
      updateDisplay(remainingSeconds);
      logActivity(`Tick: ${formatTime(remainingSeconds)} remaining`, "async");
    }

    timerStatus.textContent = "Done!";
    logActivity("Countdown finished — awaiting fetch()", "async");

    const quote = await fetchCompletionQuote();

    if (generation !== countdownGeneration) return;

    completionQuote.textContent = `"${quote.text}"`;
    completionAuthor.textContent = `— ${quote.author}`;
    completionCard.hidden = false;
    timerStatus.textContent = "Countdown complete";
    logActivity("Quote displayed — async flow complete", "async");
  } catch (error) {
    showError(error.message);
    timerStatus.textContent = "Something went wrong";
  } finally {
    isRunning = false;
    isPaused = false;
    setControls({ running: false, paused: false });
  }
}


// 6. Callback hell demo — nested callbacks vs Promises (educational only)
function demoCallbackHell() {
  logActivity("Callback hell demo — nested setTimeout callbacks", "callback");

  setTimeout(() => {
    logActivity("Hell step 1: after 200ms", "callback");

    setTimeout(() => {
      logActivity("Hell step 2: nested inside step 1", "callback");

      setTimeout(() => {
        logActivity("Hell step 3: deeply nested — hard to read & debug", "callback");
        logActivity("Refactor with Promises or async/await instead", "promise");
      }, 200);
    }, 200);
  }, 200);
}


// 7. Event loop demo — order of sync, microtasks, and macrotasks
function demoEventLoop() {
  logActivity('demoEventLoop() — synchronous "Start"', "sync");

  setTimeout(() => {
    logActivity("Macrotask: setTimeout callback (runs after stack + microtasks)", "callback");
  }, 0);

  Promise.resolve().then(() => {
    logActivity("Microtask: Promise.then() (runs before setTimeout)", "promise");
  });

  logActivity('demoEventLoop() — synchronous "End" (stack not empty yet)', "sync");
}

function demoCallbacks() {
  logActivity("Callback demo — validateDurationCallback()", "callback");

  validateDurationCallback(10, (error, value) => {
    if (error) {
      logActivity(`Callback received error: ${error.message}`, "error");
      return;
    }
    logActivity(`Callback received value: ${value} seconds`, "callback");
  });
}

function demoPromises() {
  const demoSeconds = readDurationFromInputs() || 5;

  prepareCountdown(demoSeconds)
    .then((seconds) => {
      logActivity(`Promise chain resolved: ready for ${seconds}s`, "promise");
    })
    .catch((error) => {
      logActivity(`Promise chain caught: ${error.message}`, "error");
    });
}

// Event handlers
startBtn.addEventListener("click", () => {
  const seconds = readDurationFromInputs();
  runCountdown(seconds);
});

pauseBtn.addEventListener("click", () => {
  if (!isRunning) return;

  isPaused = !isPaused;
  setControls({ running: true, paused: isPaused });

  if (isPaused) {
    timerStatus.textContent = "Paused";
    logActivity("Timer paused — async loop waits at await", "async");
  } else {
    timerStatus.textContent = "Running…";
    logActivity("Timer resumed", "async");
    if (pauseResolver) pauseResolver();
  }
});

resetBtn.addEventListener("click", () => {
  countdownGeneration += 1;
  isRunning = false;
  isPaused = false;

  if (pauseResolver) pauseResolver();

  totalSeconds = 0;
  remainingSeconds = readDurationFromInputs();
  updateDisplay(remainingSeconds);
  timerStatus.textContent = "Set a duration and press Start";
  completionCard.hidden = true;
  clearError();
  setControls({ running: false, paused: false });
  logActivity("Timer reset — previous async work invalidated", "sync");
});

clearLogBtn.addEventListener("click", () => {
  activityLog.innerHTML = "";
});

document.querySelectorAll(".demo-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const demo = button.dataset.demo;

    if (demo === "event-loop") demoEventLoop();
    if (demo === "callbacks") demoCallbacks();
    if (demo === "promises") demoPromises();
    if (demo === "callback-hell") demoCallbackHell();
  });
});


// Boot — show sync vs async on page load
function boot() {
  timerProgress.style.strokeDasharray = String(RING_CIRCUMFERENCE);
  remainingSeconds = readDurationFromInputs();
  updateDisplay(remainingSeconds);
  setControls({ running: false, paused: false });

  logActivity('Page loaded — synchronous boot() runs on the call stack', "sync");

  setTimeout(() => {
    logActivity("setTimeout(0) — async macrotask queued for later", "callback");
  }, 0);

  Promise.resolve().then(() => {
    logActivity("Promise microtask — runs before setTimeout(0)", "promise");
  });

  logActivity('boot() finished — but async tasks are still pending', "sync");
}

boot();