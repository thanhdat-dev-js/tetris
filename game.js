const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
var a = 0
const point_width = 30;
const padding_point = 1;
const board_width = 20;
const board_height = 20;

const colorPick = [
    '#e5e5e5',
    '#e6521d',
    '#4150b6',
    '#fcec3c',
    '#a05ab2',
    '#66b04e',
    '#b73919',
    '#58b5c9'
]

canvas.width = board_width * point_width;
canvas.height = (board_height) * point_width;

class Tetromino {
    constructor(row, col, angle = 0) {
        this.row = row;
        this.col = col;
        this.angle = angle;
    }
    get shapes() {
        return this.constructor.list[this.angle];
    }
    get width() {
        return this.shapes[0].length;
    }
    get height() {
        return this.shapes.length;
    }
    fall() {
        this.row++;
    }

    move(direction) {
        if (direction == 'right') {
            this.col++;
        }
        else {
            this.col--;
        }
    }
    rotate(back) {
        this.angle = this.angle < 3 ? ++this.angle : 0;
        if (back) this.angle = this.angle == 0 ? 3 : --this.angle;
    }
}

class L extends Tetromino { };
L.list = [
    [
        [1, 0],
        [1, 0],
        [1, 1]
    ],

    [
        [1, 1, 1],
        [1, 0, 0]
    ],

    [
        [1, 1],
        [0, 1],
        [0, 1]
    ],

    [
        [0, 0, 1],
        [1, 1, 1]
    ]
];
class J extends Tetromino { };
J.list = [
    [
        [0, 2],
        [0, 2],
        [2, 2]
    ],
    [
        [2, 0, 0],
        [2, 2, 2]
    ],
    [
        [2, 2],
        [2, 0],
        [2, 0]
    ],
    [
        [2, 2, 2],
        [0, 0, 2]
    ]
];
class O extends Tetromino { };
O.list = [
    [[3, 3],
    [3, 3]],
    [[3, 3],
    [3, 3]],
    [[3, 3],
    [3, 3]],
    [[3, 3],
    [3, 3]]
]
class T extends Tetromino { };
T.list = [
    [[0, 4, 0],
    [4, 4, 4]],

    [[4, 0],
    [4, 4],
    [4, 0]],

    [[4, 4, 4],
    [0, 4, 0]],

    [[0, 4],
    [4, 4],
    [0, 4]]
]
class S extends Tetromino { };
S.list = [
    [[0, 5, 5],
    [5, 5, 0]],

    [[5, 0],
    [5, 5],
    [0, 5]],

    [[0, 5, 5],
    [5, 5, 0]],

    [[5, 0],
    [5, 5],
    [0, 5]]
]
class Z extends Tetromino { };
Z.list = [
    [[6, 6, 0],
    [0, 6, 6]],

    [[0, 6],
    [6, 6],
    [6, 0]],

    [[6, 6, 0],
    [0, 6, 6]],

    [[0, 6],
    [6, 6],
    [6, 0]]
]
class I extends Tetromino { };
I.list = [
    [[7],
    [7],
    [7],
    [7]],

    [[7, 7, 7, 7]],

    [[7],
    [7],
    [7],
    [7]],
    [[7, 7, 7, 7]]
]
class Game {
    constructor() {
        this.landedBoard = new Array(23).fill(0).map(() => new Array(10).fill(0));
        this.currentBoard = new Array(23).fill(0).map(() => new Array(10).fill(0));
        this.randomTetromino();
        this.gameover = false;
        this.interval = null;
        this.start();
    }
    start() {
        this.draw();
        this.interval = setInterval(() => {
            this.loop();
        }, 800);
    }

