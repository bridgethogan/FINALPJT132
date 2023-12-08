$(document).ready(function(){
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    
    // Tetris game logic
    const canvas = document.getElementById('tetris-container');
    const context = canvas.getContext('2d');
    
    const ROWS = 20;
    const COLUMNS = 10;
    const BLOCK_SIZE = 30;
    
    let grid = createEmptyGrid();
    
    // Tetrominoes
    const tetrominoes = [
        [[1, 1, 1, 1]],
        [[1, 1, 1, 0], [1]],
        [[1, 1, 1, 0], [0, 0, 1]],
        [[1, 1, 1, 0], [0, 1]],
        // Add more tetrominoes
    ];
    
    let currentTetromino = getRandomTetromino();
    let currentRow = 0;
    let currentCol = Math.floor((COLUMNS - currentTetromino[0].length) / 2);
    
    function createEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
    }
    
    function getRandomTetromino() {
        const randomIndex = Math.floor(Math.random() * tetrominoes.length);
        return tetrominoes[randomIndex];
    }
    
    function drawTetromino() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    drawBlock(currentCol + col, currentRow + row);
                }
            }
        }
    }
    
    function drawBlock(col, row) {
        context.fillStyle = 'blue';  // Change color as needed
        context.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        context.strokeStyle = 'black';
        context.strokeRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
    
    function moveDown() {
        currentRow++;
        if (isCollision()) {
            currentRow--;
            mergeTetromino();
            checkForLineClear();
            spawnNewTetromino();
        }
        drawTetromino();
    }
    
    function mergeTetromino() {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (currentTetromino[row][col]) {
                    grid[currentRow + row][currentCol + col] = 1;
                }
            }
        }
    }
    
    function checkForLineClear() {
        for (let row = ROWS - 1; row >= 0; row--) {
            if (grid[row].every(cell => cell === 1)) {
                grid.splice(row, 1);
                grid.unshift(Array(COLUMNS).fill(0));
            }
        }
    }
    
    function spawnNewTetromino() {
        currentTetromino = getRandomTetromino();
        currentRow = 0;
        currentCol = Math.floor((COLUMNS - currentTetromino[0].length) / 2);
        if (isCollision()) {
            // Game over logic, handle as needed
            alert('Game Over!');
            resetGame();
        }
    }
    
    function isCollision() {
        for (let row = 0; row < currentTetromino.length; row++) {
            for (let col = 0; col < currentTetromino[row].length; col++) {
                if (
                    currentTetromino[row][col] &&
                    (grid[currentRow + row] && grid[currentRow + row][currentCol + col]) !== undefined
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    
    function resetGame() {
        grid = createEmptyGrid();
        drawTetromino();
    }
    
    // Keyboard controls
    $(document).keydown(function(e){
        switch(e.which) {
            case 37: // left
                currentCol--;
                if (isCollision()) currentCol++;
                drawTetromino();
                break;
    
            case 38: // up
                // Rotate tetromino
                break;
    
            case 39: // right
                currentCol++;
                if (isCollision()) currentCol--;
                drawTetromino();
                break;
    
            case 40: // down
                moveDown();
                break;
    
            default:
                break;
        }
    });
    
    drawTetromino();
});
