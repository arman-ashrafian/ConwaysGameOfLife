let GameOfLife = function(p) {
    const scale = 50
    let grid
    let rows
    let cols

    p.setup = () => {
        p.createCanvas(500,500)

        cols = p.width / scale
        rows = p.height / scale
        grid = makeGrid(rows, cols)
    }

    p.draw = () => {
        p.background(0)
        drawGrid(grid)
    }

    // creates 2D array filled with 1's & 0's
    function makeGrid(rows, cols) {
        let arr = new Array()
        for(let i=0; i<rows; i++) {
            arr.push(new Array())
            for(let j=0; j<cols; j++) {
                arr[i].push(Math.floor(p.random(2)))
            }
        }
        return arr
    }

    function drawGrid(grid) {
        let x,y
        for(let i=0; i<grid.length; i++) {
            for(let j=0; j<grid[i].length; j++) {
               x = i * scale
               y = j * scale
               if(grid[i][j] === 1) {
                   p.fill(255)
                   p.rect(x, y, scale-1, scale-1)
               } 
            }
        }
    }
}

var game = new p5(GameOfLife, 'sketch')