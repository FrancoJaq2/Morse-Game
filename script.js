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
    ' ': '/',
    '.': '•—•—•—', ',': '——••——', '?': '••——••', '!': '—•—•——'
};

// --- Listas de Palabras por Idioma (NUEVO) ---
const COMMON_WORDS_ES = [
    'SOS', 'HOLA', 'CASA', 'SOL', 'MAR', 'AIRE', 'NADA', 'FIN', 'UNO', 'DOS', 
    'TRES', 'VIZ', 'LUZ', 'RIO', 'DIA', 'NOCHE', 'FRIO', 'CLAVE', 'GOL', 'SI'
];
const COMMON_WORDS_EN = [
    'SOS', 'CAT', 'RUN', 'DOG', 'YES', 'NO', 'HELP', 'SUN', 'MOON', 'CODE',
    'TEST', 'WIN', 'GAME', 'EAT', 'SHIP', 'AIR', 'GO', 'STOP', 'TIME', 'DATA'
];
const LANGUAGE_PACKS = {
    'ES': { words: COMMON_WORDS_ES, name: 'Español' },
    'EN': { words: COMMON_WORDS_EN, name: 'Inglés' }
};

// Game state and configuration (NUEVO)
let currentPhase = 'reference';
let score = 0;
let level = 1;
let highScore = 0;

let gameMode = 'WORDS'; // Opciones: 'LETTERS', 'WORDS'
let gameLanguage = 'ES'; // Opciones: 'ES', 'EN'

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
// (El código de audio se mantiene igual)
// =================================================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

// Constantes de tiempo para Morse
const DOT_DURATION = 0.1; 
const DASH_DURATION = 3 * DOT_DURATION;
const ELEMENT_GAP = DOT_DURATION; 
const CHAR_GAP = 3 * DOT_DURATION; 
const FREQUENCY = 700; 

function playTone(duration, startTime) {
    if (duration <= 0) return;
    
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(FREQUENCY, audioCtx.currentTime);
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    
    oscillator.connect(gainNode).connect(audioCtx.destination);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}

function playMorseWord(word) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    
    const morseDisplay = document.getElementById('current-morse') 
                        || document.getElementById('morse-display') 
                        || document.getElementById('challenge-morse');
    
    if (!morseDisplay) return;

    const fullMorseCode = word.split('').map(char => morseCode[char.toUpperCase()]).join(' / ');
    
    morseDisplay.textContent = fullMorseCode;
    morseDisplay.classList.remove('pulse');

    let currentTime = audioCtx.currentTime;
    let totalDuration = 0;

    for (let i = 0; i < word.length; i++) {
        const char = word[i].toUpperCase();
        const morse = morseCode[char];

        if (!morse) continue; 

        for (let j = 0; j < morse.length; j++) {
            const symbol = morse[j];
            const duration = (symbol === '•') ? DOT_DURATION : DASH_DURATION;
            
            playTone(duration, currentTime + totalDuration);
            totalDuration += duration;
            
            if (j < morse.length - 1) {
                totalDuration += ELEMENT_GAP;
            }
        }
        
        if (i < word.length - 1) {
            totalDuration += CHAR_GAP;
        }
    }

    morseDisplay.classList.add('pulse');
    setTimeout(() => {
        morseDisplay.classList.remove('pulse');
    }, totalDuration * 1000 + 50); 
    
    document.getElementById('current-playing').textContent = word.toUpperCase();
}

function playCurrentMorse() {
    // Si estamos en Decodificación o Desafío, obtenemos la palabra de la respuesta correcta.
    if (currentPhase === 'decode') {
         playMorseWord(decodeCorrectAnswer);
         return;
    }
    if (currentPhase === 'challenge') {
         playMorseWord(challengeCorrectAnswer);
         return;
    }
    
    // Si estamos en Referencia
    const refChar = document.getElementById('current-playing').textContent;
    if (refChar) {
        playMorseWord(refChar);
    }
}


// =================================================================
// 3. ENSEÑANZAS Y UTILERÍAS (Incluye lógica de configuración)
// =================================================================

// --- NUEVAS FUNCIONES DE CONFIGURACIÓN ---
function setGameMode(mode) {
    gameMode = mode;
    // Reinicia la fase actual si el usuario está jugando para aplicar el cambio.
    if (currentPhase === 'decode') {
        initDecodePhase();
    }
}

