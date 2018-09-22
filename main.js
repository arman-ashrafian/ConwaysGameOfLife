let GameOfLife = function (p) {
    let grid
    let rows, cols
    let canvas

    let mouseMotion = false
    let mousedown = 0
    let running = true
    let generation = 0
    let size = 600
    let scale = 10

    let generationElem = document.getElementById('generation')
    let clearButton = document.getElementById('clearButton')
    let stopButton = document.getElementById('stopStartButton')
    let stepButton = document.getElementById('stepButton')
    let randomButton = document.getElementById('randomButton')
    let buttonRow = document.getElementsByClassName('buttonRow')[0]
    p.setup = () => {
        if (p.windowWidth < size) {
            size = Math.round(p.windowWidth / 10) * 10 - 100
            scale = 10
        }

        canvas = p.createCanvas(size, size)
        canvas.mouseReleased(() => {
            mouseMotion = false
        })
        canvas.mousePressed(() => {
            mouseMotion = true
            fillClickedGrid(true)
        })
        canvas.mouseMoved(() => {
            if (mouseMotion) {
                fillClickedGrid(false)
            }
        })

        cols = p.width / scale
        rows = p.height / scale
        grid = makeRandomGrid(rows, cols)

        clearButton.addEventListener('click', () => {
            grid = makeEmptyGrid(rows, cols)
            generation = 0
        })
        stopButton.addEventListener('click', () => {
            if (running) {
                stopButton.innerText = 'start'
                stopButton.classList.remove('red')
                stopButton.classList.add('green')
                M.toast({html: 'click cell to select', classes: 'rounded'})
            } else {
                stopButton.innerText = 'stop'
                stopButton.classList.remove('green')
                stopButton.classList.add('red')
                M.Toast.dismissAll()
            }
            running = !running
        })
        stepButton.addEventListener('click', () => {
            updateGrid()
        })
        randomButton.addEventListener('click', () => {
            grid = makeRandomGrid(rows, cols)
            generation = 0
        })
        // prevent double-click highlight
        makeUnselectable(clearButton)
        makeUnselectable(stopButton)
        makeUnselectable(stepButton)
        makeUnselectable(randomButton)

        // makes buttons look pretty on mobile
        if (p.windowWidth < 750) {
            buttonRow.classList.remove('row')
        }
    }

    p.draw = () => {
        p.background('#455a64')

        generationElem.innerText = "Generation: " + generation

        drawGrid(grid)
        if (running) {
            updateGrid()
        }
    }

    function fillClickedGrid(toggleOn) {
        let rowClicked
        let colClicked
        if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
            // round down to nearest 10 & divide by scale
            rowClicked = Math.floor((Math.floor(p.mouseY / 10) * 10) / scale)
            colClicked = Math.floor((Math.floor(p.mouseX / 10) * 10) / scale)
            // toggle grid location
            let state = grid[rowClicked][colClicked]
            if (toggleOn) {
                grid[rowClicked][colClicked] = state ? 0 : 1
            } else {
                grid[rowClicked][colClicked] = 1
            }
            drawGrid(grid)
        }
    }

    // creates 2D array filled with 1's & 0's
    function makeRandomGrid(rows, cols) {
        let arr = new Array()
        for (let i = 0; i < rows; i++) {
            arr.push(new Array())
            for (let j = 0; j < cols; j++) {
                arr[i].push(Math.floor(p.random(2)))
            }
        }
        return arr
    }

    // creates 2D array filled with 1's & 0's
    function makeEmptyGrid(rows, cols) {
        let arr = new Array()
        for (let i = 0; i < rows; i++) {
            arr.push(new Array())
            for (let j = 0; j < cols; j++) {
                arr[i].push(0)
            }
        }
        return arr
    }

    function drawGrid(grid) {
        let x, y
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                y = i * scale
                x = j * scale
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
        generation++
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

    // Stack Overflow solution
    //https://stackoverflow.com/questions/880512/prevent-text-selection-after-double-click
    function makeUnselectable(elem) {
        if (typeof (elem) == 'string')
            elem = document.getElementById(elem);
        if (elem) {
            elem.onselectstart = function () { return false; };
            elem.style.MozUserSelect = "none";
            elem.style.KhtmlUserSelect = "none";
            elem.unselectable = "on";
        }
    }
}

var game = new p5(GameOfLife, 'sketch')
