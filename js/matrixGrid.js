

class MatrixGrid {

    constructor(width, height) {
        this.grid = [];
        
        for(let i = 0; i < height; i++) {
            let row = [];

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

            this.grid.push(row);
        }
    }

    drawGrid(gridColors) {

        let textScale = width / this.grid[0].length;

        textSize(textScale);
        textAlign(LEFT);
        // cycle through the matrix grid and display the characters with the adjusted
        // brightness and whiteness
        for(let y = 0; y < this.grid.length; y++) {
            for(let x = 0; x < this.grid[y].length; x++) {
        
                let mult = this.grid[y][x].brightness;
                if(mult > 0.1) {
                    // only display text if it will be visible
                    
                    let canvasY = floor(map(y, 0, this.grid.length -1, 0, gridColors.length - 1));
                    let canvasX = floor(map(x, 0, this.grid[y].length - 1, 0, gridColors[canvasY].length - 1));

                    let avgColorNum = (gridColors[canvasY][canvasX].r + gridColors[canvasY][canvasX].g + gridColors[canvasY][canvasX].b)/3;//(0.2126*gridColors[y][x].r + 0.7152*gridColors[y][x].g + 0.0722*gridColors[y][x].b)
                    let whiteness = (mult*255 > 200) && (avgColorNum > 127/3) ? map(mult, 0.8, 1, 127, 255, true) : 0;
            
                    let r = gridColors[canvasY][canvasX].r * mult + whiteness;
                    let g = gridColors[canvasY][canvasX].g * mult + whiteness;
                    let b = gridColors[canvasY][canvasX].b * mult + whiteness;
            
                    fill(r, g, b);
                    text(this.grid[y][x].char, x * textScale, y * textScale);
                }
        
            }
        }
      
    }

    // meant for a single line
    chooseBigWord(word, row, col) {

        let textScale = map(width, 400, 2000, 16, 18);
    
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
                    if(this.grid[row + y] != null && this.grid[row + y][col + x] != null) {
                        this.grid[row + y][col + x].chosenChar = getRandomChar();
                    }
                } else {
                    if(this.grid[row + y] != null && this.grid[row + y][col + x] != null) {
                        this.grid[row + y][col + x].chosenChar = '';
                    }
                }
            }
        }
    }

    // can be multiple lines of text
    chooseWord(text, row, col) {
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
                    if(this.grid[row + rowI][col + colI] != null) {
                        this.grid[row + rowI][col + colI].chosenChar = text[i];
                    }
                    colI++;
                break;
            }
        }
    }

    clearChosen() {
        for(let i = 0; i < this.grid.length; i++) {
          for(let j = 0; j < this.grid[i].length; j++) {
            this.grid[i][j].chosenChar = '';
          }
        }
    }

    addRain(row, col) {
        this.grid[row][col].rain = true;
        this.grid[row][col].brightness = 1;
        this.grid[row][col].char = this.grid[row][col].chosenChar === ''? getRandomChar() : this.grid[row][col].chosenChar;  
    }

}



function getRandomChar() {
    let randInt = Math.floor(Math.random() * 80);
    let offsetHex = parseInt('0x' + randInt.toString(16));
    return String.fromCharCode(0x30A0 + offsetHex);
}