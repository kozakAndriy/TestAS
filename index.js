
import { generateSquares, isValidPlace, solve } from "./lib/lat_sq.js"
import { n } from "./lib/constants.js"

let table = document.getElementById("table");
table.setAttribute("class", "mx-auto")

let resetButton = document.getElementById("reset");
let checkButton = document.getElementById("check");
let input = document.getElementById("answer_input");

let squares = null;
let answer = null;

checkButton.onclick = function () {
    let guess = input.value.toUpperCase();

    if (guess.charCodeAt(0) - 'A'.charCodeAt(0) + 1 == answer) {
        input.setAttribute("isCorrect", "true");
    }
    else {
        input.setAttribute("isCorrect", "false");
    }
}

let showAnswerButton = document.getElementById("show_answer_button");
let showAnswerField = document.getElementById("show_answer_field");
let showingAnswer = false;
showAnswerButton.onclick = function () {
    showAnswerField.innerHTML = "";
    showingAnswer = !showingAnswer;

    if (!showingAnswer) {
        return;
    }

    let answerElement = document.createElement("h1");
    answerElement.innerHTML = `Answer: ${String.fromCharCode('A'.charCodeAt(0) + answer - 1)}`;

    showAnswerField.appendChild(answerElement);
}

resetButton.onclick = function () {
    table.innerHTML = '';
    showingAnswer = false;
    input.value = "";
    input.removeAttribute("isCorrect");
    showAnswerField.innerHTML = "";

    squares = generateSquares();

    let answerRow = Math.floor(Math.random() * n);
    let answerCol = Math.floor(Math.random() * n);
    answer = squares[answerRow][answerCol];

    squares = removeSomeSquares(answerRow, answerCol);
    squares[answerRow][answerCol] = 0;

    for (let r = 0; r < n; r++) {
        let row = document.createElement("tr");
        for (let c = 0; c < n; c++) {
            let cell = document.createElement("td");


            cell.innerHTML = r == answerRow && c == answerCol ?
                "???" : squares[r][c] === 0 ? " " : String.fromCharCode('A'.charCodeAt(0) + squares[r][c] - 1);

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function removeSomeSquares(answerRow, answerCol) {
    // leave 2 letters on the same axis as the answer
    // take ~5 letters
    let crossCount = 2 * n - 1 - 2;
    let otherCount = 5;

    let board = squares.map(a => a.map(e => e));
    let answer = board[answerRow][answerCol];

    function isTheOnlyAnswer() {

        for (let ans = 1; ans <= n; ans++) {
            if (!isValidPlace(board, answerRow, answerCol, ans)) continue;
            board[answerRow][answerCol] = ans;

            let canSolve = solve(board.map(a => a.map(e => e))) !== null;

            if ((ans === answer && !canSolve) || (ans !== answer && canSolve)) {
                board[answerRow][answerCol] = answer;
                return false;
            }

            board[answerRow][answerCol] = answer;
        }
        return true;
    }

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (r == answerRow && c == answerCol) continue;
            if (board[r][c] !== 0) {
                let isCross = (c == answerCol || r == answerRow);
                let squaresLeft = isCross ? crossCount : otherCount;

                if (squaresLeft > 0) {
                    let t = board[r][c];
                    board[r][c] = 0;
                    if (isTheOnlyAnswer()) {
                        if (isCross) crossCount--;
                        else otherCount--;
                    }
                    else {
                        board[r][c] = t;
                    }
                }
            }
        }
    }

    return board;
}

resetButton.click();