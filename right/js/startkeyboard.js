window.blur();
var WINDOW_WIDTH = document.documentElement.clientWidth;
var WINDOW_HEIGHT = document.documentElement.clientHeight;
var start = false;//press r to start
var balls = [];
var issame = false;//signal the color of the word and background
var luckcynumber1 = 0;//random number for color
var luckcynumber2 = 0;//random number for words
var luckcynumber3 = 0;//random number for background
// =============================================
//  if score>150 then  level up
// =============================================
var level = 1;
// =============================================
//  colors and words //you can also update them
// =============================================
var colors = new Array();
colors[0] = 'red';
colors[1] = '#FFCC00';
colors[2] = '#F7F709';
colors[3] = '#2B2BD5';
colors[4] = '#660099';
colors[5] = '#ff99ff';
colors[6] = '#808080';
var words = new Array();
words[0] = 'red';
words[1] = 'orange';
words[2] = 'yellow';
words[3] = 'blue';
words[4] = 'purple';
words[5] = 'pink';
words[6] = 'grey';


changecolor();//init random color;

function restart(){
    start = false;
    sequence2.stop();
    changecolor();
    startSound();
}
// =============================================
// start function
// =============================================
function a(){
kontra.init();
// =============================================
//  background object
// =============================================
  var background = kontra.sprite({
    x: 0,
    y: 0,
    color: 'black',
    width: kontra.canvas.width,
    height: kontra.canvas.height,
  });


  var max = 0;//highscore
  var time = 2;//rest time to play
  var score = 0;



  document.onkeyup = function(e){
    if(start){
      if(kontra.keys.pressed('left') && !issame){//judge the color

        rightSound();
        changecolor();
        score +=10;
        time = 2;
      }else if (kontra.keys.pressed('right') && issame) {//judge the color

        rightSound();
        changecolor();
        score +=10;
        time = 2;
      }else if(!kontra.keys.pressed('r')){
        wrongSound();
        alert("当前:"+score+", 总分: "+max+", 继续努力!!");
        score = 0;
        time = 2;
        restart();
      }
    }
  }



  kontra.keys.bind(['R','r'],function(){
    start = true;
    sequence1.stop();
    bgSound();
  });

// =============================================
//  gameLoop
// =============================================
  var loop = kontra.gameLoop({
    update:function(){
        if(start){
            if(score > max){
                max = score;
            }
            if(time>0){
                time -=0.01;
            }else{
                time = 2;
                score = 0;
                level = 1;
                alert("当前:"+score+", 总分: "+max+", 继续努力!!");
                restart();
            }


            balldown(15);
        }
        if(score > 300){
            level = 2;
            background.color = colors[luckcynumber3];
        }else if(score <= 300 && score >=0){
            level = 1;
            background.color = 'black';
        }

    },
    render:function(){
      background.render();
      if(start){
        drawText(words[luckcynumber2],20,colors[luckcynumber1]);
        drawball(15);
        drawscore("score:"+score+"  max:"+max+"  level:"+level,8,5,5);
        drawscore("time:"+time.toFixed(2),5,5,kontra.canvas.height-30);
      }else{
        drawscore("Judge the consistency of  ",6,20,70);
        drawscore("word and its colors.right ",6,20,140);
        drawscore("press right otherwies left.",6,20,210);
        drawscore("if wrong or time up",6,20,280);
        drawscore("then score = 0",6,20,350);
        drawscore("be careful and go bravely!",6,20,420);
        drawscore("Press R to start!!!",8,20,600);
      }

    }
  });
  loop.start(); //start
}

if(start == false){
  startSound();
}



// =============================================
//  changecolor based on level
// =============================================
function changecolor(){
  if(level == 1){
    luckcynumber1 = Math.floor(Math.random()*colors.length);
    luckcynumber2 = Math.floor(Math.random()*words.length);
    if (luckcynumber1 == luckcynumber2){ // judge the color of the word and the background
      issame = true;
    }else{
      issame = false;
    }
  }else if(level == 2){
     luckcynumber1 = Math.floor(Math.random()*colors.length);
     luckcynumber2 = Math.floor(Math.random()*words.length);
     luckcynumber3 = Math.floor(Math.random()*colors.length);
      if(luckcynumber3 == luckcynumber1){
        luckcynumber3 = (luckcynumber3+1) % colors.length;
      }
      if (luckcynumber1 == luckcynumber2){ // judge the color of the word and the background
        issame = true;
      }else{
        issame = false;
      }
  }
}


