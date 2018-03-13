
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
  //CHAR_WIDTH = floor(12 * windowWidth/1000);

  grid = new MatrixGrid(width / CHAR_WIDTH, height / CHAR_WIDTH);
  //bgGrid = new MatrixGrid(width / CHAR_WIDTH * 4, height / CHAR_WIDTH * 4);
  //bgGrid = new MatrixGrid(width / CHAR_WIDTH * 4 * width/1200, height / CHAR_WIDTH * 4 * width/1200);
  
  let scaleX = map(width, 400, 2000, 100, 300)/width;
  bgGrid = new MatrixGrid(scaleX * width, scaleX * height);

  //grid.chooseBigWord('Welcome!', 4, 5);
  grid.chooseWord('How are you doing?\n\ttest',20, 8);

  bgGrid.chooseBigWord('Welcome!', 8, 10);

}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  //resizeCanvas(windowWidth, windowHeight);
  //CHAR_WIDTH = floor(12 * windowWidth/1000);

  grid = new MatrixGrid(width / CHAR_WIDTH, height / CHAR_WIDTH);
  //bgGrid = new MatrixGrid(width / CHAR_WIDTH * 4, height / CHAR_WIDTH * 4);
  //bgGrid = new MatrixGrid(width / CHAR_WIDTH * 4 * width/1200, height / CHAR_WIDTH * 4 * width/1200);
  let scaleX = map(width, 400, 2000, 100, 300)/width;
  bgGrid = new MatrixGrid(scaleX * width, scaleX * height);

  //grid.chooseBigWord('Welcome!', 4, 5);
  grid.chooseWord('How are you doing?\n\ttest',20, 8);
  bgGrid.chooseBigWord('Welcome!', 8, 10);
}

function draw() {

  deltaTime = millis() - lastMillis;
  lastMillis = millis();
  

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


  background(0, 20, 0);

  bgGrid.drawGrid(gridColors);
  grid.drawGrid(gridColors);

  

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(grid, 0.999, 0.05);
    updateRain(bgGrid, 0.999, 0.05);
  }

}


function keyPressed() {

  //bgGrid.clearChosen();
  //bgGrid.chooseBigWord('Welcome!', 8, 10);
  bgGrid.chooseBigWord(key, 40, 20);

}



function mouseDragged() {

  let row = Math.round(mouseY / CHAR_WIDTH);
  let col = Math.round(mouseX / CHAR_WIDTH);
  grid.addRain(row, col);

}

// // meant for a single line
// function chooseBigWord(word, row, col) {

//   let textScale = 16;//floor(16 * width/1000 * CHAR_WIDTH/12);

//   let textHeight = textScale * 1.5;
//   let textWidth = word.length * textScale;

//   background(0);
//   noSmooth();
//   fill(255);
//   textSize(textScale);
//   text(word, 0, textScale);
//   smooth();
//   loadPixels();
//   for(let x = 0; x < textWidth; x++) {
//     for(let y = 0; y < textHeight; y++) {

//       let canvasI = (x + y * width) * 4;

//       if(pixels[canvasI] > 180) {
//         if(grid[row + y][col + x] != null) {
//           grid[row + y][col + x].chosenChar = getRandomChar();
//         }
//       }

//     }
//   }

// }


// can be multiple lines of text
/*function chooseWord(text, row, col) {

  let rowI = 0;
  let colI = 0;
  for(let i = 0; i < text.length; i++) {

    switch(text[i]) {
      case '\n':
        rowI++;
        colI = 0;
        break;
      
      case '\t':
        colI += 3;
        break;

      default:
        grid[row + rowI][col + colI].chosenChar = text[i];
        colI++;
        break;
    }
    
  }

}*/

/*function clearChosen() {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      grid[i][j].chosenChar = '';
    }
  }
}*/


function updateRain(matrixGrid, rainCapPercent = 0.98, decay = 0.05) {

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
        if(matrixGrid.grid[i][j].char != matrixGrid.grid[i][j].chosenChar && Math.random() > 0.99) {
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

/*
function addRain(row, col) {

  grid[row][col].rain = true;
  grid[row][col].brightness = 1;
  grid[row][col].char = grid[row][col].chosenChar === ''? getRandomChar() : grid[row][col].chosenChar;

}

function drawGrid(grid, gridColors, textScale, canvasScale = 1) {

  textSize(textScale);
  textAlign(LEFT);
  // cycle through the matrix grid and display the characters with the adjusted
  // brightness and whiteness
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {

      let mult = grid[y][x].brightness;
      if(mult > 0.1) {
        // only display text if it will be visible

        let avgColorNum = (gridColors[y][x].r + gridColors[y][x].g + gridColors[y][x].b)/3;//(0.2126*gridColors[y][x].r + 0.7152*gridColors[y][x].g + 0.0722*gridColors[y][x].b)
        let whiteness = (mult*255 > 200) && (avgColorNum > 127/3) ? map(mult, 0.8, 1, 127, 255, true) : 0;

        let canvasX = x*canvasScale;
        let canvasY = y*canvasScale;

        let r = gridColors[canvasY][canvasX].r * mult + whiteness;
        let g = gridColors[canvasY][canvasX].g * mult + whiteness;
        let b = gridColors[canvasY][canvasX].b * mult + whiteness;

        fill(r, g, b);
        text(grid[y][x].char, x * textScale, y * textScale);
      }

    }
  }

}

function createGrid(width, height) {
  let grid = [];

  for(let i = 0; i < height; i++) {
    let row = []

    for(let j = 0; j < width; j++) {
      row.push(
        {
          char: getRandomChar(),
          brightness: 0,
          rain: false,
          chosenChar: ''
        }
      );
    }

    grid.push(row);
  }

  return grid;
}

function getRandomChar() {

  let randInt = Math.floor(Math.random() * 80);
  let offsetHex = parseInt('0x' + randInt.toString(16));
  return String.fromCharCode(0x30A0 + offsetHex);

}
*/