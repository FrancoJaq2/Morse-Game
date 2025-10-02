// =================================================================
// 1. DICCIONARIOS Y ESTADO DEL JUEGO
// =================================================================

// Morse Code Dictionary
const morseCode = {
    'A': '•—', 'B': '—•••', 'C': '—•—•', 'D': '—••', 'E': '•', 'F': '••—•',
    'G': '——•', 'H': '••••', 'I': '••', 'J': '•———', 'K': '—•—', 'L': '•—••',
    'M': '——', 'N': '—•', 'O': '———', 'P': '•——•', 'Q': '——•—', 'R': '•—•',
    'S': '•••', 'T': '—', 'U': '••—', 'V': '•••—', 'W': '•——', 'X': '—••—',
    'Y': '—•——', 'Z': '——••',
    '0': '—————', '1': '•————', '2': '••———', '3': '•••——', '4': '••••—',
    '5': '•••••', '6': '—••••', '7': '——•••', '8': '———••', '9': '————•',
    '.': '•—•—•—', ',': '——••——', '?': '••——••', "'": '•————•',
    '!': '—•—•——', '/': '—••—•', '(': '—•——•', ')': '—•——•—',
    '&': '•—•••', ':': '———•••', ';': '—•—•—•', '=': '—•••—',
    '+': '•—•—•', '-': '—••••—', '_': '••——•—', '"': '•—••—•',
    '$': '•••—••—', '@': '•——•—•'
};

// Reverse morse code dictionary
const reverseMorse = {};
Object.keys(morseCode).forEach(key => {
    reverseMorse[morseCode[key]] = key;
});

// Game state
let currentPhase = 'reference';
let score = 0;
let level = 1;
let currentAudio = null;

// Decode phase variables
let decodeQuestions = [];
let currentDecodeQuestion = 0;
let decodeCorrectAnswer = '';

// Encode phase variables
let encodeQuestions = [];
let currentEncodeQuestion = 0;
let userMorseInput = '';
let encodeCorrectAnswer = '';

// Challenge phase variables
let challengeScore = 0;
let challengeErrors = 0;
let challengeTime = 60;
let challengeTimer = null;
let challengeCorrectAnswer = '';


// =================================================================
// 2. FUNCIONES DE AUDIO MORSE REAL (Web Audio API)
// =================================================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Constantes de tiempo para Morse (WPM - Words Per Minute)
const DOT_DURATION = 0.05; // Duración del 'punto' en segundos
const DASH_DURATION = 3 * DOT_DURATION; // Duración de la 'raya'
const ELEMENT_GAP = DOT_DURATION; // Pausa entre puntos/rayas
const FREQUENCY = 700; // Frecuencia del tono (700 Hz)

// Función auxiliar para generar un tono
function playTone(duration, startTime) {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(FREQUENCY, audioCtx.currentTime);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    
    oscillator.connect(gainNode).connect(audioCtx.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

// Función principal para reproducir Código Morse
function playMorse(char) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const morse = morseCode[char.toUpperCase()];
    if (!morse) return;
    
    // 1. Actualización visual para la fase de Referencia
    document.getElementById('current-playing').textContent = char.toUpperCase();
    const morseDisplay = document.getElementById('current-morse') || document.getElementById('morse-display') || document.getElementById('challenge-morse');
    
    if (morseDisplay) {
        morseDisplay.textContent = morse;
        morseDisplay.classList.remove('pulse');
    }
    
    let currentTime = audioCtx.currentTime;
    let totalDuration = 0;
    
    for (let i = 0; i < morse.length; i++) {
        const symbol = morse[i];
        let duration = (symbol === '•') ? DOT_DURATION : DASH_DURATION;
        
        // Reproducir el tono
        playTone(duration, currentTime + totalDuration);
        totalDuration += duration;
        
        // Añadir el espacio entre elementos
        if (i < morse.length - 1) {
            totalDuration += ELEMENT_GAP;
        }
    }
    
    // 2. Aplicar la animación 'pulse' por la duración total del sonido
    if (morseDisplay) {
        morseDisplay.classList.add('pulse');
        setTimeout(() => {
            morseDisplay.classList.remove('pulse');
        }, totalDuration * 1000 + 50);
    }
}

// Función auxiliar para el botón 'Escuchar/Ver de nuevo'
function playCurrentMorse() {
    const morseDisplay = document.getElementById('morse-display') || document.getElementById('challenge-morse');
    if (!morseDisplay) return;

    const morseCodeString = morseDisplay.textContent;
    const char = reverseMorse[morseCodeString];

    if (char) {
        playMorse(char);
    } 
    // Si char es undefined, el código no está en el diccionario (ej: si es una palabra o frase).
    // Para simplificar, solo reproducimos si es un solo caracter.
}


// =================================================================
// 3. FUNCIONES DE INICIALIZACIÓN Y TABLA DE REFERENCIA
// =================================================================

// Initialize the game
function initGame() {
    createReferenceTable();
    showPhase('reference');
    updateScore();
}

// Create reference table
function createReferenceTable() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const punctuation = '.,?\'!/()&:;=+-_"$@';

    createMorseGrid('letters-grid', letters);
    createMorseGrid('numbers-grid', numbers);
    createMorseGrid('punctuation-grid', punctuation);
}

