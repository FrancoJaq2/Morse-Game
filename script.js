// =================================================================
// 1. DICCIONARIOS Y ESTADO DEL JUEGO
// =================================================================

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

// --- Listas de Palabras por Idioma ---
const COMMON_WORDS_ES = [
    'HOLA', 'CASA', 'SOL', 'MAR', 'AIRE', 'NADA', 'FIN', 'UNO', 'DOS', 
    'TRES', 'VIZ', 'LUZ', 'RIO', 'DIA', 'NOCHE', 'FRIO', 'CLAVE', 'GOL', 'SI'
];
const COMMON_WORDS_EN = [
    'CAT', 'RUN', 'DOG', 'YES', 'NO', 'HELP', 'SUN', 'MOON', 'CODE',
    'TEST', 'WIN', 'GAME', 'EAT', 'SHIP', 'AIR', 'GO', 'STOP', 'TIME', 'DATA'
];

const LANGUAGE_PACKS = {
    'ES': { words: COMMON_WORDS_ES, name: 'Español' },
    'EN': { words: COMMON_WORDS_EN, name: 'Inglés' }
};

// --- ESTRUCTURA DE CURSOS Y NIVELES ---
const LEARNING_CURSES = [
    {
        id: 1, 
        title: "Nivel 1: Símbolos Básicos (E, I, T, M)", 
        description: "Aprende los puntos y rayas más cortos y las letras más comunes.",
        chars: 'EITM',
        mode: 'LETTERS', // Trivia de Letras
        points: 100,
        unlocked: true 
    },
    {
        id: 2, 
        title: "Nivel 2: Bloque Frecuente (A, N, S, O)", 
        description: "Incorpora letras de frecuencia media. El desafío se centra en la audición.",
        chars: 'ANSOR',
        mode: 'LETTERS', 
        points: 150,
        unlocked: false
    },
    {
        id: 3, 
        title: "Nivel 3: Palabras Cortas (Decodificación)", 
        description: "Practica decodificación auditiva de palabras de 3 a 4 letras. El idioma depende de tu selección.",
        chars: 'ABCDEFGHIJK', // Un grupo grande de letras para opciones incorrectas
        mode: 'WORDS', // Trivia de palabras
        points: 200,
        unlocked: false
    },
    {
        id: 4, 
        title: "Nivel 4: Números y Símbolos (0-9, .)", 
        description: "Céntrate en la estructura de los números y algunos símbolos básicos.",
        chars: '012345.?',
        mode: 'LETTERS', 
        points: 250,
        unlocked: false
    },
    {
        id: 5, 
        title: "Nivel 5: Desafío Combinado", 
        description: "Decodifica cualquier carácter, número o palabra corta. ¡Prueba final de curso!",
        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
        mode: 'MIXED', // Combina letras y palabras
        points: 300,
        unlocked: false
    },
];


// Game state and configuration
let currentPhase = 'courses'; 
let score = 0;
let level = 1;
let highScore = 0;

let gameLanguage = 'ES';  // Estado por defecto

// Trivia variables
let triviaQuestions = [];
let currentTriviaQuestion = 0;
let triviaCorrectAnswer = '';
let triviaCorrectCount = 0;


// =================================================================
// 2. FUNCIONES DE AUDIO MORSE REAL (Web Audio API)
// (Se mantienen igual)
// =================================================================

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

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
    
    const morseDisplay = document.getElementById('morse-display') 
                        || document.getElementById('current-morse') 
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
    
    // Solo actualiza current-playing si está en la fase de Referencia
    if (currentPhase === 'reference' && document.getElementById('current-playing')) {
        document.getElementById('current-playing').textContent = word.toUpperCase();
    }
}

function playCurrentMorse() {
    // Para Trivia (Decodificación de Lecciones)
    if (currentPhase === 'trivia' && triviaCorrectAnswer) {
         playMorseWord(triviaCorrectAnswer);
         return;
    }
    // Para Desafío Global
    if (currentPhase === 'challenge' && challengeCorrectAnswer) {
         playMorseWord(challengeCorrectAnswer);
         return;
    }
    
    // Para Referencia
    const refChar = document.getElementById('current-playing')?.textContent;
    if (refChar) {
        playMorseWord(refChar);
    }
}

