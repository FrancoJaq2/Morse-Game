// =================================================================
// 0. LOCALIZACIÓN (i18n) DE LA INTERFAZ
// (Contenido de la localización, omitido aquí por brevedad, debe estar completo)
// ...
// ...

let interfaceLanguage = localStorage.getItem('interfaceLanguage') || 'ES';

const LOCALIZATION = {
    // Definiciones de ES, EN, y FR (Asegúrate de tener todas las definiciones de la respuesta anterior aquí)
    ES: {
        APP_TITLE: "Morse Master",
        SUBTITLE: "Aprende Código Morse de forma rápida y divertida.",
        STATS_SCORE_LABEL: "Puntuación",
        STATS_LEVEL_LABEL: "Nivel",
        STATS_HIGH_SCORE_LABEL: "Máx. Puntuación",
        BTN_COURSES: "Cursos",
        BTN_REFERENCE: "Referencia",
        BTN_CHALLENGE: "Desafío Global",
        BTN_SETTINGS: "Ajustes", 
        COURSE_BUTTON: (progress) => `Empezar (${progress} completado)`,
        COURSE_BUTTON_COMPLETED: "Completado",
        LESSON_BACK_BTN: "← Volver a Cursos",
        LESSON_LEARN_TITLE: "Aprende los siguientes caracteres",
        LESSON_CHARS_INFO: (chars) => `Practicarás ${chars.length} caracteres: ${chars.join(', ')}`,
        LESSON_START_TRIVIA: "Empezar la Práctica",
        TRIVIA_TITLE: "Práctica de Código Morse",
        TRIVIA_INSTRUCTION: "Escucha el sonido Morse y selecciona el carácter correcto.",
        TRIVIA_QUESTION_NUM: (current, total) => `Pregunta ${current} de ${total}`,
        TRIVIA_LISTEN_AGAIN: "🔊 Escuchar de nuevo",
        TRIVIA_NEXT_BTN: "Siguiente Pregunta →",
        TRIVIA_FEEDBACK_CORRECT: "¡Correcto! +10 puntos.",
        TRIVIA_FEEDBACK_INCORRECT: "Incorrecto. La respuesta era ",
        RESULTS_TITLE: "Resultados de la Lección",
        RESULTS_SCORE_LABEL: "Puntuación obtenida:",
        RESULTS_MESSAGE_EXCELLENT: "¡Excelente! Has dominado el código de esta lección.",
        RESULTS_MESSAGE_GOOD: "Bien hecho. Repasa si quieres dominarlo al 100%.",
        RESULTS_MESSAGE_OK: "Necesitas un poco más de práctica.",
        RESULTS_BACK_BTN: "Volver a Cursos",
        REF_TITLE: "Tabla de Referencia Morse",
        REF_LETTERS_TITLE: "Letras y Símbolos",
        REF_NUMBERS_TITLE: "Números",
        REF_DISPLAY_LISTEN: "🔊 Reproducir",
        CHALLENGE_TITLE: "Desafío Global",
        CHALLENGE_SUBTITLE: "Descifra palabras completas usando todos tus conocimientos.",
        CHALLENGE_SETUP_MSG: "Pon a prueba tu velocidad y precisión. Tienes 3 errores máximos en 60 segundos.",
        CHALLENGE_START_BTN: "¡Empezar Desafío!",
        CHALLENGE_TIME_LABEL: "Tiempo",
        CHALLENGE_SCORE_LABEL: "Aciertos",
        CHALLENGE_ERRORS_LABEL: "Errores",
        CHALLENGE_END_TITLE: "¡Desafío Terminado!",
        CHALLENGE_END_DECODED: (word) => `Descifraste: ${word}`,
        CHALLENGE_END_PERFORMANCE_A: "¡Increíble! Eres un maestro del Morse.",
        CHALLENGE_END_PERFORMANCE_B: "Muy bien. Casi un experto, sigue así.",
        CHALLENGE_END_PERFORMANCE_C: "Un buen intento. La práctica hace al maestro.",
        CHALLENGE_END_PERFORMANCE_D: "Buen inicio. Con más práctica, lo conseguirás.",
        CHALLENGE_END_BACK_BTN: "Volver al Inicio",
        SETTINGS_TITLE: "Ajustes",
        SETTINGS_SUBTITLE: "Personaliza la experiencia a tu gusto.",
        SETTINGS_SPEED_TITLE: "Velocidad y Tono Morse",
        MORSE_SPEED_LABEL: "Velocidad (WPM): ",
        VOLUME_MORSE_LABEL: "Tono de Código Morse",
        BTN_TEST_MORSE: "🔊 Probar Tono",
        SETTINGS_AUDIO_TITLE: "Control de Volumen de Interfaz",
        VOLUME_MUSIC_LABEL: "Música Ambiente",
        VOLUME_CLICK_LABEL: "Sonido de Click",
        SETTINGS_ACCESSIBILITY_TITLE: "Accesibilidad",
        SETTINGS_FONT_SIZE_LABEL: "Tamaño de Fuente (Base: "
    },
    EN: {
        APP_TITLE: "Morse Master",
        SUBTITLE: "Learn Morse Code quickly and fun.",
        STATS_SCORE_LABEL: "Score",
        STATS_LEVEL_LABEL: "Level",
        STATS_HIGH_SCORE_LABEL: "High Score",
        BTN_COURSES: "Courses",
        BTN_REFERENCE: "Reference",
        BTN_CHALLENGE: "Global Challenge",
        BTN_SETTINGS: "Settings", 
        COURSE_BUTTON: (progress) => `Start (${progress} completed)`,
        COURSE_BUTTON_COMPLETED: "Completed",
        LESSON_BACK_BTN: "← Back to Courses",
        LESSON_LEARN_TITLE: "Learn the following characters",
        LESSON_CHARS_INFO: (chars) => `You will practice ${chars.length} characters: ${chars.join(', ')}`,
        LESSON_START_TRIVIA: "Start Practice",
        TRIVIA_TITLE: "Morse Code Practice",
        TRIVIA_INSTRUCTION: "Listen to the Morse sound and select the correct character.",
        TRIVIA_QUESTION_NUM: (current, total) => `Question ${current} of ${total}`,
        TRIVIA_LISTEN_AGAIN: "🔊 Listen again",
        TRIVIA_NEXT_BTN: "Next Question →",
        TRIVIA_FEEDBACK_CORRECT: "Correct! +10 points.",
        TRIVIA_FEEDBACK_INCORRECT: "Incorrect. The answer was ",
        RESULTS_TITLE: "Lesson Results",
        RESULTS_SCORE_LABEL: "Score obtained:",
        RESULTS_MESSAGE_EXCELLENT: "Excellent! You have mastered the code for this lesson.",
        RESULTS_MESSAGE_GOOD: "Well done. Review it if you want to master it 100%.",
        RESULTS_MESSAGE_OK: "You need a little more practice.",
        RESULTS_BACK_BTN: "Back to Courses",
        REF_TITLE: "Morse Reference Chart",
        REF_LETTERS_TITLE: "Letters and Symbols",
        REF_NUMBERS_TITLE: "Numbers",
        REF_DISPLAY_LISTEN: "🔊 Play",
        CHALLENGE_TITLE: "Global Challenge",
        CHALLENGE_SUBTITLE: "Decipher entire words using all your knowledge.",
        CHALLENGE_SETUP_MSG: "Test your speed and accuracy. You have a maximum of 3 errors in 60 seconds.",
        CHALLENGE_START_BTN: "Start Challenge!",
        CHALLENGE_TIME_LABEL: "Time",
        CHALLENGE_SCORE_LABEL: "Hits",
        CHALLENGE_ERRORS_LABEL: "Errors",
        CHALLENGE_END_TITLE: "Challenge Finished!",
        CHALLENGE_END_DECODED: (word) => `You decoded: ${word}`,
        CHALLENGE_END_PERFORMANCE_A: "Amazing! You are a Morse Master.",
        CHALLENGE_END_PERFORMANCE_B: "Very good. Almost an expert, keep it up.",
        CHALLENGE_END_PERFORMANCE_C: "A good attempt. Practice makes perfect.",
        CHALLENGE_END_PERFORMANCE_D: "Good start. With more practice, you'll get it.",
        CHALLENGE_END_BACK_BTN: "Back to Home",
        SETTINGS_TITLE: "Settings",
        SETTINGS_SUBTITLE: "Customize the experience to your liking.",
        SETTINGS_SPEED_TITLE: "Morse Speed and Tone",
        MORSE_SPEED_LABEL: "Speed (WPM): ",
        VOLUME_MORSE_LABEL: "Morse Code Tone",
        BTN_TEST_MORSE: "🔊 Test Tone",
        SETTINGS_AUDIO_TITLE: "Interface Volume Control",
        VOLUME_MUSIC_LABEL: "Background Music",
        VOLUME_CLICK_LABEL: "Click Sound",
        SETTINGS_ACCESSIBILITY_TITLE: "Accessibility",
        SETTINGS_FONT_SIZE_LABEL: "Font Size (Base: "
    },
    FR: {
        APP_TITLE: "Maître Morse",
        SUBTITLE: "Apprenez le Code Morse rapidement et de manière amusante.",
        STATS_SCORE_LABEL: "Score",
        STATS_LEVEL_LABEL: "Niveau",
        STATS_HIGH_SCORE_LABEL: "Meilleur Score",
        BTN_COURSES: "Cours",
        BTN_REFERENCE: "Référence",
        BTN_CHALLENGE: "Défi Global",
        BTN_SETTINGS: "Paramètres", 
        COURSE_BUTTON: (progress) => `Commencer (${progress} complété)`,
        COURSE_BUTTON_COMPLETED: "Complété",
        LESSON_BACK_BTN: "← Retour aux Cours",
        LESSON_LEARN_TITLE: "Apprenez les caractères suivants",
        LESSON_CHARS_INFO: (chars) => `Vous pratiquerez ${chars.length} caractères: ${chars.join(', ')}`,
        LESSON_START_TRIVIA: "Commencer la Pratique",
        TRIVIA_TITLE: "Pratique du Code Morse",
        TRIVIA_INSTRUCTION: "Écoutez le son Morse et sélectionnez le caractère correct.",
        TRIVIA_QUESTION_NUM: (current, total) => `Question ${current} sur ${total}`,
        TRIVIA_LISTEN_AGAIN: "🔊 Écouter à nouveau",
        TRIVIA_NEXT_BTN: "Question Suivante →",
        TRIVIA_FEEDBACK_CORRECT: "Correct! +10 points.",
        TRIVIA_FEEDBACK_INCORRECT: "Incorrect. La réponse était ",
        RESULTS_TITLE: "Résultats de la Leçon",
        RESULTS_SCORE_LABEL: "Score obtenu:",
        RESULTS_MESSAGE_EXCELLENT: "Excellent! Vous maîtrisez le code de cette leçon.",
        RESULTS_MESSAGE_GOOD: "Bien joué. Révisez si vous voulez le maîtriser à 100%.",
        RESULTS_MESSAGE_OK: "Vous avez besoin de plus de pratique.",
        RESULTS_BACK_BTN: "Retour aux Cours",
        REF_TITLE: "Table de Référence Morse",
        REF_LETTERS_TITLE: "Lettres et Symboles",
        REF_NUMBERS_TITLE: "Numéros",
        REF_DISPLAY_LISTEN: "🔊 Jouer",
        CHALLENGE_TITLE: "Défi Global",
        CHALLENGE_SUBTITLE: "Déchiffrez des mots entiers en utilisant toutes vos connaissances.",
        CHALLENGE_SETUP_MSG: "Testez votre vitesse et votre précision. Vous avez un maximum de 3 erreurs en 60 secondes.",
        CHALLENGE_START_BTN: "Démarrer le Défi!",
        CHALLENGE_TIME_LABEL: "Temps",
        CHALLENGE_SCORE_LABEL: "Succès",
        CHALLENGE_ERRORS_LABEL: "Erreurs",
        CHALLENGE_END_TITLE: "Défi Terminé!",
        CHALLENGE_END_DECODED: (word) => `Vous avez déchiffré: ${word}`,
        CHALLENGE_END_PERFORMANCE_A: "Incroyable! Vous êtes un Maître Morse.",
        CHALLENGE_END_PERFORMANCE_B: "Très bien. Presque un expert, continuez comme ça.",
        CHALLENGE_END_PERFORMANCE_C: "Une bonne tentative. La pratique rend parfait.",
        CHALLENGE_END_PERFORMANCE_D: "Bon départ. Avec plus de pratique, vous y arriverez.",
        CHALLENGE_END_BACK_BTN: "Retour à l'Accueil",
        SETTINGS_TITLE: "Paramètres",
        SETTINGS_SUBTITLE: "Personnalisez l'expérience à votre goût.",
        SETTINGS_SPEED_TITLE: "Vitesse et Tonalité Morse",
        MORSE_SPEED_LABEL: "Vitesse (Mots/min): ",
        VOLUME_MORSE_LABEL: "Tonalité Code Morse",
        BTN_TEST_MORSE: "🔊 Tester Tonalité",
        SETTINGS_AUDIO_TITLE: "Contrôle du Volume",
        VOLUME_MUSIC_LABEL: "Musique d'Ambiance",
        VOLUME_CLICK_LABEL: "Son du Clic",
        SETTINGS_ACCESSIBILITY_TITLE: "Accessibilité",
        SETTINGS_FONT_SIZE_LABEL: "Taille de Police (Base: "
    }
};

