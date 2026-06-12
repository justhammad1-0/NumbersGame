// ====== 1. مصفوفات الجمل المستفزة ======
const winMessages = [
    'Well, shit. You actually won. The number is {fuckinNumber}. Only took you {attempts} tries. Don\'t hurt your arm patting yourself on the back.',
    'Congratulations, you useless piece of— fine. You win. Number\'s {fuckinNumber}. {attempts} attempts. Took you long enough.',
    'Wow. You beat the game. {fuckinNumber}. {attempts} tries. Want a medal? They\'re out of stock.',
    'Holy shit. You actually guessed right. The number is {fuckinNumber}. {attempts} attempts. Don\'t quit your day job — oh wait, this IS your day job.',
    'Un-fucking-believable. You won. {fuckinNumber}. {attempts} tries. I\'d throw you a parade, but the clowns are already here — looking in the mirror.'
];

const higherMessages = [
    "Wrong. Pathetically wrong. The number is HIGHER. You're not even in the same postal code. Try again, champ.",
    "❌ Incorrect. The secret number is BIGGER. Your guess is like your self-esteem: embarrassingly low. One more attempt before I lose brain cells.",
    "Strike one. The number is HIGHER. Did you use a random number generator? Because a toddler throwing blocks would've done better.",
    "❌ Not even warm. The number is HIGHER. I've seen paralyzed sloths move faster than your brain right now. Guess again, genius.",
    "FAIL. The number is BIGGER. At this rate, we'll hit the heat death of the universe before you hit the right number. Try again."
];

const lowerMessages = [
    "❌ Nope. The number is LOWER. Your guess? Pathetic. Keep digging your own grave.",
    "Wrong! Go LOWER. You're shooting for the stars, tone it down a bit.",
    "Too high, big shot. The secret number is LOWER. Lower your expectations, just like your parents did.",
    "❌ Still too high. The number is LOWER. Did you confuse the game with a space launch? Come back to Earth.",
    "Nope. LOWER. Your guess is so high, I need an oxygen mask. Try again, mountaineer."
];

// جمل مستفزة إضافية عند نفاد المحاولات والخسارة
const loseMessages = [
    "💥 GAME OVER! You ran out of attempts. The number was {fuckinNumber}. Your streak is dead, just like your brain cells.",
    "Pathetic. You couldn't guess it in time. It was {fuckinNumber}. Back to zero, loser!",
    "You failed. The secret number was {fuckinNumber}. A goldfish would have guessed it by now.",
    "💥 Out of lives! The number was {fuckinNumber}. Say goodbye to your streak. Try switching to an easier game, like tic-tac-toe."
];

// ====== 2. صيد العناصر وإعدادات اللعبة ======
const guess2 = document.getElementById('guess');
const aBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn'); 
const message = document.getElementById('msg');
const minusBtn = document.getElementById('minus-btn');
const plusBtn = document.getElementById('plus-btn');
const directionIndicator = document.getElementById('direction-indicator');
const hintBtn = document.getElementById('hint-btn');
const gameContainer = document.querySelector('.game-container');
const playerRankElement = document.getElementById('player-rank');
const rangePicker = document.getElementById('range-picker');

const currentStreakElement = document.getElementById('current-streak');
const bestStreakElement = document.getElementById('best-streak');

// عنصر لعرض المحاولات المتبقية (تأكد من وجود عنصر في الـ HTML يحمل هذا الـ ID، أو سيقوم الكود بإنشائه ديناميكياً)
let attemptsLeftElement = document.getElementById('attempts-left');

let fuckinNumber;
let attempts = 0;
let maxAttempts = 7; // الحد الأقصى للمحاولات الافتراضي
let maxRange = 100;

let streak = 0;
let bestStreak = localStorage.getItem('bestStreak') ? Number(localStorage.getItem('bestStreak')) : 0;

let hintsAvailable = 1; 
let hintsUsedCount = 0; 

function updatePlayerRank() {
    if (streak >= 10) {
        playerRankElement.textContent = "The Legendary Thragg 💀";
        playerRankElement.style.color = "#ef4444"; 
    } else if (streak >= 6) {
        playerRankElement.textContent = "Master Mind 👑";
        playerRankElement.style.color = "#a855f7"; 
    } else if (streak >= 3) {
        playerRankElement.textContent = "Sharp Mind 🧠";
        playerRankElement.style.color = "#3b82f6"; 
    } else {
        playerRankElement.textContent = "Noob Guesser 😕";
        playerRankElement.style.color = "#7c7a8e"; 
    }
}

bestStreakElement.textContent = bestStreak;