// =================================================================
// 3. FUNCIONES DE INICIALIZACIÓN Y ESTADO
// =================================================================

function loadHighScore() {
    const storedScore = localStorage.getItem('morseMasterHighScore');
    highScore = storedScore ? parseInt(storedScore) : 0;
    
    const storedCourses = JSON.parse(localStorage.getItem('morseMasterCourses'));
    if (storedCourses) {
        // Carga el estado de desbloqueo de los niveles
        LEARNING_CURSES.forEach((course, index) => {
            if (storedCourses[index] && storedCourses[index].unlocked) {
                course.unlocked = true;
            }
        });
    }

    const highScoreDisplay = document.getElementById('high-score-display');
    if (highScoreDisplay) {
        highScoreDisplay.textContent = highScore;
    }
}

function updateScore(points = 0) {
    score += points;
    
    document.getElementById('score').textContent = score;
    
    if (score > highScore) {
        highScore = score;
        const highScoreDisplay = document.getElementById('high-score-display');
        if(highScoreDisplay) {
             highScoreDisplay.textContent = highScore;
        }
        localStorage.setItem('morseMasterHighScore', highScore);
    }
}

function updateLevelDisplay() {
    // Calcular el nivel basado en el curso más alto desbloqueado
    const unlockedCourses = LEARNING_CURSES.filter(c => c.unlocked);
    level = unlockedCourses.length;
    document.getElementById('level').textContent = level;
}

function showPhase(phase) {
    document.querySelectorAll('.phase-content').forEach(el => {
        el.classList.add('hidden');
    });
    
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = btn.className.replace('bg-purple-600', 'bg-slate-600').replace('bg-purple-700', 'bg-slate-700');
    });
    
    document.getElementById(`phase-${phase}`).classList.remove('hidden');
    document.getElementById(`btn-${phase}`).className = document.getElementById(`btn-${phase}`).className.replace('bg-slate-600', 'bg-purple-600').replace('bg-slate-700', 'bg-purple-700');
    
    currentPhase = phase;
    
    if (phase === 'courses') {
        renderCourses();
    } else if (phase === 'reference') {
        // La referencia solo muestra la tabla A-Z, 0-9
        createReferenceTable();
    } else if (phase === 'challenge') {
        resetChallenge();
    }
}

function initGame() {
    loadHighScore(); 
    showPhase('courses'); 
    updateScore(0); // Para inicializar el score a 0 y cargar el High Score
    updateLevelDisplay();
    
    // Inyectar el High Score en el HTML al inicio (si no existe)
    const scoreContainer = document.querySelector('.flex-wrap.justify-center');
    const existingHighScore = document.getElementById('high-score-display');
    
    if (scoreContainer && !existingHighScore) {
        const highScoreHTML = `
            <div class="stats-card mt-4 md:mt-0 ml-4 bg-slate-700 p-4 rounded-lg">
                <p class="text-sm text-slate-400 uppercase">Máxima Puntuación</p>
                <p id="high-score-display" class="text-3xl font-bold text-red-400">${highScore}</p>
            </div>
        `;
        scoreContainer.insertAdjacentHTML('beforeend', highScoreHTML);
    }
    document.getElementById('language-select').value = gameLanguage;
}

function setGameLanguage(lang) {
    gameLanguage = lang;
}

// =================================================================
// 4. FUNCIONES DE CURSOS Y LECCIONES (NUEVAS FASES)
// =================================================================