// =============================================
// function to draw words
// =============================================
function drawText(string,size,color) {
    var needed = [];
    if (string) {
        string = string.toUpperCase();
        for (var i = 0; i < string.length; i++) {
            var letter = letters[string.charAt(i)];
            if (letter) {
                needed.push(letter);
            }
          }
        var currX =kontra.canvas.width/2-(string.length*2)*size;
        kontra.context.fillStyle = color;
        for (i = 0; i < needed.length; i++) {
            letter = needed[i];
            var currY = kontra.canvas.height/2 -3*size;
            var addX = 0;
            for (var y = 0; y < letter.length; y++) {
                var row = letter[y];
                for (var x = 0; x < row.length; x++) {
                    if (row[x]) {
                        kontra.context.fillRect(currX + x * size , currY , size, size);
                        var newball={
                            x:currX + x * size,
                            y:currY,
                            g:1.5 + (Math.random()),
                            vx:Math.pow(-1, Math.floor(Math.random() * 100)) * 5,
                            vy:-Math.ceil(Math.random() * 10),
                            color:color
                        };
                        balls.push(newball);
                    }
                }
                addX = Math.max(addX, row.length * size);
                currY += size;
            }
            currX += size + addX;
          }
    }
}

function drawball(size){

    for(var i = 0;i < balls.length;i++){
        kontra.context.fillStyle = balls[i].color;
        kontra.context.fillRect(balls[i].x,balls[i].y,size,size);
    }
}

function balldown(size){
    //draw the word
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y > WINDOW_HEIGHT - size){
            balls[i].y = WINDOW_HEIGHT - size;
            balls[i].vy = -balls[i].vy * 0.6;
        }
    }
    var ballscount = 0;

    for (i = 0; i < balls.length; i++) {
        if (balls[i].x + size > 0 && balls[i].x  < WINDOW_WIDTH) {
            balls[ballscount++] = balls[i]
        }
    }

    while (balls.length > Math.min(ballscount, 500)) {
        balls.pop();
    }
}

function drawscore(string,size,a,b){
  //var size = size;
  var needed = [];
  if (string) {
      string = string.toUpperCase();
      for (var i = 0; i < string.length; i++) {
          var letter = letters[string.charAt(i)];
          if (letter) {
              needed.push(letter);
          }
        }
      var currX = a;
      kontra.context.fillStyle = 'white';
      for (i = 0; i < needed.length; i++) {
          letter = needed[i];
          var currY = b;
          var addX = 0;
          for (var y = 0; y < letter.length; y++) {
              var row = letter[y];
              for (var x = 0; x < row.length; x++) {
                  if (row[x]) {
                      kontra.context.fillRect(currX + x * size , currY , size, size);
                  }
              }
              addX = Math.max(addX, row.length * size);
              currY += size;
          }
          currX += size + addX;
        }
  }
}