function getLocalizedText(key, ...args) {
    const langData = LOCALIZATION[interfaceLanguage] || LOCALIZATION['ES'];
    let text = langData[key] || LOCALIZATION['ES'][key] || key;

    if (typeof text === 'function') {
        return text(...args);
    }
    return text;
}

function setInterfaceLanguage(lang) {
    interfaceLanguage = lang;
    localStorage.setItem('interfaceLanguage', lang);
    updateInterfaceTexts();
    renderCoursesList();
    if (document.getElementById('phase-reference').classList.contains('active-phase')) {
         renderReferenceGrid();
    }
}

function updateInterfaceTexts() {
    // Header y Stats
    document.getElementById('app-title').textContent = getLocalizedText('APP_TITLE');
    document.getElementById('subtitle').textContent = getLocalizedText('SUBTITLE');
    document.getElementById('stats-score-label').textContent = getLocalizedText('STATS_SCORE_LABEL');
    document.getElementById('stats-level-label').textContent = getLocalizedText('STATS_LEVEL_LABEL');
    document.getElementById('stats-high-score-label').textContent = getLocalizedText('STATS_HIGH_SCORE_LABEL');
    
    // Navegación
    document.getElementById('btn-courses').textContent = getLocalizedText('BTN_COURSES');
    document.getElementById('btn-reference').textContent = getLocalizedText('BTN_REFERENCE');
    document.getElementById('btn-challenge').textContent = getLocalizedText('BTN_CHALLENGE');
    document.getElementById('btn-settings').textContent = getLocalizedText('BTN_SETTINGS');
    
    // FASE 1: Cursos
    if(document.getElementById('courses-header')) document.getElementById('courses-header').textContent = getLocalizedText('COURSE_TITLE');
    if(document.getElementById('courses-subheader')) document.getElementById('courses-subheader').textContent = getLocalizedText('COURSES_SUBHEADER');
    
    // FASE 2: Lección
    if(document.getElementById('btn-back-to-courses')) document.getElementById('btn-back-to-courses').textContent = getLocalizedText('LESSON_BACK_BTN');
    if(document.getElementById('lesson-learn-title')) document.getElementById('lesson-learn-title').textContent = getLocalizedText('LESSON_LEARN_TITLE');
    if(document.getElementById('btn-start-trivia')) document.getElementById('btn-start-trivia').textContent = getLocalizedText('LESSON_START_TRIVIA');
    
    // FASE 3: Trivia
    if(document.getElementById('trivia-title')) document.getElementById('trivia-title').textContent = getLocalizedText('TRIVIA_TITLE');
    if(document.getElementById('trivia-instruction')) document.getElementById('trivia-instruction').textContent = getLocalizedText('TRIVIA_INSTRUCTION');
    if(document.getElementById('btn-listen-again')) document.getElementById('btn-listen-again').textContent = getLocalizedText('TRIVIA_LISTEN_AGAIN');
    if(document.getElementById('next-trivia')) document.getElementById('next-trivia').textContent = getLocalizedText('TRIVIA_NEXT_BTN');

    // FASE 4: Resultados
    if(document.getElementById('results-title')) document.getElementById('results-title').textContent = getLocalizedText('RESULTS_TITLE');
    if(document.getElementById('results-score-label')) document.getElementById('results-score-label').textContent = getLocalizedText('RESULTS_SCORE_LABEL');
    if(document.getElementById('results-back-btn')) document.getElementById('results-back-btn').textContent = getLocalizedText('RESULTS_BACK_BTN');
    
    // FASE 5: Referencia
    if(document.getElementById('ref-title')) document.getElementById('ref-title').textContent = getLocalizedText('REF_TITLE');
    if(document.getElementById('ref-letters-title')) document.getElementById('ref-letters-title').textContent = getLocalizedText('REF_LETTERS_TITLE');
    if(document.getElementById('ref-numbers-title')) document.getElementById('ref-numbers-title').textContent = getLocalizedText('REF_NUMBERS_TITLE');
    if(document.getElementById('ref-display-listen')) document.getElementById('ref-display-listen').textContent = getLocalizedText('REF_DISPLAY_LISTEN');
    
    // FASE 6: Desafío Global
    if (document.getElementById('challenge-title')) {
        document.getElementById('challenge-title').textContent = getLocalizedText('CHALLENGE_TITLE');
        document.getElementById('challenge-subtitle').textContent = getLocalizedText('CHALLENGE_SUBTITLE');
        document.getElementById('challenge-setup-msg').textContent = getLocalizedText('CHALLENGE_SETUP_MSG');
        document.getElementById('challenge-start-btn').textContent = getLocalizedText('CHALLENGE_START_BTN');
        document.getElementById('challenge-time-label').textContent = getLocalizedText('CHALLENGE_TIME_LABEL');
        document.getElementById('challenge-score-label').textContent = getLocalizedText('CHALLENGE_SCORE_LABEL');
        document.getElementById('challenge-errors-label').textContent = getLocalizedText('CHALLENGE_ERRORS_LABEL');
    }
    
    // FASE 7: Ajustes (Simplificado)
    if (document.getElementById('settings-title')) {
        document.getElementById('settings-title').textContent = getLocalizedText('SETTINGS_TITLE');
        document.getElementById('settings-subtitle').textContent = getLocalizedText('SETTINGS_SUBTITLE');
        document.getElementById('settings-speed-title').textContent = getLocalizedText('SETTINGS_SPEED_TITLE');
        // Usamos una span para el WPM actual, no un label que cambia el texto
        document.getElementById('morse-speed-label').textContent = getLocalizedText('MORSE_SPEED_LABEL'); 
        document.getElementById('volume-morse-label').textContent = getLocalizedText('VOLUME_MORSE_LABEL');
        document.getElementById('btn-test-morse').textContent = getLocalizedText('BTN_TEST_MORSE');
        document.getElementById('settings-audio-title').textContent = getLocalizedText('SETTINGS_AUDIO_TITLE');
        document.getElementById('volume-music-label').textContent = getLocalizedText('VOLUME_MUSIC_LABEL');
        document.getElementById('volume-click-label').textContent = getLocalizedText('VOLUME_CLICK_LABEL');
        document.getElementById('settings-accessibility-title').textContent = getLocalizedText('SETTINGS_ACCESSIBILITY_TITLE');
        document.getElementById('settings-font-size-label').textContent = getLocalizedText('SETTINGS_FONT_SIZE_LABEL');
    }
}


