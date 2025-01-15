import { n } from "./constants.js"


Array.prototype.shuffle = function () {
    let curI = this.length;

    while (curI != 0) {
        let randomI = Math.floor(Math.random() * curI);
        curI--;

        let temp = this[randomI];
        this[randomI] = this[curI];
        this[curI] = temp;
    }
}

export function generateSquares() {
    let board = Array.from({ length: n, }, () => Array(n).fill(0));

    let result = solve(board);

    return result;
}

export function isValidPlace(board, r, c, num) {
    for (let row = 0; row < n; row++) {
        if (board[row][c] === num) return false;
    }
    for (let col = 0; col < n; col++) {
        if (board[r][col] === num) return false;
    }
    return true;
}

export function solve(board) {
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (board[r][c] == 0) {
                let nums = Array.from({ length: n }, (_, i) => i + 1);
                nums.shuffle();


                for (let num of nums) {
                    if (isValidPlace(board, r, c, num)) {
                        board[r][c] = num;

                        let solution = solve(board);
                        if (solution != null) return solution;

                        board[r][c] = 0;
                    }
                }
                return null;
            }
        }
    }
    return board;
}