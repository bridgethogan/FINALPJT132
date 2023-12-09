const canvas = document.getElementById('tetrisCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 30;

function drawBoard(board) {
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            }
        }
    }
}

function main() {
    const socket = new WebSocket('ws://' + window.location.host + '/ws');

    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        drawBoard(data.board);
    };
}

document.addEventListener('DOMContentLoaded', main);
