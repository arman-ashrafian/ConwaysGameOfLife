let GameOfLife = function (p) {
    const scale = 50
    let grid
    let rows
    let cols

    p.setup = () => {
        p.createCanvas(800, 800)

        cols = p.width / scale
        rows = p.height / scale
        grid = makeGrid(rows, cols)
    }

    p.draw = () => {
        p.background('#455a64')
        drawGrid(grid)
        updateGrid()
    }

    // creates 2D array filled with 1's & 0's
    function makeGrid(rows, cols) {
        let arr = new Array()
        for (let i = 0; i < rows; i++) {
            arr.push(new Array())
            for (let j = 0; j < cols; j++) {
                arr[i].push(Math.floor(p.random(2)))
            }
        }
        return arr
    }

    function drawGrid(grid) {
        let x, y
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                x = i * scale
                y = j * scale
                if (grid[i][j] === 1) {
                    p.fill('#2196f3')
                    p.rect(x, y, scale - 1, scale - 1)
                } else {
                    p.fill('#455a64')
                    p.rect(x, y, scale - 1, scale - 1)
                }
            }
        }
    }

    function updateGrid() {
        let oldGrid = new Array()
        // copy grid into oldGrid
        for (let i = 0; i < grid.length; i++) {
            oldGrid.push(new Array())
            for (let j = 0; j < grid[i].length; j++) {
                oldGrid[i].push(grid[i][j])
            }
        }
        let n       // number of neighbors
        let state   // live or dead
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                n = countNeighbors(i, j, oldGrid)
                state = oldGrid[i][j]
                /* Rule #1
                * Any live cell with fewer than two live neighbors dies, 
                * as if by under population.
                */
                if (state == 1 && n < 2) {
                    grid[i][j] = 0
                }
                /* Rule #2
                * Any live cell with two or three live neighbors lives on
                * to the next generation.
                */
                else if (state === 1 && (n === 2 || n === 3)) {
                    grid[i][j] = 1
                }
                /* Rule #3
                * Any live cell with more than three live neighbors dies,
                * as if by overpopulation.
                */
                else if (state === 1 && n > 3) {
                    grid[i][j] = 0
                }
                /* Rule #4
                * Any dead cell with exactly three live neighbors becomes
                * a live cell, as if by reproduction.
                */
                else if (state === 0 && n === 3) {
                    grid[i][j] = 1
                }
            }
        }
    }

    function countNeighbors(row, col, g) {
        let sum = 0

        // top row
        if (row === 0) {
            // down
            sum += g[1][col]
            if (col != 0) {
                // left
                sum += g[0][col - 1]
                // left diagonal
                sum += g[1][col - 1]
            }
            if (col != g[0].length - 1) {
                // right
                sum += g[0][col + 1]
                // right diagonal
                sum += g[1][col + 1]
            }
        }
        // bottom row
        else if (row === g.length - 1) {
            // up
            sum += g[row - 1][col]
            if (col != 0) {
                // left
                sum += g[row][col - 1]
                // left diagonal
                sum += g[row - 1][col - 1]
            }
            if (col != g[row].length - 1) {
                // right
                sum += g[row][col + 1]
                // right diagonal
                sum += g[row - 1][col + 1]
            }
        }
        // left column
        else if (col === 0) {
            for (let i = -1; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    sum += g[row + i][col + j]
                }
            }
            sum -= g[row][col]
        }
        // right column
        else if (col === g[row].length - 1) {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 1; j++) {
                    sum += g[row + i][col + j]
                }
            }
            sum -= g[row][col]
        }
        else {
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    sum += g[row + i][col + j]
                }
            }
            sum -= g[row][col]
        }
        return sum
    }
}

var game = new p5(GameOfLife, 'sketch')