// =================================================================
// 1. DATOS Y ESTADO DEL JUEGO
// =================================================================
const morseCode = {
    'E': '.', 'T': '-', 'I': '..', 'A': '.-', 'N': '-.', 'M': '--', 
    'S': '...', 'U': '..-', 'R': '.-.', 'W': '.--','D': '-..', 'K': '-.-', 
    'G': '--.', 'O': '---', 'H': '....', 'V': '...-', 'F': '..-.', 'L': '.-..', 
    'P': '.--.', 'J': '.---', 'B': '-...', 'X': '-..-', 'C': '-.-.', 'Y': '-.--', 
    'Z': '--..', 'Q': '--.-', 
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', 
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    '.': '.-.-.-', ',': '--..--', '?': '..--..', '/': '-..-.', '-': '-....-',
};

const LEARNING_CURSES = [
    { title: { ES: "Nivel 1: E y T", EN: "Level 1: E and T", FR: "Niveau 1: E et T" }, chars: ['E', 'T'], description: { ES: "Los caracteres más cortos y fáciles: el punto y la raya.", EN: "The shortest and easiest characters: the dot and the dash.", FR: "Les caractères les plus courts et les plus faciles." } },
    { title: { ES: "Nivel 2: I, A, N, M", EN: "Level 2: I, A, N, M", FR: "Niveau 2: I, A, N, M" }, chars: ['I', 'A', 'N', 'M'], description: { ES: "Añadimos los caracteres de dos símbolos.", EN: "We add the two-symbol characters.", FR: "Nous ajoutons les caractères à deux symboles." } },
    { title: { ES: "Nivel 3: S, U, R, W", EN: "Level 3: S, U, R, W", FR: "Niveau 3: S, U, R, W" }, chars: ['S', 'U', 'R', 'W'], description: { ES: "Más caracteres comunes para aumentar tu velocidad.", EN: "More common characters to boost your speed.", FR: "Plus de caractères communs pour augmenter votre vitesse." } },
    { title: { ES: "Nivel 4: D, K, G, O", EN: "Level 4: D, K, G, O", FR: "Niveau 4: D, K, G, O" }, chars: ['D', 'K', 'G', 'O'], description: { ES: "Practica los opuestos (puntos vs. rayas) para evitar confusiones.", EN: "Practice the opposites (dots vs. dashes) to avoid confusion.", FR: "Pratiquez les opposés pour éviter la confusion." } },
    { title: { ES: "Nivel 5: H, V, F, L", EN: "Level 5: H, V, F, L", FR: "Niveau 5: H, V, F, L" }, chars: ['H', 'V', 'F', 'L'], description: { ES: "Cuatro puntos o combinaciones complejas.", EN: "Four dots or complex combinations.", FR: "Quatre points ou combinaisons complexes." } },
    { title: { ES: "Nivel 6: P, J, B, X", EN: "Level 6: P, J, B, X", FR: "Niveau 6: P, J, B, X" }, chars: ['P', 'J', 'B', 'X'], description: { ES: "Caracteres de baja frecuencia para una memorización completa.", EN: "Low-frequency characters for complete memorization.", FR: "Low-frequency characters for complete memorization." } },
    { title: { ES: "Nivel 7: C, Y, Z, Q", EN: "Level 7: C, Y, Z, Q", FR: "Niveau 7: C, Y, Z, Q" }, chars: ['C', 'Y', 'Z', 'Q'], description: { ES: "Los últimos caracteres del alfabeto.", EN: "The last characters of the alphabet.", FR: "The last characters of the alphabet." } },
    { title: { ES: "Nivel 8: Números", EN: "Level 8: Numbers", FR: "Niveau 8: Nombres" }, chars: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], description: { ES: "Todos los números. Largos y cruciales para la comunicación.", EN: "All the numbers. Long and crucial for communication.", FR: "All the numbers. Long and crucial for communication." } },
];

