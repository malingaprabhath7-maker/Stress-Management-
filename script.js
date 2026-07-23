/* ==========================================================================
   STRESS MANAGEMENT SYSTEM — CLIENT-SIDE ENGINE
   ========================================================================== */

// --- DATA STRUCTURES & QUIZ DATA ---
const QUIZ_QUESTIONS = [
  { q: "How often do you feel overwhelmed by deadlines or backlog tickets?", options: ["Rarely/Never", "Sometimes", "Often", "Almost Always"], scores: [0, 1, 2, 3] },
  { q: "How frequently do code bugs or broken builds cause you irritability?", options: ["Rarely", "Occasionally", "Frequently", "Constantly"], scores: [0, 1, 2, 3] },
  { q: "How well are you sleeping on workdays?", options: ["Soundly (7-8 hrs)", "Fairly well", "Restless/Interrupted", "Insomnia / Severe lack"], scores: [0, 1, 2, 3] },
  { q: "How often do you work through breaks or eat lunch at your desk?", options: ["Never", "1-2 times/week", "3-4 times/week", "Every single day"], scores: [0, 1, 2, 3] },
  { q: "Do you experience physical tension (neck pain, headaches, eye strain)?", options: ["None", "Mild", "Moderate", "Severe / Daily"], scores: [0, 1, 2, 3] },
  { q: "How do you feel when context switching between meetings and coding?", options: ["Focused & Fine", "Slightly drained", "Frustrated", "Completely exhausted"], scores: [0, 1, 2, 3] },
  { q: "How often do you doubt your skills or feel imposter syndrome?", options: ["Rarely", "Sometimes", "Often", "Constantly"], scores: [0, 1, 2, 3] },
  { q: "How easily can you disconnect from work after your shift ends?", options: ["Very easily", "Needs effort", "Hard to stop thinking", "Always checking chats"], scores: [0, 1, 2, 3] },
  { q: "How would you rate your patience during technical discussions/PR reviews?", options: ["High", "Moderate", "Low", "Extremely impatient"], scores: [0, 1, 2, 3] },
  { q: "How often do you feel energized at the start of your workday?", options: ["Always", "Usually", "Seldom", "Never"], scores: [0, 1, 2, 3] }
];

let currentUser = null;
let quizCurrentIndex = 0;
let quizAnswers = [];
let gameTimerInterval = null;
let breathingInterval = null;
let currentStressLevel = "Low";

// --- INIT APP ---
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initAdvancedRelief();
});

// --- AUTHENTICATION & DIRECT QUIZ FLOW ---
function initAuth() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtns = document.querySelectorAll('.logout-trigger');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value.trim();
      currentUser = user || "User";
      
      const displayUserEl = document.getElementById('displayUsername');
      if (displayUserEl) displayUserEl.textContent = currentUser;

      startQuiz();
      showScreen('screenAssess');
    });
  }

  logoutBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentUser = null;
      stopAllTimers();
      
      const audio = document.getElementById('calmAudioPlayer');
      const video = document.getElementById('fishVideoLocal');
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      if (video) {
        video.pause();
      }

      showScreen('screenLogin');
    });
  });
}

function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('screen--active'));
  const target = document.getElementById(screenId);
  if (target) target.classList.add('screen--active');
}

// --- QUIZ ENGINE ---
function startQuiz() {
  quizCurrentIndex = 0;
  quizAnswers = [];
  renderQuizQuestion();
}