function createMorseGrid(containerId, chars) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let char of chars) {
        const item = document.createElement('div');
        item.className = 'morse-item bg-slate-700 hover:bg-slate-600 p-3 rounded-lg cursor-pointer transition-all duration-300 flex justify-between items-center';
        item.innerHTML = `
            <span class="font-bold text-lg">${char}</span>
            <span class="font-mono text-emerald-400">${morseCode[char] || '—'}</span>
        `;
        item.onclick = () => playMorse(char);
        container.appendChild(item);
    }
}


// =================================================================
// 4. GESTIÓN DE FASES Y PROGRESO
// =================================================================

function showPhase(phase) {
    // Hide all phases
    document.querySelectorAll('.phase-content').forEach(el => {
        el.classList.add('hidden');
    });
    
    // Update button states
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.className = btn.className.replace('bg-purple-600', 'bg-slate-600').replace('bg-purple-700', 'bg-slate-700');
    });
    
    // Show selected phase
    document.getElementById(`phase-${phase}`).classList.remove('hidden');
    document.getElementById(`btn-${phase}`).className = document.getElementById(`btn-${phase}`).className.replace('bg-slate-600', 'bg-purple-600').replace('bg-slate-700', 'bg-purple-700');
    
    currentPhase = phase;
    
    // Initialize phase-specific content
    if (phase === 'decode') {
        initDecodePhase();
    } else if (phase === 'encode') {
        initEncodePhase();
    } else if (phase === 'challenge') {
        resetChallenge();
    }
    
    updateProgress();
}

function updateProgress() {
    const phases = ['reference', 'decode', 'encode', 'challenge'];
    const currentIndex = phases.indexOf(currentPhase);
    const progress = ((currentIndex + 1) / phases.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
}

// Score and level management
function updateScore(points = 0) {
    score += points;
    level = Math.floor(score / 100) + 1;
    
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
}


// =================================================================
// 5. DECODE PHASE FUNCTIONS
// =================================================================

function initDecodePhase() {
    decodeQuestions = generateDecodeQuestions();
    currentDecodeQuestion = 0;
    showDecodeQuestion();
}

function generateDecodeQuestions() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const questions = [];
    
    for (let i = 0; i < 10; i++) {
        const correctChar = chars[Math.floor(Math.random() * chars.length)];
        const options = [correctChar];
        
        // Generate 3 wrong options
        while (options.length < 4) {
            const wrongChar = chars[Math.floor(Math.random() * chars.length)];
            if (!options.includes(wrongChar)) {
                options.push(wrongChar);
            }
        }
        
        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [options[j], options[k]] = [options[k], options[j]];
        }
        
        questions.push({
            correct: correctChar,
            morse: morseCode[correctChar],
            options: options,
            correctIndex: options.indexOf(correctChar)
        });
    }
    
    return questions;
}