const CHALLENGE_WORDS = ["HELLO", "MORSE", "CODE", "MASTER", "TRAIN", "SPEED", "DITDAH", "LEARN", "SIGNAL", "RADIO"];
const ALL_CHARS = Object.keys(morseCode).filter(char => char.match(/[A-Z]/)); // Solo letras para opciones de desafío
const CHALLENGE_DURATION = 60; 

const DEFAULT_SETTINGS = {
    volumeMusic: 60,  
    volumeClick: 20,  
    volumeMorse: 50,  
    morseSpeed: 15,   
    theme: 'dark',    // Tema fijo en 'dark'
    fontSize: 16      
};

let SETTINGS = {};

let backgroundMusic = null; 
let clickSound = null; 

let currentCourseIndex = 0;
let triviaQuestions = [];
let currentQuestionIndex = 0;
let triviaCorrectCount = 0;

let score = 0;
let level = 1;
let highScore = 0;

let challengeWord = '';
let challengeOptions = [];
let challengeScore = 0;
let challengeErrors = 0;
let challengeTimeLeft = CHALLENGE_DURATION;
let challengeTimer = null;


// =================================================================
// 2. FUNCIONES DE AUDIO MORSE REAL (Se mantiene igual)
// =================================================================

let dotDuration = 80;   
let dashDuration = 240; 
let symbolSpace = 80;   
let charSpace = 240;    
let wordSpace = 560;    
const frequency = 600;  
let audioContext;

