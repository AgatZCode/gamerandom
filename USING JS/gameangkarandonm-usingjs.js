//credit : AgatZ
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveGame(data) {
    fs.writeFileSync('save.json', JSON.stringify(data));
}

function loadGame() {
    try {
        const data = fs.readFileSync('save.json');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

function startGame(computer, score, winningScore, level, highestLevel, timeLimit, reset, achievements) {
    rl.question("Masukkan angka : ", (input) => {
        if (!Number.isInteger(parseInt(input)) || parseInt(input) < 1 || parseInt(input) > 9) {
            console.log("Masukkan angka valid antara 1 dan 9.");
            startGame(computer, score, winningScore, level, highestLevel, timeLimit, reset, achievements);
            return;
        }

        const elapsedSeconds = (new Date().getTime() - startTime) / 1000;

        if (parseInt(input) === computer) {
            console.log(`Menang! Angka yang benar adalah ${computer}`);
            score += winningScore * level;

            //untuklevelup jika menang banyak bisa mendapatkan beberapa poin lagi dari elvel up ini
            if (level % 4 === 0) {
                const powerUpPoints = getRandomNumber(10, 30);
                score += powerUpPoints;
                console.log(`Level Power-Up! Anda mendapatkan ${powerUpPoints} tambahan poin.`);
            }

            reset = 3;
            level += 1;
            highestLevel = Math.max(highestLevel, level);

            if (level === 5 && !achievements.includes('Level 5 Clear')) {
                console.log('Achievement Unlocked: Level 5 Clear');
                achievements.push('Level 5 Clear');
            }
        } else {
            console.log(`Salah! Angka yang benar adalah ${computer}`);
            score -= 5;
            reset -= 1;
        }

        console.log(`Skor Anda: ${score}`);

        if (level % 3 === 0) {
            timeLimit += 5;
        }

        if (level <= highestLevel) {
            console.log(`Level tertinggi yang dicapai: ${highestLevel}`);
        }

        if (reset > 0) {
            console.log(`Tersisa ${reset} kesempatan lagi.`);
            console.log(`Anda memiliki waktu ${timeLimit} detik untuk menebak.`);
            startGame(getRandomNumber(1, 9), score, winningScore, level, highestLevel, timeLimit, reset, achievements);
        } else {
            const dataToSave = {
                score: score,
                reset: reset,
                level: level,
                highestLevel: highestLevel,
                achievements: achievements
            };
            saveGame(dataToSave);
            rl.close();
        }
    });
}

function playGame() {
    let score = 0;
    let reset = 3;
    let winningScore = 20;
    let level = 1;
    let highestLevel = 1;
    let timeLimit = 10;
    let achievements = [];

    const savedData = loadGame();
    if (savedData) {
        score = savedData.score;
        reset = savedData.reset;
        level = savedData.level;
        highestLevel = savedData.highestLevel;
        achievements = savedData.achievements;
    }

    console.log("Welcome to Game");
    console.log("Rules: Saat kamu salah menebak, skor akan dikurangkan -5. Hati-hati!\n");

    console.log(`====== GAME LEVEL ${level} ======`);
    console.log("Tebak random (1-9)");
    const computer = getRandomNumber(1, 9);
    const startTime = new Date().getTime();
    startGame(computer, score, winningScore, level, highestLevel, timeLimit, reset, achievements);
}

playGame();