function showDecodeQuestion() {
    if (currentDecodeQuestion >= decodeQuestions.length) {
        showPhase('encode');
        return;
    }
    
    const question = decodeQuestions[currentDecodeQuestion];
    decodeCorrectAnswer = question.correct;
    
    document.getElementById('decode-question-num').textContent = currentDecodeQuestion + 1;
    document.getElementById('morse-display').textContent = question.morse;
    
    // Reproduce el audio al mostrar la pregunta
    playMorse(question.correct); 
    
    // Update options
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`option-${i}`);
        btn.textContent = question.options[i];
        btn.className = 'option-btn bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-all duration-300 text-xl font-semibold';
        btn.disabled = false;
    }
    
    document.getElementById('decode-feedback').innerHTML = '';
    document.getElementById('next-decode').classList.add('hidden');
}

function selectAnswer(index) {
    const question = decodeQuestions[currentDecodeQuestion];
    const selectedAnswer = question.options[index];
    const isCorrect = selectedAnswer === question.correct;
    
    // Disable all options
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`option-${i}`);
        btn.disabled = true;
        if (i === index) {
            btn.className += isCorrect ? ' bg-emerald-600' : ' bg-red-600';
        } else if (question.options[i] === question.correct) {
            btn.className += ' bg-emerald-600';
        }
    }
    
    // Show feedback
    const feedback = document.getElementById('decode-feedback');
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="text-emerald-400 text-xl font-semibold bounce">
                ✅ ¡Correcto! ${question.correct} = ${question.morse}
            </div>
        `;
        updateScore(10);
    } else {
        feedback.innerHTML = `
            <div class="text-red-400 text-xl font-semibold">
                ❌ Incorrecto. La respuesta correcta es ${question.correct} = ${question.morse}
            </div>
        `;
    }
    
    document.getElementById('next-decode').classList.remove('hidden');
}

function nextDecodeQuestion() {
    currentDecodeQuestion++;
    showDecodeQuestion();
}


// =================================================================
// 6. ENCODE PHASE FUNCTIONS
// =================================================================

function initEncodePhase() {
    encodeQuestions = generateEncodeQuestions();
    currentEncodeQuestion = 0;
    userMorseInput = '';
    showEncodeQuestion();
}

function generateEncodeQuestions() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const questions = [];
    
    for (let i = 0; i < 10; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        questions.push({
            char: char,
            morse: morseCode[char]
        });
    }
    
    return questions;
}

function showEncodeQuestion() {
    if (currentEncodeQuestion >= encodeQuestions.length) {
        showPhase('challenge');
        return;
    }
    
    const question = encodeQuestions[currentEncodeQuestion];
    encodeCorrectAnswer = question.morse;
    
    document.getElementById('encode-question-num').textContent = currentEncodeQuestion + 1;
    document.getElementById('char-display').textContent = question.char;
    document.getElementById('user-morse').textContent = userMorseInput || 'Ingresa el código...';
    document.getElementById('encode-feedback').innerHTML = '';
    document.getElementById('next-encode').classList.add('hidden');
}

function addDot() {
    userMorseInput += '•';
    document.getElementById('user-morse').textContent = userMorseInput;
}

function addDash() {
    userMorseInput += '—';
    document.getElementById('user-morse').textContent = userMorseInput;
}

function clearMorse() {
    userMorseInput = '';
    document.getElementById('user-morse').textContent = 'Ingresa el código...';
}

function checkEncode() {
    const isCorrect = userMorseInput === encodeCorrectAnswer;
    const feedback = document.getElementById('encode-feedback');
    
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="text-emerald-400 text-xl font-semibold bounce">
                ✅ ¡Perfecto! ${encodeQuestions[currentEncodeQuestion].char} = ${encodeCorrectAnswer}
            </div>
        `;
        updateScore(15);
    } else {
        feedback.innerHTML = `
            <div class="text-red-400 text-xl font-semibold">
                ❌ Incorrecto. La respuesta correcta es: ${encodeCorrectAnswer}
            </div>
        `;
    }
    
    document.getElementById('next-encode').classList.remove('hidden');
}

function nextEncodeQuestion() {
    currentEncodeQuestion++;
    userMorseInput = '';
    showEncodeQuestion();
}


// =================================================================
// 7. CHALLENGE PHASE FUNCTIONS
// =================================================================