// =============================================
// Pixel Font
// =============================================
var letters = {
    'A': [
        [, 1],
        [1, , 1],
        [1, , 1],
        [1, 1, 1],
        [1, , 1]
    ],
    'B': [
        [1, 1],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, 1]
    ],
    'C': [
        [1, 1, 1],
        [1],
        [1],
        [1],
        [1, 1, 1]
    ],
    'D': [
        [1, 1],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1]
    ],
    'E': [
        [1, 1, 1],
        [1],
        [1, 1, 1],
        [1],
        [1, 1, 1]
    ],
    'F': [
        [1, 1, 1],
        [1],
        [1, 1],
        [1],
        [1]
    ],
    'G': [
        [, 1, 1],
        [1],
        [1, , 1, 1],
        [1, , , 1],
        [, 1, 1]
    ],
    'H': [
        [1, , 1],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, , 1]
    ],
    'I': [
        [1, 1, 1],
        [, 1],
        [, 1],
        [, 1],
        [1, 1, 1]
    ],
    'J': [
        [1, 1, 1],
        [, , 1],
        [, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    'K': [
        [1, , , 1],
        [1, , 1],
        [1, 1],
        [1, , 1],
        [1, , , 1]
    ],
    'L': [
        [1],
        [1],
        [1],
        [1],
        [1, 1, 1]
    ],
    'M': [
        [1, 1, 1, 1, 1],
        [1, , 1, , 1],
        [1, , 1, , 1],
        [1, , , , 1],
        [1, , , , 1]
    ],
    'N': [
        [1, , , 1],
        [1, 1, , 1],
        [1, , 1, 1],
        [1, , , 1],
        [1, , , 1]
    ],
    'O': [
        [1, 1, 1],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    'P': [
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1],
        [1],
        [1]
    ],
    'Q': [
        [, 1, 1],
        [1, , , 1],
        [1, , , 1],
        [1, , 1, 1],
        [1, 1, 1, 1]
    ],
    'R': [
        [1, 1],
        [1, , 1],
        [1, , 1],
        [1, 1],
        [1, , 1]
    ],
    'S': [
        [1, 1, 1],
        [1],
        [1, 1, 1],
        [, , 1],
        [1, 1, 1]
    ],
    'T': [
        [1, 1, 1],
        [, 1],
        [, 1],
        [, 1],
        [, 1]
    ],
    'U': [
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    'V': [
        [1, , , , 1],
        [1, , , , 1],
        [, 1, , 1],
        [, 1, , 1],
        [, , 1]
    ],
    'W': [
        [1, , , , 1],
        [1, , , , 1],
        [1, , , , 1],
        [1, , 1, , 1],
        [1, 1, 1, 1, 1]
    ],
    'X': [
        [1, , , , 1],
        [, 1, , 1],
        [, , 1],
        [, 1, , 1],
        [1, , , , 1]
    ],
    'Y': [
        [1, , 1],
        [1, , 1],
        [, 1],
        [, 1],
        [, 1]
    ],
    'Z': [
        [1, 1, 1, 1, 1],
        [, , , 1],
        [, , 1],
        [, 1],
        [1, 1, 1, 1, 1]
    ],
    ':': [
        [, , ],
        [1, , ],
        [, , , ],
        [1, , ],
        [, , ]
    ],
    '0': [
        [1, 1, 1],
        [1, , 1],
        [1, , 1],
        [1, , 1],
        [1, 1, 1]
    ],
    '1': [
        [, 1],
        [, 1],
        [, 1],
        [, 1],
        [, 1]
    ],
    '2': [
        [1, 1, 1],
        [, , 1],
        [1, 1, 1],
        [1, , ],
        [1, 1, 1]
    ],
    '3': [
        [1, 1, 1],
        [, , 1],
        [1, 1, 1],
        [, , 1],
        [1, 1, 1]
    ],
    '4': [
        [1, , 1],
        [1, , 1],
        [1, 1, 1],
        [, , 1],
        [, , 1]
    ],
    '5': [
        [1, 1, 1],
        [1, , ],
        [1, 1, 1],
        [, , 1],
        [1, 1, 1]
    ],
    '6': [
        [1, 1, 1],
        [1, , ],
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1]
    ],
    '7': [
        [1, 1, 1],
        [, , 1],
        [, , 1],
        [, , 1],
        [, , 1]
    ],
    '8': [
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1]
    ],
    '9': [
        [1, 1, 1],
        [1, , 1],
        [1, 1, 1],
        [, , 1],
        [1, 1, 1]
    ],
    ' ': [
        [, , ],
        [, , ],
        [, , ],
        [, , ],
        [, , ]
    ],
    '.': [
        [, , ],
        [, , ],
        [, , ],
        [, , ],
        [,1, ]
    ],
    '!': [
        [, 1, ],
        [, 1, ],
        [, 1, ],
        [, , ],
        [,1, ]
    ],
    '=': [
        [, , ],
        [1, 1, 1],
        [, , ],
        [1,1 ,1 ],
        [,, ]
    ],
};