// ====== 3. دالة بدء وتصفير اللعبة ديناميكياً ======
function initGame() {
    maxRange = Number(rangePicker.value); 
    fuckinNumber = Math.floor(Math.random() * maxRange) + 1;
    attempts = 0;    
    
    // حساب المحاولات المتاحة ديناميكياً بناءً على الصعوبة (المدى)
    if (maxRange <= 50) maxAttempts = 5;
    else if (maxRange <= 100) maxAttempts = 7;
    else maxAttempts = 10;

    guess2.placeholder = `1-${maxRange}`;
    guess2.value = Math.floor(maxRange / 2);
    message.textContent = "";
    
    aBtn.disabled = false; 
    aBtn.classList.remove('hidden'); 
    nextBtn.classList.add('hidden');
    nextBtn.textContent = "Next Round ➡️";

    // تحديث نص المحاولات المتبقية
    if (attemptsLeftElement) {
        attemptsLeftElement.textContent = `❤️ Attempts Left: ${maxAttempts}`;
        attemptsLeftElement.style.color = "#fff";
    }

    hintsUsedCount = 0;
    hintBtn.disabled = false;
    hintBtn.classList.remove('hidden');
    hintBtn.textContent = `💡 Hint (${hintsAvailable})`;
    
    console.log(`(Never click here Bosybody) New secret Number (1-${maxRange}):`, fuckinNumber);

    directionIndicator.textContent = "";
    directionIndicator.className = "hidden"; 
}

function handleManualRangeChange() {
    streak = 0; 
    currentStreakElement.textContent = streak;
    updatePlayerRank();
    initGame();
}

initGame();
rangePicker.addEventListener('change', handleManualRangeChange);
nextBtn.addEventListener('click', initGame);


// ====== 4. فحص التخمين عند الضغط على الزر ======
aBtn.addEventListener('click', function() {
    let userGuess = Number(guess2.value);
    
    if (!guess2.value || isNaN(userGuess) || userGuess < 1 || userGuess > maxRange) {
        message.textContent = `❌ Idiot! Enter a valid number between 1 and ${maxRange}.`;
        message.style.color = "#8b0000";
        
        gameContainer.classList.add('shake-effect');
        setTimeout(() => gameContainer.classList.remove('shake-effect'), 400);
        return;
    }

    attempts++;
    let remaining = maxAttempts - attempts;
    if (attemptsLeftElement) {
        attemptsLeftElement.textContent = `❤️ Attempts Left: ${remaining}`;
        if (remaining <= 2) {
            attemptsLeftElement.style.color = "#ef4444"; 
        }
    }

    let index5 = Math.floor(Math.random() * 5);
    let index4 = Math.floor(Math.random() * 4);

    if (userGuess === fuckinNumber) {
        let dynamicWin = winMessages[index5]
            .replace('{fuckinNumber}', fuckinNumber)
            .replace('{attempts}', attempts);

        if (attempts === 1) {
            hintsAvailable = 2; 
            dynamicWin += " 🔥 PERFECT ROUND! You get 2 Hints next round!";
        } else {
            hintsAvailable = 1; 
        }

        streak++;
        currentStreakElement.textContent = streak;
        updatePlayerRank(); 

        if (streak > bestStreak) {
            bestStreak = streak;
            bestStreakElement.textContent = bestStreak;
            localStorage.setItem('bestStreak', bestStreak); 
        }

        hintBtn.classList.add('hidden'); 
        message.textContent = dynamicWin;
        message.style.color = "rgba(9, 185, 50, 0.77)";
        directionIndicator.className = "hidden";
        
        confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 }
        });
        
        aBtn.disabled = true; 
        aBtn.classList.add('hidden');
        nextBtn.classList.remove('hidden');

        // [تعديل الحقوق عند الفوز هنا داخل الشرط الصحيح]
        if (typeof footerCredits !== 'undefined') {
            footerCredits.style.color = "rgba(74, 222, 128, 0.8)"; 
            footerCredits.style.opacity = "1";
        }
    }
    else {
        // إذا أخطأ ونفدت محاولاته بالكامل -> كسر الـ Streak وخسارة اللعبة
        if (attempts >= maxAttempts) {
            streak = 0; 
            currentStreakElement.textContent = streak;
            updatePlayerRank();

            let dynamicLose = loseMessages[index4].replace('{fuckinNumber}', fuckinNumber);
            message.textContent = dynamicLose;
            message.style.color = "#ef4444";
            
            directionIndicator.className = "hidden";
            hintBtn.classList.add('hidden');

            gameContainer.classList.add('shake-effect');
            setTimeout(() => gameContainer.classList.remove('shake-effect'), 400);

            aBtn.disabled = true; 
            aBtn.classList.add('hidden');
            nextBtn.textContent = "Try Again 🔄";
            nextBtn.classList.remove('hidden');

            // [تعديل الحقوق عند الخسارة هنا داخل الشرط الصحيح]
            if (typeof footerCredits !== 'undefined') {
                footerCredits.style.color = "#fb923c"; 
                footerCredits.style.opacity = "1";
            }
            return;
        }

        // إذا أخطأ وما زال لديه محاولات
        if (userGuess < fuckinNumber){
            message.textContent = higherMessages[index5];
            message.style.color = "#b84a00";
            
            directionIndicator.textContent = "▲ HIGHER";
            directionIndicator.className = "indicator-higher";
        }
        else {
            message.textContent = lowerMessages[index5];
            message.style.color = "#8b0000";
            
            directionIndicator.textContent = "▼ LOWER";
            directionIndicator.className = "indicator-lower";
        }
        
        gameContainer.classList.add('shake-effect');
        setTimeout(() => gameContainer.classList.remove('shake-effect'), 400);
    }
});