function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[quizCurrentIndex];
  const countEl = document.getElementById('quizCount');
  const textEl = document.getElementById('quizQuestionText');
  const barEl = document.getElementById('quizProgressBar');
  const optsContainer = document.getElementById('quizOptions');

  if (countEl) countEl.textContent = `Question ${quizCurrentIndex + 1} of 10`;
  if (textEl) textEl.textContent = q.q;
  if (barEl) barEl.style.width = `${((quizCurrentIndex + 1) / 10) * 100}%`;

  if (optsContainer) {
    optsContainer.innerHTML = '';
    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'btn btn--ghost quiz-option';
      btn.style.width = '100%';
      btn.style.margin = '6px 0';
      btn.style.textAlign = 'left';
      btn.textContent = optText;
      btn.onclick = () => {
        quizAnswers[quizCurrentIndex] = q.scores[i];
        if (quizCurrentIndex < 9) {
          quizCurrentIndex++;
          renderQuizQuestion();
        } else {
          finishQuiz();
        }
      };
      optsContainer.appendChild(btn);
    });
  }
}

function finishQuiz() {
  const totalScore = quizAnswers.reduce((a, b) => a + b, 0);
  let level = "Low";
  if (totalScore >= 8 && totalScore <= 15) level = "Moderate";
  else if (totalScore >= 16 && totalScore <= 22) level = "High";
  else if (totalScore >= 23) level = "Severe";

  setupMatchedGameScreen(level, totalScore);
}

// --- MATCHED GAME PREPARATION ---
function setupMatchedGameScreen(level, score) {
  showScreen('screenGameLauncher');
  currentStressLevel = level;

  const titleEl = document.getElementById('matchedGameTitle');
  const descEl = document.getElementById('matchedGameDesc');
  const gameArea = document.getElementById('activeGameContainer');
  const stressDisplay = document.getElementById('displayStressLevel');
  const timerDisplay = document.getElementById('gameTimerDisplay');
  const finishBtn = document.querySelector('#screenGameLauncher button[onclick="forceFinishGame()"]');

  stopAllTimers();

  if (stressDisplay) {
    stressDisplay.textContent = `${level.toUpperCase()} STRESS DETECTED (${score}/30)`;
  }
  if (timerDisplay) {
    timerDisplay.textContent = `Time Remaining: 03:00`;
  }

  if (finishBtn) {
    finishBtn.disabled = true;
    finishBtn.style.opacity = "0.5";
    finishBtn.style.cursor = "not-allowed";
    finishBtn.title = "Available after 2 minutes of practice";
  }

  let selectedGameName = "";

  if (level === "Low") {
    selectedGameName = "Bubble Wrap Popper";
    if (titleEl) titleEl.textContent = "🎮 " + selectedGameName;
    if (descEl) descEl.textContent = "Light tactile engagement to clear minor fatigue.";
  } else if (level === "Moderate") {
    selectedGameName = "Box Breathing Focus (4-4-4-4)";
    if (titleEl) titleEl.textContent = "🫁 " + selectedGameName;
    if (descEl) descEl.textContent = "Controlled breathing to reset nervous system arousal.";
  } else {
    selectedGameName = "Mind Sweep Task Burner";
    if (titleEl) titleEl.textContent = "🔥 " + selectedGameName;
    if (descEl) descEl.textContent = "Unload cognitive clutter and stressful thoughts.";
  }

  if (gameArea) {
    gameArea.innerHTML = `
      <div style="margin: 20px 0;">
        <button id="startSessionBtn" class="btn btn--primary" style="font-size: 1.1rem; padding: 12px 24px;" onclick="startActivitySession()">
          ▶ Start 3-Minute Session
        </button>
      </div>
    `;
  }
}