function renderCourses() {
    const listContainer = document.getElementById('courses-list');
    listContainer.innerHTML = '';
    
    // Guardar el estado actual de desbloqueo en localStorage
    localStorage.setItem('morseMasterCourses', JSON.stringify(LEARNING_CURSES.map(c => ({ id: c.id, unlocked: c.unlocked }))));

    LEARNING_CURSES.forEach(course => {
        const lockIcon = course.unlocked ? '🔓' : '🔒';
        const bgColor = course.unlocked ? 'bg-slate-700 hover:bg-slate-600 cursor-pointer' : 'bg-slate-900 cursor-not-allowed';
        const textColor = course.unlocked ? 'text-emerald-400' : 'text-red-400';
        const buttonText = course.unlocked ? 'Iniciar Curso' : 'Bloqueado';

        const courseCard = document.createElement('div');
        courseCard.className = `p-4 rounded-lg shadow-lg flex justify-between items-center transition-all duration-300 ${bgColor}`;
        
        if (course.unlocked) {
            courseCard.onclick = () => viewLesson(course.id);
        }

        courseCard.innerHTML = `
            <div>
                <h3 class="text-xl font-bold ${textColor}">${lockIcon} ${course.title}</h3>
                <p class="text-slate-400 text-sm">${course.description}</p>
            </div>
            <div class="text-right">
                <p class="text-lg font-semibold text-purple-400 mb-1">+${course.points} pts</p>
                <button class="bg-purple-600 py-1 px-3 rounded text-sm font-semibold opacity-90">
                    ${buttonText}
                </button>
            </div>
        `;
        listContainer.appendChild(courseCard);
    });
    updateLevelDisplay();
}

function viewLesson(courseId) {
    currentCourse = LEARNING_CURSES.find(c => c.id === courseId);
    if (!currentCourse || !currentCourse.unlocked) return;
    
    document.getElementById('lesson-title').textContent = currentCourse.title;
    document.getElementById('lesson-description').textContent = currentCourse.description;
    
    const grid = document.getElementById('lesson-chars-grid');
    grid.innerHTML = '';
    
    // Inyectar los caracteres que se aprenden en este curso
    for (let char of currentCourse.chars) {
        const item = document.createElement('div');
        item.className = 'morse-item bg-slate-800 p-2 rounded-lg text-center cursor-pointer hover:bg-slate-600 transition';
        item.innerHTML = `
            <span class="font-bold text-lg block">${char}</span>
            <span class="font-mono text-purple-400 text-sm">${morseCode[char] || ''}</span>
        `;
        item.onclick = () => playMorseWord(char);
        grid.appendChild(item);
    }

    showPhase('lesson');
}

function startLessonTrivia() {
    triviaQuestions = generateTriviaQuestions(currentCourse);
    currentTriviaQuestion = 0;
    triviaCorrectCount = 0;
    
    document.getElementById('trivia-title').textContent = currentCourse.title + " (Trivia)";
    document.getElementById('trivia-instruction').textContent = currentCourse.mode === 'LETTERS' 
        ? "Escucha el carácter Morse y elige la letra/símbolo correcto." 
        : "Escucha el código Morse y elige la palabra correcta.";
        
    showPhase('trivia');
    showTriviaQuestion();
}

function generateTriviaQuestions(course) {
    const questions = [];
    const NUM_QUESTIONS = 10;
    const charsAvailable = course.chars;
    const wordList = LANGUAGE_PACKS[gameLanguage].words;

    for (let i = 0; i < NUM_QUESTIONS; i++) {
        let correctContent;
        let options = [];
        let questionMode = course.mode;
        
        // Para modo MIXED, decide si es Letra o Palabra al azar
        if (questionMode === 'MIXED') {
            questionMode = Math.random() < 0.5 ? 'LETTERS' : 'WORDS';
        }

        if (questionMode === 'LETTERS') {
            // Genera preguntas de LETRAS/SÍMBOLOS
            correctContent = charsAvailable[Math.floor(Math.random() * charsAvailable.length)];
            options.push(correctContent);
            
            while (options.length < 4) {
                // Opciones incorrectas pueden ser cualquier letra o símbolo
                const wrongChar = charsAvailable[Math.floor(Math.random() * charsAvailable.length)] 
                                || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)];
                if (!options.includes(wrongChar)) {
                    options.push(wrongChar);
                }
            }
        } else { 
            // Genera preguntas de PALABRAS (WORDS)
            correctContent = wordList[Math.floor(Math.random() * wordList.length)];
            options.push(correctContent);
            
            while (options.length < 4) {
                const wrongWord = wordList[Math.floor(Math.random() * wordList.length)];
                if (!options.includes(wrongWord)) {
                    options.push(wrongWord);
                }
            }
        }
        
        // Shuffle options
        for (let j = options.length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [options[j], options[k]] = [options[k], options[j]];
        }
        
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