function calculateMorseTiming(wpm) {
    if (wpm < 5) wpm = 5; 
    const ditTime = Math.round(1200 / wpm);
    dotDuration = ditTime;
    dashDuration = ditTime * 3;
    symbolSpace = ditTime;
    charSpace = ditTime * 3;
    wordSpace = ditTime * 7;
}

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function playTone(duration) {
    const context = getAudioContext();
    if (context.state === 'suspended') {
        context.resume();
    }
    
    const morseVolume = SETTINGS.volumeMorse / 100;

    const oscillator = context.createOscillator();
    oscillator.type = 'sine'; 
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    const gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime); 
    gainNode.gain.linearRampToValueAtTime(morseVolume, context.currentTime + 0.01); 
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + (duration / 1000) - 0.01); 

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration / 1000);

    return sleep(duration);
}

async function playMorseWord(word) {
    calculateMorseTiming(SETTINGS.morseSpeed);
    
    for (const char of word.toUpperCase()) {
        if (char === ' ') {
            await sleep(wordSpace - charSpace); 
            continue;
        }

        const morseSequence = morseCode[char];
        if (!morseSequence) continue;

        for (let i = 0; i < morseSequence.length; i++) {
            const symbol = morseSequence[i];
            const duration = symbol === '.' ? dotDuration : dashDuration;
            
            await playTone(duration);
            
            if (i < morseSequence.length - 1) {
                await sleep(symbolSpace);
            }
        }
        
        await sleep(charSpace);
    }
}

function playCurrentMorse() {
    let morseString = '';
    
    if (document.getElementById('phase-trivia').classList.contains('active-phase')) {
        morseString = document.getElementById('morse-display').textContent;
    } else if (document.getElementById('phase-reference').classList.contains('active-phase')) {
        morseString = document.getElementById('current-morse').textContent;
    } 

    if (morseString) {
        const charToPlay = Object.keys(morseCode).find(key => morseCode[key] === morseString);
        if (charToPlay) {
            playMorseWord(charToPlay);
        }
    } else if (document.getElementById('phase-challenge').classList.contains('active-phase')) {
        playMorseWord(challengeWord);
    }
}

function playTestMorse() {
    playMorseWord("ET"); 
}

function initializeAudioElements() {
    if (backgroundMusic) return; 
    backgroundMusic = new Audio('Soundtarck.mp3'); 
    backgroundMusic.loop = true; 
    clickSound = new Audio('Click.mp3'); 
}


// =================================================================
// 3. FUNCIONES DE UTILIDAD GENERAL Y ESTADO (Se mantiene igual)
// =================================================================

function showPhase(phaseId) {
    document.querySelectorAll('.phase-content').forEach(phase => {
        phase.classList.add('hidden');
        phase.classList.remove('active-phase');
    });
    
    const targetPhase = document.getElementById(`phase-${phaseId}`);
    if (targetPhase) {
        targetPhase.classList.remove('hidden');
        targetPhase.classList.add('active-phase');
    }
    
    // Resalta el botón de navegación activo
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'hover:bg-purple-700');
        btn.classList.add('bg-gray-600', 'hover:bg-gray-700');
    });
    
    const activeBtn = document.getElementById(`btn-${phaseId}`);
    if (activeBtn) {
        activeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
        activeBtn.classList.add('active-nav', 'bg-purple-600', 'hover:bg-purple-700');
    }

    if (phaseId === 'courses') {
        renderCoursesList();
    } else if (phaseId === 'reference') {
        renderReferenceGrid();
    } else if (phaseId === 'challenge') {
        // Al entrar a la fase de desafío, mostramos la pantalla de inicio
        document.getElementById('challenge-setup').classList.remove('hidden');
        document.getElementById('challenge-game').classList.add('hidden');
        document.getElementById('challenge-results').classList.add('hidden');
        clearInterval(challengeTimer);
    }
}

function updateLevelDisplay() {
    document.getElementById('level').textContent = level;
    document.getElementById('score').textContent = score;
}

function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
    
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
}

function loadHighScore() {
    highScore = parseInt(localStorage.getItem('highScore') || 0);
    document.getElementById('high-score').textContent = highScore;
}

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}


// =================================================================
// 4. FUNCIONES DE AJUSTES (Se mantiene igual)
// =================================================================
// ... (loadSettings, saveSettings, updateVolume, updateMorseSpeed, applyFontSize) ...
function loadSettings() {
    const savedSettings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    SETTINGS = { ...DEFAULT_SETTINGS, ...savedSettings, theme: 'dark' };
    
    if (backgroundMusic) backgroundMusic.volume = SETTINGS.volumeMusic / 100;
    if (clickSound) clickSound.volume = SETTINGS.volumeClick / 100;
    calculateMorseTiming(SETTINGS.morseSpeed);

    if (document.getElementById('volume-music')) {
        document.getElementById('volume-music').value = SETTINGS.volumeMusic;
        document.getElementById('volume-click').value = SETTINGS.volumeClick;
        document.getElementById('volume-morse').value = SETTINGS.volumeMorse;
        document.getElementById('morse-speed').value = SETTINGS.morseSpeed; 
        document.getElementById('current-wpm').textContent = SETTINGS.morseSpeed; 
        document.getElementById('font-size').value = SETTINGS.fontSize;
        document.getElementById('current-font-size').textContent = SETTINGS.fontSize + 'px';
    }
    
    applyFontSize(SETTINGS.fontSize, false);
}

function saveSettings() {
    localStorage.setItem('userSettings', JSON.stringify(SETTINGS));
}

function updateVolume(type, value) {
    const volume = value / 100;
    
    if (type === 'music') {
        SETTINGS.volumeMusic = value;
        if (backgroundMusic) backgroundMusic.volume = volume;
    } else if (type === 'click') {
        SETTINGS.volumeClick = value;
        if (clickSound) clickSound.volume = volume;
    } else if (type === 'morse') {
        SETTINGS.volumeMorse = value; 
    }
    saveSettings();
}