// --- START ACTIVITY SESSION ---
function startActivitySession() {
  const gameArea = document.getElementById('activeGameContainer');

  if (currentStressLevel === "Low") {
    if (gameArea) {
      gameArea.innerHTML = `<button class="btn btn--primary" onclick="popBubble()">Pop Bubble</button> <div id="bubbleScore" style="margin-top:15px; font-weight:bold; font-size:1.1rem;">Popped: 0</div>`;
    }
  } else if (currentStressLevel === "Moderate") {
    if (gameArea) {
      gameArea.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 15px 0;">
          <div class="breathe-circle" id="breatheBall" style="
            width: 140px; 
            height: 140px; 
            border-radius: 50%; 
            border: 2px solid var(--sage, #10b981); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 1.3rem; 
            font-weight: bold; 
            color: #ffffff;
            box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
            transition: all 0.5s ease;">
            INHALE
          </div>
          
          <div style="margin-top: 15px; font-size: 0.85rem; color: #a1a1aa; background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 20px;">
            💡 <strong>Guide:</strong> Inhale 4s ➔ Hold 4s ➔ Exhale 4s ➔ Rest 4s
          </div>
        </div>`;
    }
    startBreathingGuide();
  } else {
    if (gameArea) {
      gameArea.innerHTML = `
        <textarea id="sweepInput" rows="3" style="width:100%; padding:10px; border-radius:8px; background:rgba(0,0,0,0.3); color:#fff; border:1px solid rgba(255,255,255,0.2);" placeholder="Type what is stressing you out..."></textarea>
        <br>
        <button class="btn btn--primary" style="margin-top:10px;" onclick="burnTask()">Burn & Clear Thought</button>`;
    }
  }

  start3MinTimer(180);
}

function start3MinTimer(seconds) {
  let timeLeft = seconds;
  const timerDisplay = document.getElementById('gameTimerDisplay');
  const finishBtn = document.querySelector('#screenGameLauncher button[onclick="forceFinishGame()"]');
  
  if (gameTimerInterval) clearInterval(gameTimerInterval);

  gameTimerInterval = setInterval(() => {
    let mins = Math.floor(timeLeft / 60);
    let secs = timeLeft % 60;
    if (timerDisplay) {
      timerDisplay.textContent = `Time Remaining: 0${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    if (timeLeft <= 60 && finishBtn && finishBtn.disabled) {
      finishBtn.disabled = false;
      finishBtn.style.opacity = "1";
      finishBtn.style.cursor = "pointer";
      finishBtn.title = "Finish session early";
    }

    if (timeLeft <= 0) {
      stopAllTimers();
      showPostGameVerificationModal();
    }
    timeLeft--;
  }, 1000);
}

function forceFinishGame() {
  const finishBtn = document.querySelector('#screenGameLauncher button[onclick="forceFinishGame()"]');
  if (finishBtn && finishBtn.disabled) return;

  stopAllTimers();
  showPostGameVerificationModal();
}

function stopAllTimers() {
  if (gameTimerInterval) clearInterval(gameTimerInterval);
  if (breathingInterval) clearInterval(breathingInterval);
}

// --- POST-GAME VERIFICATION ---
function showPostGameVerificationModal() {
  const modal = document.getElementById('verificationModal');
  if (modal) modal.hidden = false;
}

function handleUserBelief(userBelieves) {
  const modal = document.getElementById('verificationModal');
  if (modal) modal.hidden = true;

  if (userBelieves) {
    showScreen('screenSuccessExit');
  } else {
    showScreen('screenAdvancedRelief');
  }
}

// --- ADVANCED RELIEF ENGINE (AUDIO & VIDEO SWITCHING) ---
function initAdvancedRelief() {
  const audio = document.getElementById('calmAudioPlayer');
  const playBtn = document.getElementById('toggleSoundBtn');
  const soundSelect = document.getElementById('soundSelect');

  if (!audio) return;

  if (soundSelect) {
    soundSelect.addEventListener('change', () => {
      const wasPlaying = !audio.paused;
      audio.src = soundSelect.value;
      audio.load();

      if (wasPlaying) {
        audio.play().catch(err => console.error("Audio change play error:", err));
      }
    });
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (!audio.src || audio.src === "" || audio.src.endsWith('/')) {
        audio.src = soundSelect ? soundSelect.value : "assets/sounds/aquarium.mpeg";
      }

      if (audio.paused) {
        audio.play().then(() => {
          playBtn.textContent = "🔇 Pause Sound";
        }).catch(err => {
          console.error("Audio playback error:", err);
          alert("Audio Play Error!\n\n1. Please check if your audio files are inside 'assets/sounds/' folder.\n2. Ensure file extensions match HTML exactly.");
        });
      } else {
        audio.pause();
        playBtn.textContent = "🔊 Play Selected Sound";
      }
    });
  }
}

