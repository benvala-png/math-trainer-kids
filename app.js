// Game state
let state = {
    level: 1,
    correct: 0,
    errors: 0,
    streakCorrect: 0,
    currentQuestion: null,
    maxNum: 20,
    operators: ['+', '-'],
    difficulty: 'Très facile'
};

// Difficulty levels based on correct answers
const difficulties = [
    { minCorrect: 0, maxNum: 20, operators: ['+', '-'], name: 'Très facile', text: 'Commence par des calculs faciles! 😊' },
    { minCorrect: 5, maxNum: 30, operators: ['+', '-'], name: 'Facile', text: 'Tu te débrouilles bien! Continue! 🌟' },
    { minCorrect: 10, maxNum: 40, operators: ['+', '-', '×'], name: 'Moyen', text: 'La multiplication arrive! 💪' },
    { minCorrect: 15, maxNum: 60, operators: ['+', '-', '×'], name: 'Difficile', text: 'Tu es un champion! 🏆' },
    { minCorrect: 20, maxNum: 100, operators: ['+', '-', '×', '÷'], name: 'Très difficile', text: 'Division aussi! Tu es un pro! 🚀' },
    { minCorrect: 30, maxNum: 100, operators: ['+', '-', '×', '÷'], name: 'Expert', text: 'Tu es un EXPERT EN MATHS! 👑' }
];

function updateDifficulty() {
    const difficulty = difficulties.find(d => state.correct >= d.minCorrect);
    if (difficulty) {
        state.level = difficulties.indexOf(difficulty) + 1;
        state.maxNum = difficulty.maxNum;
        state.operators = difficulty.operators;
        state.difficulty = difficulty.name;
        document.getElementById('difficultyText').textContent = difficulty.text;
    }
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * state.maxNum) + 1;
    const num2 = Math.floor(Math.random() * state.maxNum) + 1;
    const operator = state.operators[Math.floor(Math.random() * state.operators.length)];
    
    let question, answer;
    
    switch(operator) {
        case '+':
            question = `${num1} + ${num2}`;
            answer = num1 + num2;
            break;
        case '-':
            // Ensure non-negative results for 7-year-old
            const [a, b] = num1 >= num2 ? [num1, num2] : [num2, num1];
            question = `${a} - ${b}`;
            answer = a - b;
            break;
        case '×':
            const smaller1 = Math.floor(Math.random() * 12) + 1;
            const smaller2 = Math.floor(Math.random() * 12) + 1;
            question = `${smaller1} × ${smaller2}`;
            answer = smaller1 * smaller2;
            break;
        case '÷':
            const divisor = Math.floor(Math.random() * 12) + 1;
            const dividend = divisor * (Math.floor(Math.random() * 10) + 1);
            question = `${dividend} ÷ ${divisor}`;
            answer = dividend / divisor;
            break;
    }
    
    return { question, answer };
}

function displayQuestion() {
    state.currentQuestion = generateQuestion();
    document.getElementById('question').textContent = state.currentQuestion.question + ' = ?';
    document.getElementById('answer').value = '';
    document.getElementById('feedback').textContent = '';
    document.getElementById('answer').focus();
    updateDifficulty();
    updateUI();
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('answer').value);
    
    if (isNaN(userAnswer)) {
        document.getElementById('feedback').textContent = 'Écris un nombre! 🤔';
        document.getElementById('feedback').className = 'feedback incorrect';
        return;
    }
    
    if (userAnswer === state.currentQuestion.answer) {
        state.correct++;
        state.streakCorrect++;
        document.getElementById('feedback').textContent = '✅ Correct! Bravo! 🎉';
        document.getElementById('feedback').className = 'feedback correct';
        
        // Celebration emojis
        const emojis = ['🎉', '⭐', '🌟', '💫', '🎊'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        const celebration = document.createElement('div');
        celebration.className = 'emoji-celebration';
        celebration.textContent = emoji;
        celebration.style.position = 'fixed';
        celebration.style.top = '50%';
        celebration.style.left = '50%';
        celebration.style.zIndex = '1000';
        document.body.appendChild(celebration);
        setTimeout(() => celebration.remove(), 600);
        
        setTimeout(displayQuestion, 1500);
    } else {
        state.errors++;
        state.streakCorrect = 0;
        document.getElementById('feedback').textContent = `❌ Pas bon! La réponse est ${state.currentQuestion.answer}. Réessaye! 💪`;
        document.getElementById('feedback').className = 'feedback incorrect';
        document.getElementById('answer').value = '';
        setTimeout(() => {
            document.getElementById('answer').focus();
        }, 500);
    }
    
    updateUI();
}

function updateUI() {
    document.getElementById('correct').textContent = state.correct;
    document.getElementById('errors').textContent = state.errors;
    document.getElementById('level').textContent = state.level;
    document.getElementById('difficulty').textContent = state.difficulty;
    
    const total = state.correct + state.errors;
    const progressPercent = total > 0 ? (state.correct / total) * 100 : 0;
    document.getElementById('progressFill').style.width = progressPercent + '%';
}

function restartGame() {
    state = {
        level: 1,
        correct: 0,
        errors: 0,
        streakCorrect: 0,
        currentQuestion: null,
        maxNum: 20,
        operators: ['+', '-'],
        difficulty: 'Très facile'
    };
    displayQuestion();
}

// Allow Enter key to submit
document.getElementById('answer').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Start the game
displayQuestion();