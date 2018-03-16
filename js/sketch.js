
let CHAR_WIDTH = 16;
const MATRIX_RATE = 80;

//keep track of time
let deltaTime = 0;
let lastMillis = 0;

//
let updateCounter = 0;
let grid;
let bgGrid;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  textFont('Courier New');

  populateGrids();

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  populateGrids();

}


function populateGrids() {

  grid = new MatrixGrid(width / CHAR_WIDTH, height / CHAR_WIDTH);

  let scaleX = map(width, 400, 2000, 100, 300, true)/width;
  bgGrid = new MatrixGrid(scaleX * width, scaleX * height);

  let edgeCol = round(map(width, 400, 1000, 3, 8, true));
  grid.chooseWord('How are you doing?\n\ttest', 20, edgeCol);

  bgGrid.chooseBigWord('Welcome!', 8, 10);

}


function draw() {

  deltaTime = millis() - lastMillis;
  lastMillis = millis();
  

  //background(127, 0, 255);
  background(0, 255, 0);

  /*fill(255, 255, 255);
  textSize(132);
  textAlign(CENTER)
  text('Welcome!', width/2, height/4);
  */


  var gridColors = []
  // save the colors of the canvas for each character in the matrix grid
  loadPixels();
  for(let y = 0; y < height; y+= CHAR_WIDTH) {
    let row = [];
    for(let x = 0; x < width; x+= CHAR_WIDTH) {
      let i = (x + y * width) * 4;
      row.push({
        r:pixels[i],
        g:pixels[i+1],
        b:pixels[i+2]
      })
    }
    gridColors.push(row);
  }


  //background(10, 0, 20);
  background(0, 20, 0);

  bgGrid.drawGrid(gridColors);
  grid.drawGrid(gridColors);

  

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(grid, 0.9995, 0.05, 0.9);
    updateRain(bgGrid, 0.999, 0.05);
  }

}


function keyPressed() {

  bgGrid.chooseBigWord(key, 40, 20);

}



function mouseDragged() {

  let row = Math.round(mouseY / CHAR_WIDTH);
  let col = Math.round(mouseX / CHAR_WIDTH);
  grid.addRain(row, col);

}


function updateRain(matrixGrid, rainCapPercent = 0.98, decay = 0.05, chosenRainPercent = 0.99) {

  // loop through the entire grid
  for(let i = matrixGrid.grid.length - 1; i >= 0; i--) {
    for(let j = matrixGrid.grid[i].length - 1; j >= 0; j--) {
      
      // randomly add rain on the top row
      if(i === 0) {
        if(Math.random() > rainCapPercent) {
          matrixGrid.addRain(i, j);
        }
      }

      // decay the brightness, if it is not a chosen character
      if(matrixGrid.grid[i][j].chosenChar === '') {
        matrixGrid.grid[i][j].brightness -= decay;
      } else {
        if(matrixGrid.grid[i][j].char != matrixGrid.grid[i][j].chosenChar && Math.random() > chosenRainPercent) {
          matrixGrid.grid[0][j].rain = true;
        }
      }

      if(matrixGrid.grid[i][j].rain === true) {
        // if this is the leading rain

        if(i < matrixGrid.grid.length - 1) {
          // and it is not the last row,
          // continue the rain on the next row
          matrixGrid.addRain(i + 1, j);

        }

        // remove the rain at this location
        matrixGrid.grid[i][j].rain = false;

      } else if(Math.random() > 0.95 && matrixGrid.grid[i][j].brightness > 0.5 && matrixGrid.grid[i][j].chosenChar === '') {
        // otherwise if it is not the leading rain,
        // and if it is not a chosen character
        // if the brightness is high, randomly choose a new character

        matrixGrid.grid[i][j].char = getRandomChar();

      }

    }
  }

}