// Audio සහ Video Mode මාරු කිරීම සඳහා
function switchReliefMode(mode) {
  const audioContainer = document.getElementById('audioModeContainer');
  const videoContainer = document.getElementById('videoModeContainer');
  const modeAudioBtn = document.getElementById('modeAudioBtn');
  const modeVideoBtn = document.getElementById('modeVideoBtn');
  const audio = document.getElementById('calmAudioPlayer');
  const video = document.getElementById('fishVideoLocal');

  if (mode === 'audio') {
    if (audioContainer) audioContainer.style.display = 'flex';
    if (videoContainer) videoContainer.style.display = 'none';
    if (modeAudioBtn) modeAudioBtn.className = 'btn btn--primary';
    if (modeVideoBtn) modeVideoBtn.className = 'btn btn--ghost';

    if (video) video.pause();
  } else {
    if (audioContainer) audioContainer.style.display = 'none';
    if (videoContainer) videoContainer.style.display = 'block';
    if (modeVideoBtn) modeVideoBtn.className = 'btn btn--primary';
    if (modeAudioBtn) modeAudioBtn.className = 'btn btn--ghost';

    if (audio && !audio.paused) {
      audio.pause();
      const playBtn = document.getElementById('toggleSoundBtn');
      if (playBtn) playBtn.textContent = "🔊 Play Selected Sound";
    }

    if (video) {
      video.muted = true; // Autoplay policy නිසා අත්‍යවශ්‍යයි
      video.play().catch(err => console.log("Video autoplay blocked or error:", err));
    }
  }
}

// Advanced Feedback Handler (Good, Try Again, Exit Now)
function submitAdvancedFeedback(type) {
  const msgEl = document.getElementById('feedbackResponseMsg');
  const audio = document.getElementById('calmAudioPlayer');
  const video = document.getElementById('fishVideoLocal');

  if (audio) audio.pause();
  if (video) video.pause();

  if (msgEl) {
    msgEl.style.display = 'block';
    
    if (type === 'good') {
      msgEl.style.color = "var(--sage, #10b981)";
      msgEl.innerHTML = "🎉 Excellent! Taking you to the success screen...";
      setTimeout(() => {
        showScreen('screenSuccessExit');
      }, 1500);
    } 
    else if (type === 'bad_try') {
      msgEl.style.color = "var(--amber, #f59e0b)";
      msgEl.innerHTML = "🔄 Restarting your session. Let's try again from the beginning!";
      setTimeout(() => {
        msgEl.style.display = 'none';
        startQuiz();
        showScreen('screenAssess');
      }, 2000);
    } 
    else if (type === 'bad_exit') {
      msgEl.style.color = "#ef4444";
      msgEl.innerHTML = "👋 Exiting system. Take a deep breath and have a safe day!";
      setTimeout(() => {
        currentUser = null;
        stopAllTimers();
        showScreen('screenLogin');
      }, 2000);
    }
  }
}

// --- HELPERS ---
let popCount = 0;
function popBubble() {
  popCount++;
  const scoreEl = document.getElementById('bubbleScore');
  if (scoreEl) scoreEl.textContent = `Popped: ${popCount}`;
}

function burnTask() {
  const input = document.getElementById('sweepInput');
  if (input) {
    input.value = "";
    alert("Thought cleared and burned successfully!");
  }
}

function startBreathingGuide() {
  const ball = document.getElementById('breatheBall');
  let state = 0;
  if (breathingInterval) clearInterval(breathingInterval);
  
  const states = ["INHALE", "HOLD", "EXHALE", "REST"];
  if (ball) ball.textContent = states[0];

  breathingInterval = setInterval(() => {
    if (!ball) return;
    state = (state + 1) % 4;
    ball.textContent = states[state];
  }, 4000);
}