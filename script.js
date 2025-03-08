// Game state variables
let currentSentence = "";
let score = 0;
let hasScored = false;
let customSentences = [];
let currentSentenceBank = "default";
let gameStarted = false;
let gameComplete = false;
let ttsSetting = false;  // Default TTS setting is off

const sentences = [  
    "What time do you wake up in the morning?",  
    "Do you brush your teeth in the morning?",  
    "Do you eat breakfast before leaving the house?",  
    "Do you take a shower in the morning?",  
    "Do you make your bed after waking up?",  
    "Do you drink coffee or tea in the morning?",  
    "Do you check your phone when you wake up?",  
    "Do you get dressed immediately after waking up?",  
    "Do you say 'good morning' to anyone when you wake up?",  
    "Do you have a morning routine?",  
    "How do you feel when you wake up in the morning?",  
    "Do you like to listen to music while getting ready in the morning?",  
    "Do you plan your day in the morning?",  
    "Do you prefer a quiet morning or a busy one?",  
    "What’s the first thing you do when you wake up?",  
    "Do you ever skip breakfast in the morning?",  
    "Do you exercise in the morning?",  
    "Do you have any pets that you take care of in the morning?",  
    "Do you have any morning rituals?",  
    "How long does it take you to get ready in the morning?",  
    "Do you have any strategies to make your mornings more efficient?",  
    "How do you handle mornings when you feel tired?",  
    "Do you prepare your clothes the night before or in the morning?",  
    "Do you check the weather forecast in the morning?",  
    "How do you prioritize your tasks in the morning?",  
    "Do you eat a healthy breakfast in the morning?",  
    "How do you ensure you’re punctual for your morning commitments?",  
    "Do you prefer to have breakfast alone or with others?",  
    "How does your morning routine differ on weekends?",
    "What comes to mind when you hear the word ‘life’?",  
    "Do you enjoy life?",  
    "What life-changing moments have you had in your life?",  
    "Have you led an easy or difficult life?",  
    "Do you think there’s life after death?",  
    "Do you think there’s life on Mars or on other planets?",  
    "Do you ever feel you have wasted your life?",  
    "Would you like to live your same life all over again?",  
    "What’s your love life like?",  
    "Is life more similar to a pizza or a box of chocolates?",  
    "What is the meaning of life?",  
    "What’s your biggest goal in life?",  
    "Is life complicated?",  
    "What word would you use to sum up your life?",  
    "Do you have a good quality of life?",  
    "If life came with an instruction manual, what would it say?",  
    "Who has been your biggest influence in life?",  
    "What will life be like fifty years from now?",  
    "What does life taste, smell, feel, look and sound like?",  
    "If you could live someone else’s life, whose would it be and why?",  
    "What time do you usually wake up in the morning?",  
    "What do you usually eat for breakfast?",  
    "What is your daily routine like? Can you describe it step by step?",  
    "What time do you usually have dinner? What do you eat?",  
    "What time do you usually go to bed at night? Do you have a bedtime routine?",  
    "Do you like to read or watch something before going to bed? What do you like to read or watch?",  
    "What is something that you do in your daily life without fail?",  
    "What are some typical meals you have in a day? Describe your favourite one.",  
    "How do you usually travel to work? Do you walk, take a bus, or drive?",  
    "How do you relax after a long day?",  
    "Are there any specific activities or hobbies you do on weekends?",  
    "Do you have a favorite place you like to visit regularly?",  
    "How do you plan your day or week to make sure you get everything done?",  
    "Who is your favorite celebrity?",  
    "How do you like to celebrate your birthday?",  
    "Have you ever seen a celebrity in person? What did you do?",  
    "Which celebrity would you like to meet? What would you do if you could spend a day with this person?",  
    "Do you think famous people have the right to have a private life?",  
    "Do you think it's moral to sell your private life to the media?",  
    "Do you have enough free time?",  
    "Do you have free time on Sundays?",  
    "Do you have much free time during the day?",  
    "Do you have much free time in the evenings?",  
    "Do you have much free time in the mornings?",  
    "Do you like to watch movies?",  
    "What are you doing this weekend?",  
    "What did you do last summer vacation?",  
    "What did you do last weekend?",  
    "What do you do in your free time?",  
    "What hobbies do you have?",  
    "When do you have free time?",  
    "Where do you spend your free time?",  
    "Who do you spend your free time with?",  
    "How do you like to spend your free time?"  
];

