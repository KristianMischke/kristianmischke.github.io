
let CHAR_WIDTH = 16;
const MATRIX_RATE = 80;


const MODES = {
  MATRIX: 0,
  SPACE: 1,
  OCEAN: 2,
  BUTTERFLY: 3,
  GOL: 4
};

let SIM_MODE = MODES.SPACE;

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
  

  switch(SIM_MODE) {
    case MODES.MATRIX:
      background(0, 255, 0);
      break;
    case MODES.SPACE:
      background(127, 0, 255);
      break;
    case MODES.OCEAN:
      background(0, 127, 255);
      break;
    case MODES.BUTTERFLY:
      background(255);

      for(let i = 0; i < random(20, 50); i++) {
        fill(color(random(127, 255), random(127, 255), random(127, 255)));
        rect(random(0, width), random(0, height), random(0, width/4), random(0, height/4));
      }
      break;

    case MODES.GOL:
      background(0, 255, 127);
      break;
  }

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

  switch(SIM_MODE) {
    case MODES.MATRIX:
      background(0, 20, 0);
      break;
    case MODES.SPACE:
      background(10, 0, 20);
      break;
    case MODES.OCEAN:
      background(0, 10, 20);
      break;
    case MODES.BUTTERFLY:
      background(200, 127, 127);
      break;
    case MODES.GOL:
      background(0, 20, 10);
      break;
  }


  bgGrid.drawGrid(gridColors);
  grid.drawGrid(gridColors);

  

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(grid, 0.9995, 0.05, 0.875);
    updateRain(bgGrid, 0.999, 0.05, 0.9);
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
      
      switch(SIM_MODE) {

        case MODES.MATRIX:
          // randomly add rain on the top row
          if(i === 0) {
            if(Math.random() > rainCapPercent) {
              matrixGrid.addRain(i, j);
            }
          }
          break;

        case MODES.OCEAN:
          break;

        case MODES.SPACE:
          if(Math.random() > rainCapPercent) {
            matrixGrid.addRain(i, j);
            //matrixGrid.grid[i][j].brightness = 1;
          }
          break;

        case MODES.BUTTERFLY:
          if(i === 0 || i === matrixGrid.grid.length - 1 || j === 0 || j === matrixGrid.grid[i].length - 1) {
            if(Math.random() > rainCapPercent) {
              matrixGrid.addRain(i, j);
            }
          }
          break;
      }

      // decay the brightness, if it is not a chosen character
      if(matrixGrid.grid[i][j].chosenChar === '') {
        matrixGrid.grid[i][j].brightness -= decay;
      } else {
        if(matrixGrid.grid[i][j].char != matrixGrid.grid[i][j].chosenChar && Math.random() > chosenRainPercent) {
         
          if(SIM_MODE === MODES.MATRIX) {
            matrixGrid.addRain(0, j);
          }

          if(SIM_MODE === MODES.SPACE) {
            matrixGrid.addRain(i, j);
          }

        }
      }

      if(matrixGrid.grid[i][j].rain === true) {
        // if this is rain

        switch(SIM_MODE) {

        case MODES.MATRIX:
          if(i < matrixGrid.grid.length - 1) {
            // and it is not the last row, continue the rain on the next row
            matrixGrid.addRain(i + 1, j);
          }
          matrixGrid.grid[i][j].rain = false; // remove the rain at this location
          break;

        case MODES.OCEAN:
          break;

        case MODES.SPACE:
          matrixGrid.grid[i][j].rain = false;
          break;

        case MODES.BUTTERFLY:
          matrixGrid.grid[i][j].rain = false;

          let posI = i + round(random(-1, 1));
          let posJ = j + round(random(-1, 1));
          if(posI >= 0 && posI <= matrixGrid.grid.length - 1 && posJ >= 0 && posJ <= matrixGrid.grid[posI].length - 1) {
            matrixGrid.addRain(posI, posJ);
          }
          break;
        }

      } else if(Math.random() > 0.95 && matrixGrid.grid[i][j].brightness > 0.5 && matrixGrid.grid[i][j].chosenChar === '') {
        // otherwise if it is not the leading rain,
        // and if it is not a chosen character
        // if the brightness is high, randomly choose a new character

        matrixGrid.grid[i][j].char = getRandomChar();

      }

    }
  }

}