function setGameLanguage(lang) {
    gameLanguage = lang;
    if (currentPhase === 'decode' || currentPhase === 'challenge') {
        showPhase(currentPhase); 
    }
}

function loadHighScore() {
    const storedScore = localStorage.getItem('morseMasterHighScore');
    highScore = storedScore ? parseInt(storedScore) : 0;
    
    // Verifica si el display de high score existe antes de actualizarlo.
    const highScoreDisplay = document.getElementById('high-score-display');
    if (highScoreDisplay) {
        highScoreDisplay.textContent = highScore;
    }
}

function initTeaching() {
    // 1. Inyectar la explicación en la fase de Referencia
    const refSection = document.getElementById('phase-reference');
    // ... (El código de inyección de la explicación didáctica se queda igual) ...
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
    // Asegurarse de que el div de enseñanza se inserta después de los selectores de idioma
    const configDiv = document.querySelector('#phase-reference > div.mb-8.p-4.bg-purple-900\\/50.rounded-lg');
    if (configDiv) {
        refSection.insertBefore(teachingDiv, configDiv.nextSibling);
    } else {
        refSection.insertBefore(teachingDiv, refSection.children[0]);
    }


    // 2. Mostrar High Score si existe (Se mantiene la inyección del HTML del High Score)
    const scoreContainer = document.querySelector('.flex-wrap.justify-center');
    const existingHighScore = document.getElementById('high-score-display');
    
    if (scoreContainer && !existingHighScore) {
        const highScoreHTML = `
            <div class="stats-card mt-4 md:mt-0 ml-4 bg-slate-700 p-4 rounded-lg">
                <p class="text-sm text-slate-400 uppercase">Máxima Puntuación</p>
                <p id="high-score-display" class="text-3xl font-bold text-red-400">0</p>
            </div>
        `;
        scoreContainer.insertAdjacentHTML('beforeend', highScoreHTML);
    }
}

// --- FUNCIÓN PARA EL ABECEDARIO EN ORDEN (NUEVA) ---

function createAlphabetOrderGrid() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const container = document.getElementById('alphabet-order-grid');
    container.innerHTML = '';
    
    for (let char of chars) {
        const item = document.createElement('div');
        item.className = 'morse-item bg-slate-800 p-3 rounded-lg text-center cursor-pointer hover:bg-slate-600 transition';
        item.innerHTML = `
            <span class="font-bold text-lg block">${char}</span>
            <span class="font-mono text-purple-400 text-sm">${morseCode[char] || ''}</span>
        `;
        item.onclick = () => playMorseWord(char);
        container.appendChild(item);
    }
}

function showAlphabetOrder() {
    const container = document.getElementById('alphabet-order-container');
    if (container.classList.contains('hidden')) {
        createAlphabetOrderGrid();
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
}


// =================================================================
// 4. FUNCIONES DE INICIALIZACIÓN Y TABLA DE REFERENCIA
// =================================================================

function initGame() {
    initTeaching(); 
    loadHighScore(); 
    createReferenceTable();
    showPhase('reference');
    updateScore();
    
    // Configura los selectores al iniciar
    document.getElementById('mode-select').value = gameMode;
    document.getElementById('language-select').value = gameLanguage;
}

// Create reference table (utiliza la nueva función playMorseWord)
function createReferenceTable() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const punctuation = '.,?!'; 

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
        item.onclick = () => playMorseWord(char); 
        container.appendChild(item);
    }
}

// ... (El resto de las funciones showPhase, updateProgress, updateScore se mantienen igual) ...