function loadSettings() {
    try {
        const savedBank = localStorage.getItem('sentenceBank');
        const savedSentences = localStorage.getItem('customSentences');
        const savedTTSSetting = localStorage.getItem('ttsSetting');
        
        if (savedBank) {
            currentSentenceBank = savedBank;
            document.getElementById('sentenceSource').value = savedBank;
        }
        
        if (savedSentences) {
            customSentences = JSON.parse(savedSentences);
        }
        
        if (savedTTSSetting !== null) {
            ttsSetting = savedTTSSetting === 'true';
            updateTTSToggleButton();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
        // Reset to defaults if there's an error
        currentSentenceBank = "default";
        customSentences = [];
        ttsSetting = false;
    }
}

function saveSettings() {
    const source = document.getElementById('sentenceSource').value;
    const sentences = document.getElementById('customSentences').value
        .split('\n')
        .filter(s => s.trim());
    
    if (source === 'custom' && sentences.length < 5) {
        alert('Please enter at least 5 sentences for the custom sentence bank.');
        document.getElementById('sentenceSource').value = currentSentenceBank;
        return;
    }
    
    currentSentenceBank = source;
    customSentences = sentences;
    
    try {
        localStorage.setItem('sentenceBank', source);
        localStorage.setItem('customSentences', JSON.stringify(sentences));
        document.getElementById('settingsModal').style.display = 'none';
        
        // Only get a new sentence if the game is in progress and not complete
        if (gameStarted && !gameComplete) {
            newSentence();
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Failed to save settings. Please try again.');
    }
}

function toggleTTS() {
    ttsSetting = !ttsSetting;
    localStorage.setItem('ttsSetting', ttsSetting);
    updateTTSToggleButton();
}

function updateTTSToggleButton() {
    const ttsButton = document.getElementById('ttsToggle');
    if (ttsSetting) {
        ttsButton.textContent = "Voice: ON";
        ttsButton.classList.add('active');
    } else {
        ttsButton.textContent = "Voice: OFF";
        ttsButton.classList.remove('active');
    }
}

// TTS function to speak text
function speakText(text) {
    // Cancel any ongoing speech
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower rate for clarity
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    window.speechSynthesis.speak(utterance);
}

// Speak word function - depends on ttsSetting
function speakWord(text) {
    if (!ttsSetting) return;
    speakText(text);
}

function getCurrentSentences() {
    return currentSentenceBank === 'custom' && customSentences.length > 0 
        ? customSentences 
        : sentences;  
}

function startGame() {
    gameStarted = true;
    gameComplete = false;
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('checkButton').style.display = 'inline';
    document.getElementById('skipButton').style.display = 'inline';
    document.getElementById('settingsButton').style.display = 'none';
    document.getElementById('directions').style.display = 'none';
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    newSentence();
}

function newSentence() {
    if (gameComplete) return;
    
    // Show check and skip buttons for the new sentence
    document.getElementById('checkButton').style.display = 'inline';
    document.getElementById('skipButton').style.display = 'inline';
    
    // Hide next sentence and speak sentence buttons
    document.getElementById('nextSentenceButton').style.display = 'none';
    document.getElementById('speakSentenceButton').style.display = 'none';
    
    const sentences = getCurrentSentences();
    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];
    
    const words = currentSentence.split(/\s+/);
    const shuffledWords = [...words].sort(() => Math.random() - 0.5);
    
    const scrambledWordsDiv = document.getElementById('scrambledWords');
    scrambledWordsDiv.innerHTML = '';
    
    shuffledWords.forEach((word, index) => {
        const wordDiv = document.createElement('div');
        wordDiv.className = 'word';
        wordDiv.textContent = word;
        wordDiv.dataset.index = index;
        scrambledWordsDiv.appendChild(wordDiv);
    });
    
    document.getElementById('answerArea').innerHTML = '';
    selectedWords = [];
    hasScored = false;
    document.getElementById('feedback').textContent = '';
}

function checkAnswer() {
    const userAnswer = Array.from(document.getElementById('answerArea').children)
        .map(word => word.textContent)
        .join(' ');
    
    if (userAnswer.toLowerCase() === currentSentence.toLowerCase()) {
        if (!hasScored) {
            score++;
            hasScored = true;
            document.getElementById('score').textContent = `${score}`;
        }
        
        document.getElementById('feedback').textContent = '✨ Correct! ✨';
        
        // Hide check and skip buttons
        document.getElementById('checkButton').style.display = 'none';
        document.getElementById('skipButton').style.display = 'none';
        
        // Show the next sentence and speak sentence buttons
        document.getElementById('nextSentenceButton').style.display = 'inline';
        document.getElementById('speakSentenceButton').style.display = 'inline';
        
        // Mark game as complete but don't show victory modal yet if score is 5
        if (score >= 5) {
            gameComplete = true;
            // We've removed the showVictoryModal() call from here
        }
    } else {
        document.getElementById('feedback').textContent = '❌ Try again! ❌';
    }
}

function speakSentence() {
    // Always speak the sentence regardless of ttsSetting
    speakText(currentSentence);
}

async function showVictoryModal() {
    const modal = document.getElementById("victoryModal");
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();
    const pokemonImageDiv = document.getElementById("pokemonImage");
    const img = document.createElement("img");
    img.src = data.sprites.other["official-artwork"].front_default;
    img.alt = `${data.name} Pokemon artwork`;
    img.width = 300;
    img.height = 300;
    pokemonImageDiv.innerHTML = "";
    pokemonImageDiv.appendChild(img);
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("victoryModal").style.display = "none";
    resetGame();
}

function resetGame() {
    gameStarted = false;
    gameComplete = false;
    score = 0;
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('startButton').style.display = 'inline';
    document.getElementById('checkButton').style.display = 'none';
    document.getElementById('skipButton').style.display = 'none';
    document.getElementById('nextSentenceButton').style.display = 'none';
    document.getElementById('speakSentenceButton').style.display = 'none';
    document.getElementById('feedback').textContent = '';
    document.getElementById('scrambledWords').innerHTML = '';
    document.getElementById('answerArea').innerHTML = '';
    document.getElementById('settingsButton').style.display = 'inline';
}

function handleWordSelection(event) {
    if (!gameStarted || gameComplete) return;
    
    const clickedElement = event.target;
    if (!clickedElement.classList.contains('word')) return;
    
    const sourceArea = clickedElement.parentElement.id;
    const targetArea = sourceArea === 'scrambledWords' ? 'answerArea' : 'scrambledWords';
    
    document.getElementById(targetArea).appendChild(clickedElement);
    
    // If moving from scrambled words to answer area, speak the word (controlled by ttsSetting)
    if (sourceArea === 'scrambledWords') {
        speakWord(clickedElement.textContent);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    
    // Event Listeners
    document.getElementById('startButton').addEventListener('click', startGame);
    document.getElementById('checkButton').addEventListener('click', checkAnswer);
    document.getElementById('skipButton').addEventListener('click', newSentence);
    
    // Modified the nextSentenceButton event listener to check if victory modal should be shown
    document.getElementById('nextSentenceButton').addEventListener('click', () => {
        if (gameComplete) {
            showVictoryModal(); // Show victory modal when clicking "Next Sentence" after completing 5 sentences
        } else {
            newSentence();
        }
    });
    
    document.getElementById('speakSentenceButton').addEventListener('click', speakSentence);
    document.getElementById('ttsToggle').addEventListener('click', toggleTTS);
    document.getElementById('scrambledWords').addEventListener('click', handleWordSelection);
    document.getElementById('answerArea').addEventListener('click', handleWordSelection);
    
    // Add directions button handler
    document.getElementById('directionsButton').addEventListener('click', () => {
        const directions = document.getElementById('directions');
        directions.style.display = directions.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('settingsButton').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'block';
        document.getElementById('customSentences').value = customSentences.join('\n');
        document.getElementById('sentenceSource').value = currentSentenceBank;
    });
    
    document.getElementById('saveSettings').addEventListener('click', saveSettings);
    
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('settingsModal');
        const modalContent = modal.querySelector('.modal-content');
        if (event.target === modal && !modalContent.contains(event.target)) {
            modal.style.display = 'none';
        }
    });
    
    // Initialize TTS button state
    updateTTSToggleButton();
    
    // Check if browser supports speech synthesis
    if (!window.speechSynthesis) {
        document.getElementById('ttsToggle').style.display = 'none';
        document.getElementById('speakSentenceButton').style.display = 'none';
        console.error('Browser does not support speech synthesis');
    }
});