function showTriviaQuestion() {
    if (currentTriviaQuestion >= triviaQuestions.length) {
        endTrivia();
        return;
    }
    
    const question = triviaQuestions[currentTriviaQuestion];
    triviaCorrectAnswer = question.correct;
    
    document.getElementById('trivia-question-num').textContent = `Pregunta ${currentTriviaQuestion + 1} de ${triviaQuestions.length}`;
    document.getElementById('morse-display').textContent = question.morse; 
    
    playMorseWord(question.correct); 
    
    for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`option-${i}`);
        btn.textContent = question.options[i];
        btn.className = 'option-btn bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition-all duration-300 text-xl font-semibold';
        btn.disabled = false;
    }
    
    document.getElementById('trivia-feedback').innerHTML = '';
    document.getElementById('next-trivia').classList.add('hidden');
}

function selectTriviaAnswer(index) {
    const question = triviaQuestions[currentTriviaQuestion];
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
    
    const feedback = document.getElementById('trivia-feedback');
    
    if (isCorrect) {
        feedback.innerHTML = `
            <div class="text-emerald-400 text-xl font-semibold bounce">
                ✅ ¡Correcto! La respuesta es: ${question.correct}
            </div>
        `;
        triviaCorrectCount++;
    } else {
        feedback.innerHTML = `
            <div class="text-red-400 text-xl font-semibold">
                ❌ Incorrecto. La respuesta correcta es: ${question.correct}
            </div>
        `;
    }
    
    document.getElementById('next-trivia').classList.remove('hidden');
}

function nextTriviaQuestion() {
    currentTriviaQuestion++;
    showTriviaQuestion();
}

function endTrivia() {
    const totalPoints = currentCourse.points;
    const pointsEarned = Math.round(totalPoints * (triviaCorrectCount / triviaQuestions.length));
    
    updateScore(pointsEarned);
    
    let message = '';
    if (triviaCorrectCount >= 8) {
        message = `¡Felicitaciones! Has pasado el curso con ${triviaCorrectCount}/10 correctas.`;
        
        // Desbloquear el siguiente curso
        const nextCourseIndex = LEARNING_CURSES.findIndex(c => c.id === currentCourse.id) + 1;
        if (nextCourseIndex < LEARNING_CURSES.length) {
            LEARNING_CURSES[nextCourseIndex].unlocked = true;
            message += ` ¡El Nivel ${LEARNING_CURSES[nextCourseIndex].id} ha sido desbloqueado!`;
        }
    } else {
        message = `Necesitas ${8 - triviaCorrectCount} más correctas para avanzar. ¡Sigue practicando!`;
    }

    document.getElementById('result-score').textContent = `+${pointsEarned} pts`;
    document.getElementById('result-message').textContent = message;
    
    showPhase('results');
}

// =================================================================
// 5. OTRAS FASES (Referencia y Desafío Global)
// =================================================================

function createReferenceTable() {
    const allChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,?!'; 
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Solo creamos la grilla principal de letras/números/símbolos
    createMorseGrid('letters-grid', allChars);
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


// ... (El resto de las funciones de Challenge Phase se mantienen igual, solo se actualiza la lista de palabras) ...

// CHALLENGE PHASE (Se mantiene la lógica antigua de Challenge, solo usa el idioma seleccionado)
// Nota: La función startChallenge, startChallengeTimer, updateChallengeDisplay, challengeAnswer, endChallenge y restartChallenge se mantienen IGUAL.
// Solo se modifica nextChallengeQuestion

function nextChallengeQuestion() {
    // Usa las palabras del idioma seleccionado
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


// =================================================================
// 6. INICIALIZACIÓN DEL JUEGO
// =================================================================

document.addEventListener('DOMContentLoaded', function() {
    initGame();
});