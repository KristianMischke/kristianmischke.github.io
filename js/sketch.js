
const CHAR_WIDTH = 12;
const MATRIX_RATE = 80;

//keep track of time
let deltaTime = 0;
let lastMillis = 0;

//
let updateCounter = 0;
let grid = [];

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  textFont('Courier New');

  createGrid();

  chooseBigWord('Welcome!', 4, 5);
  chooseWord('How are you doing?\n\ttest',20, 8);

}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  //resizeCanvas(windowWidth, windowHeight);
  createGrid();

  chooseBigWord('Welcome!', 4, 5);
  chooseWord('How are you doing?\n\ttest',20, 8);
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

  textSize(CHAR_WIDTH);
  textAlign(LEFT);
  // cycle through the matrix grid and display the characters with the adjusted
  // brightness and whiteness
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[y].length; x++) {

      let mult = grid[y][x].brightness;
      if(mult > 0.1) {
        // only display text if it will be visible

        let avgColorNum = (0.2126*gridColors[y][x].r + 0.7152*gridColors[y][x].g + 0.0722*gridColors[y][x].b)
        let whiteness = (mult*255 > 200) && (avgColorNum > 127) ? map(mult, 0.8, 1, 127, 255, true) : 0;

        let r = gridColors[y][x].r * mult + whiteness;
        let g = gridColors[y][x].g * mult + whiteness;
        let b = gridColors[y][x].b * mult + whiteness;

        fill(r, g, b);
        text(grid[y][x].char, x * CHAR_WIDTH, y * CHAR_WIDTH);
      }

    }
  }

  updateCounter += deltaTime;
  if(updateCounter >= MATRIX_RATE) {
    updateCounter -= MATRIX_RATE;
    updateRain(0.994, 0.05);
  }

}


function keyPressed() {

  clearChosen();
  chooseBigWord('Welcome!', 4, 5);
  chooseBigWord(key, 20, 20);

}



function mouseDragged() {

  let row = Math.round(mouseY / CHAR_WIDTH);
  let col = Math.round(mouseX / CHAR_WIDTH);
  grid[row][col].rain = true;

}

// meant for a single line
function chooseBigWord(word, row, col) {

  let textScale = 16;

  let textHeight = textScale * 1.5;
  let textWidth = word.length * textScale;

  background(0);
  noSmooth();
  fill(255);
  textSize(textScale);
  text(word, 0, textScale);
  smooth();
  loadPixels();
  for(let x = 0; x < textWidth; x++) {
    for(let y = 0; y < textHeight; y++) {

      let canvasI = (x + y * width) * 4;

      if(pixels[canvasI] > 180) {
        if(grid[row + y][col + x] != null) {
          grid[row + y][col + x].chosenChar = getRandomChar();
        }
      }

    }
  }

}


// can be multiple lines of text
function chooseWord(text, row, col) {

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

}

function clearChosen() {
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      grid[i][j].chosenChar = '';
    }
  }
}


function updateRain(rainCapPercent = 0.98, decay = 0.05) {

  // loop through the entire grid
  for(let i = grid.length - 1; i >= 0; i--) {
    for(let j = grid[i].length - 1; j >= 0; j--) {
      
      // randomly add rain on the top row
      if(i === 0) {
        if(Math.random() > rainCapPercent) {
          addRain(i, j);
        }
      }

      // decay the brightness, if it is not a chosen character
      if(grid[i][j].chosenChar === '') {
        grid[i][j].brightness -= decay;
      } else {
        if(grid[i][j].char != grid[i][j].chosenChar && Math.random() > 0.99) {
          grid[0][j].rain = true;
        }
      }

      if(grid[i][j].rain === true) {
        // if this is the leading rain

        if(i < grid.length - 1) {
          // and it is not the last row,
          // continue the rain on the next row
          addRain(i + 1, j);

        }

        // remove the rain at this location
        grid[i][j].rain = false;

      } else if(Math.random() > 0.95 && grid[i][j].brightness > 0.5 && grid[i][j].chosenChar === '') {
        // otherwise if it is not the leading rain,
        // and if it is not a chosen character
        // if the brightness is high, randomly choose a new character

        grid[i][j].char = getRandomChar();

      }

    }
  }

}


function addRain(row, col) {

  grid[row][col].rain = true;
  grid[row][col].brightness = 1;
  grid[row][col].char = grid[row][col].chosenChar === ''? getRandomChar() : grid[row][col].chosenChar;

}


function createGrid() {
  grid = [];

  for(let i = 0; i < height / CHAR_WIDTH; i++) {
    let row = []

    for(let j = 0; j < width / CHAR_WIDTH; j++) {
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
}

function getRandomChar() {

  let randInt = Math.floor(Math.random() * 80);
  let offsetHex = parseInt('0x' + randInt.toString(16));
  return String.fromCharCode(0x30A0 + offsetHex);

}