function showPhase(phase) {
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

function updateScore(points = 0) {
    score += points;
    level = Math.floor(score / 100) + 1;
    
    document.getElementById('score').textContent = score;
    document.getElementById('level').textContent = level;
    
    if (score > highScore) {
        highScore = score;
        const highScoreDisplay = document.getElementById('high-score-display');
        if(highScoreDisplay) {
             highScoreDisplay.textContent = highScore;
        }
        localStorage.setItem('morseMasterHighScore', highScore);
    }
}


// =================================================================
// 5. DECODE PHASE FUNCTIONS (MODIFICADA: Lógica de Letras/Palabras)
// =================================================================

function initDecodePhase() {
    decodeQuestions = generateDecodeQuestions();
    currentDecodeQuestion = 0;
    showDecodeQuestion();
}

function generateDecodeQuestions() {
    const questions = [];
    let wordList = LANGUAGE_PACKS[gameLanguage].words;

    for (let i = 0; i < 10; i++) {
        let correctContent;
        let options = [];
        let sourceList;
        
        // 1. Decidir la fuente de contenido (Letras o Palabras)
        if (gameMode === 'LETTERS') {
            sourceList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        } else { // 'WORDS'
            sourceList = wordList;
        }

        // 2. Seleccionar la respuesta correcta y las opciones
        if (gameMode === 'LETTERS') {
            correctContent = sourceList[Math.floor(Math.random() * sourceList.length)];
            options.push(correctContent);
            
            while (options.length < 4) {
                const wrongChar = sourceList[Math.floor(Math.random() * sourceList.length)];
                if (!options.includes(wrongChar)) {
                    options.push(wrongChar);
                }
            }
        } else { // 'WORDS'
            correctContent = sourceList[Math.floor(Math.random() * sourceList.length)];
            options.push(correctContent);
            
            while (options.length < 4) {
                const wrongWord = sourceList[Math.floor(Math.random() * sourceList.length)];
                if (!options.includes(wrongWord)) {
                    options.push(wrongWord);
                }
            }
        }

        // 3. Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [options[j], options[k]] = [options[k], options[j]];
        }
        
        // 4. Crear la pregunta
        const morseRepresentation = correctContent.split('').map(c => morseCode[c]).join(' / ');

        questions.push({
            correct: correctContent,
            morse: morseRepresentation,
            options: options,
            correctIndex: options.indexOf(correctContent)
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
    
    document.getElementById('decode-question-num').textContent = `Pregunta ${currentDecodeQuestion + 1} de ${decodeQuestions.length}`;
    document.getElementById('morse-display').textContent = question.morse; 
    
    playMorseWord(question.correct); 
    
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
    const points = gameMode === 'WORDS' ? 20 : 10;
    
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="text-emerald-400 text-xl font-semibold bounce">
                ✅ ¡Correcto! ${gameMode === 'WORDS' ? 'La palabra es' : 'La letra es'}: ${question.correct}
            </div>
        `;
        updateScore(points);
    } else {
        feedback.innerHTML = `
            <div class="text-red-400 text-xl font-semibold">
                ❌ Incorrecto. La respuesta correcta es: ${question.correct}
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
// 6. ENCODE PHASE FUNCTIONS (Se mantiene, usa caracteres individuales)
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
    
    document.getElementById('encode-question-num').textContent = `Pregunta ${currentEncodeQuestion + 1} de ${encodeQuestions.length}`;
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
// 7. CHALLENGE PHASE FUNCTIONS (MODIFICADA: usa idioma seleccionado)
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

// Función auxiliar para el timer (se mantiene igual)
function startChallengeTimer() {
    clearInterval(challengeTimer);
    challengeTimer = setInterval(() => {
        challengeTime--;
        updateChallengeDisplay();
        if (challengeTime <= 0) {
            endChallenge();
        }
    }, 1000);
}

function updateChallengeDisplay() {
    document.getElementById('challenge-time').textContent = challengeTime;
    document.getElementById('challenge-score').textContent = challengeScore;
    document.getElementById('challenge-errors').textContent = `${challengeErrors} / 3`;
}

function nextChallengeQuestion() {
    const wordList = LANGUAGE_PACKS[gameLanguage].words;
    
    const correctWord = wordList[Math.floor(Math.random() * wordList.length)];
    const options = [correctWord];
    
    while (options.length < 4) {
        const wrongWord = wordList[Math.floor(Math.random() * wordList.length)];
        if (!options.includes(wrongWord)) {
            options.push(wrongWord);
        }
    }
    
    for (let j = options.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [options[j], options[k]] = [options[k], options[j]];
    }
    
    challengeCorrectAnswer = correctWord;
    
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
    
    for (let i = 0; i < 4; i++) {
        document.getElementById(`challenge-option-${i}`).disabled = true;
    }
    
    if (isCorrect) {
        challengeScore++;
        document.getElementById(`challenge-option-${index}`).className += ' bg-emerald-600';
        updateScore(10); 
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
// 8. INICIALIZACIÓN DEL JUEGO
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    initGame();
});