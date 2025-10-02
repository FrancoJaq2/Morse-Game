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
    // Espacio entre palabras: se representa con un "/" en el código, pero se traduce a un espacio en texto.
    ' ': '/',
    '.': '•—•—•—', ',': '——••——', '?': '••——••', '!': '—•—•——' 
    // Se han simplificado los símbolos para enfocarse en letras y números para las palabras.
};

// Reverse morse code dictionary
const reverseMorse = {};
Object.keys(morseCode).forEach(key => {
    reverseMorse[morseCode[key]] = key;
});

// Lista de palabras comunes (solo mayúsculas y sin caracteres especiales)
const COMMON_WORDS = [
    'SOS', 'CAT', 'RUN', 'DOG', 'YES', 'NO', 'HELP', 'SUN', 'MOON', 'CODE',
    'TEST', 'WIN', 'GAME', 'EAT', 'SHIP', 'AIR', 'GO', 'STOP', 'TIME', 'DATA'
];

// Game state
let currentPhase = 'reference';
let score = 0;
let level = 1;

// Variables de Puntuación Máxima
let highScore = 0; // Se inicializará con localStorage

// Decode phase variables
let decodeQuestions = [];
let currentDecodeQuestion = 0;
let decodeCorrectAnswer = '';

// Encode phase variables (mantiene caracteres individuales, es más fácil)
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

// Constantes de tiempo para Morse
const DOT_DURATION = 0.1; // Duración del 'punto' en segundos (se ha hecho un poco más lento para palabras)
const DASH_DURATION = 3 * DOT_DURATION;
const ELEMENT_GAP = DOT_DURATION; // Pausa entre puntos/rayas
const CHAR_GAP = 3 * DOT_DURATION; // Pausa entre letras
const FREQUENCY = 700; 

// Función auxiliar para generar un tono
function playTone(duration, startTime) {
    if (duration <= 0) return; // Evita tonos negativos o cero
    
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(FREQUENCY, audioCtx.currentTime);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    
    oscillator.connect(gainNode).connect(audioCtx.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

/** Convierte una palabra (string) en una secuencia de tonos Morse */
function playMorseWord(word) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    // Obtener el elemento de visualización correcto
    const morseDisplay = document.getElementById('current-morse') 
                        || document.getElementById('morse-display') 
                        || document.getElementById('challenge-morse');
    
    if (!morseDisplay) return;

    // Actualizar visualización
    const fullMorseCode = word.split('').map(char => morseCode[char.toUpperCase()]).join(' / ');
    
    morseDisplay.textContent = fullMorseCode;
    morseDisplay.classList.remove('pulse');

    let currentTime = audioCtx.currentTime;
    let totalDuration = 0;

    for (let i = 0; i < word.length; i++) {
        const char = word[i].toUpperCase();
        const morse = morseCode[char];

        if (!morse) continue; 

        // 1. Tocar el Código Morse del Carácter
        for (let j = 0; j < morse.length; j++) {
            const symbol = morse[j];
            const duration = (symbol === '•') ? DOT_DURATION : DASH_DURATION;
            
            playTone(duration, currentTime + totalDuration);
            totalDuration += duration;
            
            // Pausa entre elementos (puntos y rayas)
            if (j < morse.length - 1) {
                totalDuration += ELEMENT_GAP;
            }
        }
        
        // 2. Pausa entre Caracteres (Letras)
        if (i < word.length - 1) {
            totalDuration += CHAR_GAP;
        }
    }

    // Aplicar la animación 'pulse' por la duración total del sonido
    morseDisplay.classList.add('pulse');
    setTimeout(() => {
        morseDisplay.classList.remove('pulse');
    }, totalDuration * 1000 + 50); 
    
    // Si estamos en referencia, actualiza el carácter actual
    document.getElementById('current-playing').textContent = word.toUpperCase();
}


// Función auxiliar para el botón 'Escuchar/Ver de nuevo'
function playCurrentMorse() {
    const wordToPlay = document.getElementById('morse-display').textContent || document.getElementById('challenge-morse').textContent;
    // La lógica de Decodificación y Desafío ahora usa la palabra como texto para decodificar
    
    // Si estamos en la Fase 2 o 4 (Decodificación o Desafío)
    if (currentPhase === 'decode' || currentPhase === 'challenge') {
        let questionWord = '';
        if (currentPhase === 'decode') {
             questionWord = decodeQuestions[currentDecodeQuestion].correct;
        } else {
             questionWord = challengeCorrectAnswer;
        }
        playMorseWord(questionWord);
        return;
    }
    
    // Si estamos en la Fase 1 (Referencia)
    const refChar = document.getElementById('current-playing').textContent;
    if (refChar && refChar.length === 1) {
        playMorseWord(refChar);
    }
}


// =================================================================
// 3. ENSEÑANZAS Y UTILERÍAS
// =================================================================

/** Muestra la puntuación máxima */
function loadHighScore() {
    const storedScore = localStorage.getItem('morseMasterHighScore');
    highScore = storedScore ? parseInt(storedScore) : 0;
    document.getElementById('high-score-display').textContent = highScore;
}

/** Inicializa las explicaciones didácticas */
function initTeaching() {
    // 1. Inyectar la explicación en la fase de Referencia
    const refSection = document.getElementById('phase-reference');
    const teachingDiv = document.createElement('div');
    teachingDiv.className = 'mt-4 mb-8 p-4 bg-purple-900/50 border border-purple-700 rounded-lg';
    teachingDiv.innerHTML = `
        <h3 class="text-xl font-bold text-purple-400 mb-2">💡 Principio del Código Morse (WPM)</h3>
        <p class="text-slate-200">
            El Código Morse se basa en la unidad de tiempo del **Punto** (•). La **Raya** (—) es siempre **tres veces** la duración de un Punto.
        </p>
        <ul class="list-disc list-inside text-slate-300 mt-2">
            <li>**Punto (•):** 1 unidad de tiempo (corta).</li>
            <li>**Raya (—):** 3 unidades de tiempo (larga).</li>
            <li>**Espacio entre elementos (•—):** 1 unidad de tiempo.</li>
            <li>**Espacio entre letras (— •):** 3 unidades de tiempo.</li>
            <li>**Espacio entre palabras (• / —):** 7 unidades de tiempo.</li>
        </ul>
        <p class="text-sm text-slate-400 mt-3">
            *(Tu juego usa una velocidad estándar (WPM) para simular esto)*
        </p>
    `;
    refSection.insertBefore(teachingDiv, refSection.children[1]);

    // 2. Mostrar High Score si existe
    const scoreDiv = document.querySelector('.stats-card:last-child');
    if (scoreDiv) {
        const highScoreHTML = `
            <div class="stats-card mt-4 md:mt-0 ml-4">
                <p class="text-sm text-slate-400 uppercase">Máxima Puntuación</p>
                <p id="high-score-display" class="text-3xl font-bold text-red-400">0</p>
            </div>
        `;
        document.querySelector('.flex-wrap.justify-center').insertAdjacentHTML('beforeend', highScoreHTML);
    }
}


// =================================================================
// 4. FUNCIONES DE INICIALIZACIÓN Y TABLA DE REFERENCIA
// =================================================================

// Initialize the game
function initGame() {
    initTeaching(); // Cargar explicaciones y High Score display
    loadHighScore(); // Cargar valor de High Score
    createReferenceTable();
    showPhase('reference');
    updateScore();
}

// Create reference table (utiliza la nueva función playMorseWord)
function createReferenceTable() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const punctuation = '.,?!'; // Solo los más relevantes

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
        // Usa la nueva función de reproducción de audio
        item.onclick = () => playMorseWord(char); 
        container.appendChild(item);
    }
}