// ====== 5. دوال التحكم ======
function increaseNumber() {
    let currentValue = Number(guess2.value);
    if (currentValue < maxRange) {
        guess2.value = currentValue + 1;
    }
}

function decreaseNumber() {
    let currentValue = Number(guess2.value);
    if (currentValue > 1) {
        guess2.value = currentValue - 1;
    }
}

plusBtn.addEventListener('click', function() {
    increaseNumber();
    plusBtn.blur();
});

minusBtn.addEventListener('click', function() {
    decreaseNumber();
    minusBtn.blur();
});

document.addEventListener('keydown', function(event) {
    if (event.key === "ArrowUp") {
        event.preventDefault();
        increaseNumber(); 
    } 
    else if (event.key === "ArrowDown") {
        event.preventDefault();
        decreaseNumber();
    }
    else if (event.key === "Enter") {
        event.preventDefault();
        if (!aBtn.disabled && !aBtn.classList.contains('hidden')) {
            aBtn.click();
        } 
        else if (!nextBtn.classList.contains('hidden')) {
            nextBtn.click();
        }
    }
});

// ====== 6. منطق نظام التلميحات الذكية والمكافآت ======
hintBtn.addEventListener('click', function() {
    if (hintsUsedCount >= hintsAvailable) return; 

    hintsUsedCount++;
    
    let remainingHints = hintsAvailable - hintsUsedCount;
    hintBtn.textContent = `💡 Hint (${remainingHints})`;

    if (remainingHints === 0) {
        hintBtn.disabled = true; 
    }

    let possibleHints = [];

    if (fuckinNumber % 2 === 0) {
        possibleHints.push("💡 Hint: The secret number is an EVEN (زوجي) number.");
    } else {
        possibleHints.push("💡 Hint: The secret number is an ODD (فردي) number.");
    }

    if (fuckinNumber % 5 === 0) {
        possibleHints.push("💡 Hint: The secret number is a multiple of 5 (يقبل القسمة على 5).");
    }

    if (fuckinNumber % 3 === 0) {
        possibleHints.push("💡 Hint: The secret number is a multiple of 3 (يقبل القسمة على 3).");
    }

    let randomHintIndex = Math.floor(Math.random() * possibleHints.length);
    
    message.textContent = possibleHints[randomHintIndex];
    message.style.color = "var(--accent)"; 
});

// ====== 7. نظام تبديل الثيم (ليل / نهار) ======
const themeToggleBtn = document.getElementById('theme-toggle-btn');

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    themeToggleBtn.textContent = "🌙 Night Mode";
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        themeToggleBtn.textContent = "🌙 Night Mode";
        localStorage.setItem('theme', 'light'); 
    } else {
        themeToggleBtn.textContent = "☀️ Day Mode";
        localStorage.setItem('theme', 'dark');  
    }
});

// ====== 8. نظام عرض الحقوق ديناميكياً (Dotline Core Devs) ======
const footerCredits = document.createElement('div');
footerCredits.style.textAlign = 'center';
footerCredits.style.marginTop = '20px';
footerCredits.style.fontSize = '11px';
footerCredits.style.letterSpacing = '1px';
footerCredits.style.fontFamily = "sans-serif";
footerCredits.style.color = 'var(--text-muted)';
footerCredits.style.opacity = '0.6';
footerCredits.textContent = 'DEVELOPED BY HAMMAD | DOTLINE CORE DEVS';

// الانتظار حتى تحميل الـ DOM بالكامل لضمان الحقن السليم بدون أخطاء
document.addEventListener("DOMContentLoaded", function() {
    const targetContainer = document.querySelector('.game-container');
    if (targetContainer) {
        targetContainer.appendChild(footerCredits);
    }
});