function updateMorseSpeed(wpm) {
    wpm = parseInt(wpm);
    SETTINGS.morseSpeed = wpm;
    calculateMorseTiming(wpm);
    document.getElementById('current-wpm').textContent = wpm;
    saveSettings();
}

function applyFontSize(size, shouldSave = true) {
    size = parseInt(size);
    SETTINGS.fontSize = size;
    document.body.style.fontSize = `${size}px`;
    if (document.getElementById('current-font-size')) {
        document.getElementById('current-font-size').textContent = `${size}px`;
    }
    if (shouldSave) saveSettings();
}


// =================================================================
// 5. FUNCIONES DE CURSOS Y LECCIONES (Se mantiene igual)
// =================================================================
// ... (loadCourseProgress, saveCourseProgress, renderCoursesList, startLesson) ...

function loadCourseProgress() {
    const progress = JSON.parse(localStorage.getItem('courseProgress') || '{}');
    return progress;
}

function saveCourseProgress(courseIndex, completed = true) {
    const progress = loadCourseProgress();
    progress[courseIndex] = completed;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
    const completedCount = Object.values(progress).filter(Boolean).length;
    level = Math.max(1, completedCount);
    updateLevelDisplay();
}

function renderCoursesList() {
    const listContainer = document.getElementById('courses-list');
    listContainer.innerHTML = '';
    const progress = loadCourseProgress();

    LEARNING_CURSES.forEach((course, index) => {
        const isCompleted = progress[index];
        const isUnlocked = index === 0 || progress[index - 1];
        
        const courseTitle = course.title[interfaceLanguage] || course.title['ES'];
        const charsList = course.chars.join(', ');
        
        let buttonText;
        let buttonClass;
        let action;

        if (isCompleted) {
            buttonText = getLocalizedText('COURSE_BUTTON_COMPLETED');
            buttonClass = 'bg-emerald-600 hover:bg-emerald-700 cursor-default';
            action = '';
        } else if (isUnlocked) {
            const progressRatio = isCompleted ? '100%' : '0%'; 
            buttonText = getLocalizedText('COURSE_BUTTON', progressRatio);
            buttonClass = 'bg-purple-600 hover:bg-purple-700';
            action = `onclick="startLesson(${index})"`;
        } else {
            buttonText = 'Bloqueado';
            buttonClass = 'bg-gray-500 cursor-not-allowed';
            action = '';
        }
        
        const courseCard = `
            <div class="p-4 rounded-lg flex justify-between items-center transition duration-300 bg-slate-700 hover:bg-slate-600 ${!isUnlocked ? 'opacity-50' : ''}">
                <div>
                    <h3 class="text-xl font-bold mb-1 text-white">${courseTitle}</h3>
                    <p class="text-sm text-slate-400">${charsList}</p>
                </div>
                <button ${action} class="py-2 px-4 rounded-lg font-semibold text-white ${buttonClass}" ${!isUnlocked ? 'disabled' : ''}>
                    ${buttonText}
                </button>
            </div>
        `;
        listContainer.innerHTML += courseCard;
    });
}

function startLesson(index) {
    currentCourseIndex = index;
    const course = LEARNING_CURSES[index];
    const title = course.title[interfaceLanguage] || course.title['ES'];
    const description = course.description[interfaceLanguage] || course.description['ES'];
    
    document.getElementById('lesson-title').textContent = title;
    document.getElementById('lesson-description').textContent = description;
    document.getElementById('lesson-chars-info').textContent = getLocalizedText('LESSON_CHARS_INFO', course.chars);

    const charsGrid = document.getElementById('lesson-chars-grid');
    charsGrid.innerHTML = '';
    
    course.chars.forEach(char => {
        const morse = morseCode[char];
        
        const charItem = document.createElement('div');
        charItem.className = `morse-item p-2 rounded-lg text-center cursor-pointer transition duration-300 bg-slate-800 hover:bg-slate-700`;
        charItem.innerHTML = `<p class="text-xl font-bold text-purple-400">${char}</p><p class="text-sm font-mono text-emerald-400">${morse}</p>`;
        charItem.onclick = () => {
             playMorseWord(char); 
        }
        charsGrid.appendChild(charItem);
    });

    showPhase('lesson');
}

// =================================================================
// 6. TRIVIA (Se mantiene igual)
// =================================================================
// ... (startLessonTrivia, generateTriviaQuestions, nextTriviaQuestion, checkTriviaAnswer) ...

function startLessonTrivia() {
    const course = LEARNING_CURSES[currentCourseIndex];
    triviaQuestions = generateTriviaQuestions(course.chars, 10);
    currentQuestionIndex = 0;
    triviaCorrectCount = 0;
    document.getElementById('morse-display').textContent = '...'; 
    showPhase('trivia');
    nextTriviaQuestion();
}

function generateTriviaQuestions(correctChars, count) {
    const allPossibleAnswers = ALL_CHARS;
    const questions = [];
    for (let i = 0; i < count; i++) {
        const correctChar = getRandomElement(correctChars);
        const correctMorse = morseCode[correctChar];
        
        let options = [correctChar];
        
        while (options.length < 4) {
            let falseOption = getRandomElement(allPossibleAnswers);
            if (!options.includes(falseOption)) {
                options.push(falseOption);
            }
        }
        
        options.sort(() => Math.random() - 0.5); // Shuffle options
        
        questions.push({
            morse: correctMorse,
            answer: correctChar,
            options: options
        });
    }
    return questions;
}


function nextTriviaQuestion() {
    document.getElementById('trivia-feedback').textContent = '';
    document.getElementById('next-trivia').classList.add('hidden');
    document.getElementById('trivia-options').classList.remove('pointer-events-none');
    
    if (currentQuestionIndex >= triviaQuestions.length) {
        showResults();
        return;
    }
    
    const question = triviaQuestions[currentQuestionIndex];
    document.getElementById('trivia-question-num').textContent = getLocalizedText('TRIVIA_QUESTION_NUM', currentQuestionIndex + 1, triviaQuestions.length);
    document.getElementById('morse-display').textContent = question.morse;
    
    const optionsContainer = document.getElementById('trivia-options');
    optionsContainer.innerHTML = '';

    question.options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        // Clases fijas para tema oscuro
        btn.className = 'option-btn py-3 px-4 rounded-lg font-bold text-lg text-white bg-slate-700 hover:bg-slate-600 transition duration-150';
        btn.onclick = () => checkTriviaAnswer(option, question.answer, btn);
        optionsContainer.appendChild(btn);
    });
    
    playCurrentMorse(); 
}