// =================================================================
// 5. GESTIÓN DE FASES Y PROGRESO (Mismas funciones, solo referencias actualizadas)
// =================================================================

function showPhase(phase) {
    // ... (Código para cambiar de fase) ...
    document.querySelectorAll('.phase-content').forEach(el => {
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.phase-btn').forEach(btn => {
        btn.className = btn.className.replace('bg-purple-600', 'bg-slate-600').replace('bg-purple-700', 'bg-slate-700');
    });
    
    document.getElementById(`phase-${phase}`).classList.remove('hidden');
    document.getElementById(`btn-${phase}`).className = document.getElementById(`btn-${phase}`).className.replace('bg-slate-600', 'bg-purple-600').replace('bg-slate-700', 'bg-purple-700');
    
    currentPhase = phase;
    
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

// Score and level management (Actualizada para manejar High Score)
function updateScore(points = 0) {
    score += points;
    level = Math.floor(score / 100) + 1;
    
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    
    // Actualizar High Score si la puntuación actual es mayor
    if (score > highScore) {
        highScore = score;
        document.getElementById('high-score-display').textContent = highScore;
        localStorage.setItem('morseMasterHighScore', highScore);
    }
}


// =================================================================
// 6. DECODE PHASE FUNCTIONS (MODIFICADA para usar PALABRAS)
// =================================================================

function initDecodePhase() {
    decodeQuestions = generateDecodeQuestions();
    currentDecodeQuestion = 0;
    showDecodeQuestion();
}

function generateDecodeQuestions() {
    const questions = [];
    
    for (let i = 0; i < 10; i++) {
        // Selecciona una palabra al azar de la lista
        const correctWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        const options = [correctWord];
        
        // Generar 3 opciones incorrectas (otras palabras)
        while (options.length < 4) {
            const wrongWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
            if (!options.includes(wrongWord)) {
                options.push(wrongWord);
            }
        }
        
        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [options[j], options[k]] = [options[k], options[j]];
        }
        
        // Usar la palabra completa para la respuesta y la reproducción
        questions.push({
            correct: correctWord,
            morse: correctWord.split('').map(c => morseCode[c]).join(' / '),
            options: options,
            correctIndex: options.indexOf(correctWord)
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
    // Muestra el código Morse para referencia (con espacios para palabras)
    document.getElementById('morse-display').textContent = question.morse; 
    
    // Reproduce el audio de la PALABRA
    playMorseWord(question.correct); 
    
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
    
    // ... (código de retroalimentación de botones y puntuación) ...
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`option-${i}`);
        btn.disabled = true;
        if (i === index) {
            btn.className += isCorrect ? ' bg-emerald-600' : ' bg-red-600';
        } else if (question.options[i] === question.correct) {
            btn.className += ' bg-emerald-600';
        }
    }
    
    const feedback = document.getElementById('decode-feedback');
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="text-emerald-400 text-xl font-semibold bounce">
                ✅ ¡Correcto! La palabra es: ${question.correct}
            </div>
        `;
        updateScore(20); // Más puntos por palabras
    } else {
        feedback.innerHTML = `
            <div class="text-red-400 text-xl font-semibold">
                ❌ Incorrecto. La palabra correcta es: ${question.correct}
            </div>
        `;
    }
    
    document.getElementById('next-decode').classList.remove('hidden');
}


// =================================================================
// 7. ENCODE PHASE FUNCTIONS (SE MANTIENE, solo actualiza showPhase)
// =================================================================

function initEncodePhase() {
    // ... (código de inicialización de codificación) ...
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
    
    // ... (código de visualización de codificación) ...
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
// 8. CHALLENGE PHASE FUNCTIONS (MODIFICADA para usar PALABRAS)
// =================================================================

function resetChallenge() {
    challengeScore = 0;
    challengeErrors = 0;
    challengeTime = 60;
    // La puntuación máxima ahora se carga desde localStorage en initGame()
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

// Genera palabras y opciones basadas en palabras comunes
function nextChallengeQuestion() {
    const correctWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
    const options = [correctWord];
    
    while (options.length < 4) {
        const wrongWord = COMMON_WORDS[Math.floor(Math.random() * COMMON_WORDS.length)];
        if (!options.includes(wrongWord)) {
            options.push(wrongWord);
        }
    }
    
    // Shuffle options
    for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
    }
    
    challengeCorrectAnswer = correctWord;
    
    // Muestra el Morse (con espacios) y reproduce el audio
    const morseDisplay = correctWord.split('').map(c => morseCode[c]).join(' / ');
    document.getElementById('challenge-morse').textContent = morseDisplay;
    
    playMorseWord(correctWord); 

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
    
    // ... (código de respuesta y puntuación) ...
    for (let i = 0; i < 4; i++) {
        document.getElementById(`challenge-option-${i}`).disabled = true;
    }
    
    if (isCorrect) {
        challengeScore++;
        document.getElementById(`challenge-option-${index}`).className += ' bg-emerald-600';
        updateScore(10); // Más puntos por desafío con palabras
    } else {
        challengeErrors++;
        document.getElementById(`challenge-option-${index}`).className += ' bg-red-600';
        for (let i = 0; i < 4; i++) {
            if (document.getElementById(`challenge-option-${i}`).textContent === challengeCorrectAnswer) {
                document.getElementById(`challenge-option-${i}`).className += ' bg-emerald-600';
                break;
            }
        }
    }
    
    updateChallengeDisplay();
    
    if (challengeErrors >= 3 || challengeTime <= 0) {
        endChallenge();
    } else {
        setTimeout(() => {
            nextChallengeQuestion();
        }, 1500);
    }
}

function endChallenge() {
    clearInterval(challengeTimer);
    
    document.getElementById('challenge-game').classList.add('hidden');
    document.getElementById('challenge-results').classList.remove('hidden');
    
    document.getElementById('final-score').textContent = challengeScore;
    
    let message = '';
    // Lógica para el mensaje de rendimiento (basado en aciertos)
    if (challengeScore >= 15) {
        message = '🏆 ¡Maestro del Código Morse en velocidad! Eres un crack.';
    } else if (challengeScore >= 10) {
        message = '🥈 ¡Muy bien! Eres un decodificador rápido.';
    } else if (challengeScore >= 5) {
        message = '🥉 ¡Buen intento! Concéntrate en el ritmo.';
    } else {
        message = '📚 Necesitas más práctica de decodificación rápida.';
    }
    
    document.getElementById('performance-message').textContent = message;
}

function restartChallenge() {
    resetChallenge();
}

// =================================================================
// 9. INICIALIZACIÓN DEL JUEGO
// =================================================================

// Initialize game on load
document.addEventListener('DOMContentLoaded', function() {
    initGame();
});