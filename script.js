document.addEventListener('DOMContentLoaded', () => {
    let wordList = [];

    fetch('https://api.datamuse.com/words?sp=?????')
        .then(response => response.json())
        .then(data => {
            wordList = data.map(word => word.word);
            startNewGame();
        })
        .catch(err => console.error(err));

    let answer;
    let currentRow = 0;

    function startNewGame() {
        answer = wordList[Math.floor(Math.random() * wordList.length)];
        currentRow = 0;
        resetBoard();
    }

    function resetBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                row.appendChild(tile);
            }
            board.appendChild(row);
        }
    }

    document.getElementById('submitGuess').addEventListener('click', submitGuess);

    function submitGuess() {
        const guessInput = document.getElementById('guessInput');
        const guess = guessInput.value.toLowerCase();
        if (guess.length !== 5) {
            showMessage('Please enter a 5-letter word.');
            return;
        }

        const board = document.getElementById('board');
        const row = board.children[currentRow];
        row.innerHTML = '';

        guess.split('').forEach((letter, index) => {
            const tile = document.createElement('div');
            tile.classList.add('tile');

            if (letter === answer[index]) {
                tile.classList.add('correct');
            } else if (answer.includes(letter)) {
                tile.classList.add('present');
            } else {
                tile.classList.add('absent');
            }

            tile.textContent = letter;
            row.appendChild(tile);
        });

        guessInput.value = '';

        if (guess === answer) {
            showMessage('Congratulations! You guessed the word!', 'green');
            endGame();
        } else if (++currentRow === 5) {
            showMessage(`Game over! The word was: ${answer}`);
            endGame();
        }
    }

    function showMessage(msg, color = 'red') {
        const message = document.getElementById('message');
        message.textContent = msg;
        message.style.color = color;
    }

    function endGame() {
        document.getElementById('guessInput').disabled = true;
        document.getElementById('submitGuess').disabled = true;
        document.getElementById('guessInput').style.display = 'none'
        document.getElementById('submitGuess').style.display = 'none'
        document.getElementById('startNewGame').style.display = 'inline';
    }

    document.getElementById('startNewGame').addEventListener('click', () => {
        startNewGame();
        document.getElementById('guessInput').disabled = false;
        document.getElementById('submitGuess').disabled = false;
        document.getElementById('guessInput').style.display = 'inline'
        document.getElementById('submitGuess').style.display = 'inline'
        document.getElementById('startNewGame').style.display = 'none';
        showMessage('');
    });
});


document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submitGuess').click();
    }
});