function checkTriviaAnswer(selected, correct, button) {
    document.getElementById('trivia-options').classList.add('pointer-events-none'); // Deshabilitar botones
    document.querySelectorAll('.option-btn').forEach(btn => btn.disabled = true);
    
    const feedback = document.getElementById('trivia-feedback');
    const correctButton = Array.from(document.querySelectorAll('.option-btn')).find(b => b.textContent === correct);
    
    if (selected === correct) {
        triviaCorrectCount++;
        updateScore(10);
        feedback.textContent = getLocalizedText('TRIVIA_FEEDBACK_CORRECT');
        feedback.classList.remove('text-red-400');
        feedback.classList.add('text-emerald-400');
        button.classList.remove('bg-slate-700', 'hover:bg-slate-600');
        button.classList.add('bg-emerald-600');
    } else {
        feedback.textContent = getLocalizedText('TRIVIA_FEEDBACK_INCORRECT') + correct;
        feedback.classList.remove('text-emerald-400');
        feedback.classList.add('text-red-400');
        button.classList.remove('bg-slate-700', 'hover:bg-slate-600');
        button.classList.add('bg-red-600');
        
        if (correctButton) {
            correctButton.classList.add('bg-emerald-500');
        }
    }
    
    document.getElementById('next-trivia').classList.remove('hidden');
    currentQuestionIndex++;
}

// =================================================================
// 7. RESULTADOS (Se mantiene igual)
// =================================================================
// ... (showResults) ...

function showResults() {
    const totalQuestions = triviaQuestions.length;
    const accuracy = triviaCorrectCount / totalQuestions;
    const message = document.getElementById('results-message');
    
    document.getElementById('results-title').textContent = getLocalizedText('RESULTS_TITLE');
    document.getElementById('final-score').textContent = `+${triviaCorrectCount * 10}`;
    
    if (accuracy === 1) {
        message.textContent = getLocalizedText('RESULTS_MESSAGE_EXCELLENT');
        saveCourseProgress(currentCourseIndex, true);
        message.classList.remove('text-red-400', 'text-purple-400');
        message.classList.add('text-emerald-400');
    } else if (accuracy >= 0.75) {
        message.textContent = getLocalizedText('RESULTS_MESSAGE_GOOD');
        message.classList.remove('text-red-400', 'text-emerald-400');
        message.classList.add('text-purple-400');
    } else {
        message.textContent = getLocalizedText('RESULTS_MESSAGE_OK');
        message.classList.remove('text-purple-400', 'text-emerald-400');
        message.classList.add('text-red-400');
    }
    
    saveCourseProgress(currentCourseIndex, accuracy >= 0.75);

    showPhase('results');
}

// =================================================================
// 8. REFERENCIA (Se mantiene igual)
// =================================================================
// ... (renderReferenceGrid) ...

function renderReferenceGrid() {
    const lettersGrid = document.getElementById('ref-letters-grid');
    const numbersGrid = document.getElementById('ref-numbers-grid');
    lettersGrid.innerHTML = '';
    numbersGrid.innerHTML = '';
    
    const allChars = Object.keys(morseCode).sort();
    
    allChars.forEach(char => {
        const morse = morseCode[char];
        
        const charItem = document.createElement('div');
        charItem.className = `morse-item p-2 rounded-lg text-center cursor-pointer transition duration-300 bg-slate-800 hover:bg-slate-700`;
        charItem.innerHTML = `<p class="text-xl font-bold text-purple-400">${char}</p><p class="text-xs font-mono text-emerald-400">${morse}</p>`;
        
        charItem.onclick = () => {
            document.getElementById('ref-display-char').textContent = char;
            document.getElementById('current-morse').textContent = morse;
            playMorseWord(char); 
        }

        if (char.match(/[A-Z.,?/-]/i)) {
            lettersGrid.appendChild(charItem);
        } else if (char.match(/[0-9]/)) {
            numbersGrid.appendChild(charItem);
        }
    });

    const initialChar = allChars[0];
    document.getElementById('ref-display-char').textContent = initialChar;
    document.getElementById('current-morse').textContent = morseCode[initialChar];
}


// =================================================================
// 9. FUNCIONES DE DESAFÍO GLOBAL (NUEVO)
// =================================================================

function startChallenge() {
    challengeScore = 0;
    challengeErrors = 0;
    challengeTimeLeft = CHALLENGE_DURATION;
    
    document.getElementById('challenge-setup').classList.add('hidden');
    document.getElementById('challenge-game').classList.remove('hidden');
    document.getElementById('challenge-results').classList.add('hidden');
    
    updateChallengeDisplay();
    nextChallengeWord();
    
    // Iniciar el temporizador
    clearInterval(challengeTimer);
    challengeTimer = setInterval(() => {
        challengeTimeLeft--;
        updateChallengeDisplay();
        
        if (challengeTimeLeft <= 0) {
            endChallenge();
        }
    }, 1000);
}

function updateChallengeDisplay() {
    const minutes = Math.floor(challengeTimeLeft / 60);
    const seconds = challengeTimeLeft % 60;
    const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    document.getElementById('challenge-timer').textContent = timeString;
    document.getElementById('challenge-score').textContent = challengeScore;
    document.getElementById('challenge-errors').textContent = challengeErrors;
    
    if (challengeErrors >= 3) {
        endChallenge();
    }
}