function resetChallenge() {
    challengeScore = 0;
    challengeErrors = 0;
    challengeTime = 60;
    document.getElementById('challenge-setup').classList.remove('hidden');
    document.getElementById('challenge-game').classList.add('hidden');
    document.getElementById('challenge-results').classList.add('hidden');
    updateChallengeDisplay();
}

function startChallenge() {
    challengeScore = 0;
    challengeErrors = 0;
    challengeTime = 60;
    
    document.getElementById('challenge-setup').classList.add('hidden');
    document.getElementById('challenge-game').classList.remove('hidden');
    
    startChallengeTimer();
    nextChallengeQuestion();
}

function startChallengeTimer() {
    challengeTimer = setInterval(() => {
        challengeTime--;
        document.getElementById('challenge-time').textContent = challengeTime;
        
        if (challengeTime <= 0 || challengeErrors >= 3) {
            endChallenge();
        }
    }, 1000);
}

function nextChallengeQuestion() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const correctChar = chars[Math.floor(Math.random() * chars.length)];
    const options = [correctChar];
    
    // Generate 3 wrong options
    while (options.length < 4) {
        const wrongChar = chars[Math.floor(Math.random() * chars.length)];
            if (!options.includes(wrongChar)) {
            options.push(wrongChar);
        }
    }
    
    // Shuffle options
    for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
    }
    
    challengeCorrectAnswer = correctChar;
    
    document.getElementById('challenge-morse').textContent = morseCode[correctChar];
    
    // Reproduce el audio al mostrar la pregunta
    playMorse(correctChar); 

    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`challenge-option-${i}`);
        btn.textContent = options[i];
        btn.className = 'challenge-option bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-all duration-300 text-xl font-semibold';
        btn.disabled = false;
    }
}

function challengeAnswer(index) {
    const selectedAnswer = document.getElementById(`challenge-option-${index}`).textContent;
    const isCorrect = selectedAnswer === challengeCorrectAnswer;
    
    // Disable all options temporarily
    for (let i = 0; i < 4; i++) {
        document.getElementById(`challenge-option-${i}`).disabled = true;
    }
    
    if (isCorrect) {
        challengeScore++;
        document.getElementById(`challenge-option-${index}`).className += ' bg-emerald-600';
        updateScore(5);
    } else {
        challengeErrors++;
        document.getElementById(`challenge-option-${index}`).className += ' bg-red-600';
        // Highlight correct answer
        for (let i = 0; i < 4; i++) {
            if (document.getElementById(`challenge-option-${i}`).textContent === challengeCorrectAnswer) {
                document.getElementById(`challenge-option-${i}`).className += ' bg-emerald-600';
                break;
            }
        }
    }
    
    updateChallengeDisplay();
    
    // Check if game should end
    if (challengeErrors >= 3 || challengeTime <= 0) {
        endChallenge();
    } else {
        setTimeout(() => {
            nextChallengeQuestion();
        }, 1500);
    }
}

function updateChallengeDisplay() {
    document.getElementById('challenge-score').textContent = challengeScore;
    document.getElementById('challenge-errors').textContent = challengeErrors;
}

function endChallenge() {
    clearInterval(challengeTimer);
    
    document.getElementById('challenge-game').classList.add('hidden');
    document.getElementById('challenge-results').classList.remove('hidden');
    
    document.getElementById('final-score').textContent = challengeScore;
    
    let message = '';
    if (challengeScore >= 20) {
        message = '🏆 ¡Maestro del Morse! Excelente trabajo.';
    } else if (challengeScore >= 15) {
        message = '🥈 ¡Muy bien! Tienes buen dominio del código.';
    } else if (challengeScore >= 10) {
        message = '🥉 ¡Buen intento! Sigue practicando.';
    } else {
        message = '📚 Necesitas más práctica. ¡No te rindas!';
    }
    
    document.getElementById('performance-message').textContent = message;
    updateScore(challengeScore * 2);
}

function restartChallenge() {
    resetChallenge();
}

// =================================================================
// 8. INICIALIZACIÓN DEL JUEGO
// =================================================================

// Initialize game on load
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});