    draw() {
        for (let i = 3; i < 23; i++) {
            for (let j = 0; j < 10; j++) {
                ctx.fillStyle = colorPick[this.currentBoard[i][j]];
                ctx.fillRect(j * point_width + padding_point, (i - 3) * point_width + padding_point, point_width - padding_point * 2, point_width - padding_point * 2);
            }
        }
    }
    loop() {
        this.updateBoard();
        this.clear();
        this.draw();
    }
    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    };
    randomTetromino() {
        const rand = Math.floor(Math.random() * 7);
        switch (rand) {
            case 0:
                this.currentTet = new L(1, 4);
                break;
            case 1:
                this.currentTet = new J(1, 4);
                break;
            case 2:
                this.currentTet = new O(2, 4);
                break;
            case 3:
                this.currentTet = new T(2, 4);
                break;
            case 4:
                this.currentTet = new S(2, 4);
                break;
            case 5:
                this.currentTet = new Z(2, 4);
                break;
            case 6:
                this.currentTet = new I(0, 4);
                break;
            default:
                break;
        }
    }
    updateBoard() {
        for (let i = 0; i < 23; i++) {
            for (let j = 0; j < 10; j++) {
                this.currentBoard[i][j] = this.landedBoard[i][j];
            }
        }
        for (let i = 0; i < this.currentTet.height; i++) {
            for (let j = 0; j < this.currentTet.width; j++) {
                if (this.currentTet.shapes[i][j] > 0) {
                    this.currentBoard[i + this.currentTet.row][j + this.currentTet.col] = this.currentTet.shapes[i][j];
                }
            }
        }

        if (this.currentTet.row + this.currentTet.height < 23) {
            for (let i = 0; i < this.currentTet.height; i++) {
                for (let j = 0; j < this.currentTet.width; j++) {
                    try {
                        if (this.currentTet.shapes[i][j] > 0) {
                            if (this.landedBoard[1 + i + this.currentTet.row][j + this.currentTet.col] > 0) {
                                for (let i = 0; i < 23; i++) {
                                    for (let j = 0; j < 10; j++) {
                                        this.landedBoard[i][j] = this.currentBoard[i][j];
                                    }
                                }
                                this.currentBoard[i + this.currentTet.row][j + this.currentTet.col] = this.currentTet.shapes[i][j];
                                if (!this.gameover) this.randomTetromino();
                            }
                        }
                    } catch (error) {

                    }

                }
            }
            this.currentTet.fall();
        }
        else {
            for (let i = 0; i < 23; i++) {
                for (let j = 0; j < 10; j++) {
                    this.landedBoard[i][j] = this.currentBoard[i][j];
                }
            }
            if (!this.gameover) this.randomTetromino();
        }
        for (let j = 0; j < 10; j++) {
            if (this.landedBoard[3][j] > 0) {
                this.gameover = true;
                clearInterval(this.interval)
            };
        }
    }
}

var game = new Game();


var window_event = window.addEventListener('keydown', (e) => {
    if (game.gameover) return;
    if (e.key == 'ArrowLeft') {
        let isLeft = true;
        for (let i = 0; i < game.currentTet.height; i++) {
            for (let j = 0; j < game.currentTet.width; j++) {
                if (game.currentTet.shapes[i][j] > 0) {
                    if (game.landedBoard[i + game.currentTet.row][j + game.currentTet.col - 1] > 0 || game.currentTet.col == 0) {
                        isLeft = false;
                    }
                }
            }
        }
        if (isLeft) {
            game.currentTet.move('left');
            game.updateBoard();
            game.clear();
            game.draw();
        }
    }
    if (e.key == 'ArrowRight') {
        let isRight = true;
        for (let i = 0; i < game.currentTet.height; i++) {
            for (let j = 0; j < game.currentTet.width; j++) {
                if (game.currentTet.shapes[i][j] > 0) {
                    if (game.landedBoard[i + game.currentTet.row][j + game.currentTet.col + 1] > 0 || game.currentTet.col + game.currentTet.width == 10) {
                        isRight = false;
                    }
                }
            }
        }
        if (isRight) {
            game.currentTet.move('right')
            game.updateBoard();
            game.clear();
            game.draw();
        };
    }
    if (e.key == 'ArrowUp') {

        game.currentTet.rotate();
        game.updateBoard();
        game.clear();
        game.draw();

    }

    if (e.key == 'ArrowDown') {
        game.updateBoard();
        game.clear();
        game.draw();
    }
})