function nextChallengeWord() {
    document.getElementById('challenge-feedback').textContent = '';
    document.getElementById('challenge-options').classList.remove('pointer-events-none');
    
    // 1. Elegir una palabra aleatoria
    challengeWord = getRandomElement(CHALLENGE_WORDS);
    
    // 2. Mostrar la secuencia Morse de la palabra
    const morseDisplay = challengeWord.split('').map(char => morseCode[char] || '').join(' / ');
    document.getElementById('challenge-morse').textContent = morseDisplay;

    // 3. Generar 4 opciones (la palabra correcta y 3 falsas)
    challengeOptions = [challengeWord];
    
    while (challengeOptions.length < 4) {
        let fakeWord = generateFakeChallengeWord(challengeWord.length);
        if (!challengeOptions.includes(fakeWord)) {
            challengeOptions.push(fakeWord);
        }
    }
    
    challengeOptions.sort(() => Math.random() - 0.5); // Barajar opciones

    // 4. Renderizar botones
    const optionsContainer = document.getElementById('challenge-options');
    optionsContainer.innerHTML = '';
    
    challengeOptions.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option;
        btn.className = 'challenge-option-btn py-3 px-4 rounded-lg font-bold text-lg text-white bg-slate-700 hover:bg-slate-600 transition duration-150';
        btn.onclick = () => checkChallengeAnswer(option);
        optionsContainer.appendChild(btn);
    });
    
    // 5. Reproducir el audio
    playMorseWord(challengeWord);
}

// Función para generar una palabra falsa de la misma longitud
function generateFakeChallengeWord(length) {
    let fakeWord = '';
    for (let i = 0; i < length; i++) {
        fakeWord += getRandomElement(ALL_CHARS);
    }
    return fakeWord;
}

function checkChallengeAnswer(selectedAnswer) {
    document.getElementById('challenge-options').classList.add('pointer-events-none');
    const feedback = document.getElementById('challenge-feedback');
    
    // Desactivar botones para evitar múltiples clics
    document.querySelectorAll('.challenge-option-btn').forEach(btn => btn.disabled = true);

    const selectedButton = Array.from(document.querySelectorAll('.challenge-option-btn')).find(b => b.textContent === selectedAnswer);
    const correctButton = Array.from(document.querySelectorAll('.challenge-option-btn')).find(b => b.textContent === challengeWord);
    
    if (selectedAnswer === challengeWord) {
        challengeScore++;
        updateScore(20); // Más puntos por ser un desafío
        
        feedback.textContent = `¡CORRECTO! +20`;
        feedback.classList.remove('text-red-400');
        feedback.classList.add('text-emerald-400');
        selectedButton.classList.remove('bg-slate-700');
        selectedButton.classList.add('bg-emerald-600');
        
        // Esperar un momento y pasar a la siguiente
        setTimeout(nextChallengeWord, 1000);
        
    } else {
        challengeErrors++;
        
        feedback.textContent = `¡ERROR! La palabra era ${challengeWord}`;
        feedback.classList.remove('text-emerald-400');
        feedback.classList.add('text-red-400');
        selectedButton.classList.remove('bg-slate-700');
        selectedButton.classList.add('bg-red-600');
        if (correctButton) {
            correctButton.classList.add('bg-emerald-500');
        }

        updateChallengeDisplay(); // Actualiza el contador de errores

        // Si fallaste, espera más tiempo y luego pasa a la siguiente (o termina si 3 errores)
        if (challengeErrors < 3) {
            setTimeout(nextChallengeWord, 2000);
        }
    }
}

function endChallenge() {
    clearInterval(challengeTimer);
    
    document.getElementById('challenge-game').classList.add('hidden');
    document.getElementById('challenge-results').classList.remove('hidden');
    
    document.getElementById('challenge-end-title').textContent = getLocalizedText('CHALLENGE_END_TITLE');
    document.getElementById('challenge-end-score').textContent = `${getLocalizedText('STATS_SCORE_LABEL')}: ${challengeScore * 20}`;
    document.getElementById('challenge-end-back-btn').textContent = getLocalizedText('CHALLENGE_END_BACK_BTN');
    
    let performanceMsg;
    if (challengeErrors === 0 && challengeScore > 5) {
        performanceMsg = getLocalizedText('CHALLENGE_END_PERFORMANCE_A');
    } else if (challengeErrors <= 1 && challengeScore > 3) {
        performanceMsg = getLocalizedText('CHALLENGE_END_PERFORMANCE_B');
    } else if (challengeScore > 1) {
        performanceMsg = getLocalizedText('CHALLENGE_END_PERFORMANCE_C');
    } else {
        performanceMsg = getLocalizedText('CHALLENGE_END_PERFORMANCE_D');
    }
    
    document.getElementById('challenge-end-performance').textContent = performanceMsg;
}

// =================================================================
// 10. INICIO DEL JUEGO Y GESTIÓN DE AUDIO (Se mantiene igual)
// =================================================================

function playClickSound() {
    if (!clickSound) return;
    clickSound.volume = SETTINGS.volumeClick / 100;
    const clickClone = clickSound.cloneNode(); 
    clickClone.play().catch(e => console.error("Error al reproducir el click:", e));
}

function setButtonClickListeners() {
    document.querySelectorAll('.nav-btn, button').forEach(btn => {
        if (!btn.disabled && btn.id !== 'btn-test-morse') { 
            btn.removeEventListener('click', playClickSound); 
            btn.addEventListener('click', playClickSound);
        }
    });

    if (document.getElementById('volume-music')) {
        document.getElementById('volume-music').addEventListener('input', (e) => updateVolume('music', e.target.value));
        document.getElementById('volume-click').addEventListener('input', (e) => updateVolume('click', e.target.value));
        document.getElementById('volume-morse').addEventListener('input', (e) => updateVolume('morse', e.target.value));
        document.getElementById('morse-speed').addEventListener('input', (e) => updateMorseSpeed(e.target.value)); 
        document.getElementById('font-size').addEventListener('input', (e) => applyFontSize(e.target.value));
    }
}


function initGame() {
    initializeAudioElements(); 
    loadSettings(); 
    loadHighScore(); 
    
    document.getElementById('interface-language-select').value = interfaceLanguage;
    updateInterfaceTexts(); 
    
    showPhase('reference'); 
    updateLevelDisplay();
    
    setButtonClickListeners(); 
    
    document.addEventListener('click', function startAudio() {
        const context = getAudioContext();
        if (context.state === 'suspended') {
            context.resume();
        }
        
        if (backgroundMusic) {
            const playPromise = backgroundMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    document.removeEventListener('click', startAudio);
                }).catch(error => {
                    console.log("Audio play blocked, waiting for next user interaction.");
                });
            }
        }
    }, { once: true }); 
}

window.onload = initGame;