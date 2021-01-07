var boardBorder = "black";
var boardBackground = "white";
var snakeColour = "lightblue";
var snakeBorder = "darkblue";
var foodColour = "lightgreen";
var foodBorder = "darkgreen";

var foodX;
var foodY;
//true if changing direction
var changingDirection = false;
//velocities
var dy = 0;
var dx = 10;

//getting canvas element 
var snakeboard = document.getElementById("snakeboard");
//2D drawing context
var snakeboard_ctx = snakeboard.getContext("2d");

//dimensions of the snake
var snake = [{x:200,y:200}, 
             {x:190,y:200}, 
             {x:180,y:200}, 
             {x:170,y:200}, 
             {x:160,y:200}];

//setting look of each square on snake body
function drawSnakePart(snakePart){
    snakeboard_ctx.fillStyle = snakeColour;
    snakeboard_ctx.strokeStyle = snakeBorder;
    snakeboard_ctx.fillRect(snakePart.x, snakePart.y,10,10);
    snakeboard_ctx.strokeRect(snakePart.x,snakePart.y,10,10);
}

//drawing the snake on the canvas
function drawSnake(){
    snake.forEach(drawSnakePart);
}

//drawborder around canvas
function clearCanvas(){
    snakeboard_ctx.fillStyle = boardBackground;
    snakeboard_ctx.strokestyle = boardBorder;
    snakeboard_ctx.fillRect(0,0,snakeboard.width,snakeboard.height);
    snakeboard_ctx.strokeRect(0,0,snakeboard.width,snakeboard.height);
}

//automovement of snake
function moveSnake(){
    var head = {x: snake[0].x +dx, y:snake[0].y+dy};
    snake.unshift(head);
    snake.pop();
}


function changeDirection(event){
    //arrow key codes
    var leftKey = 37;
    var rightKey = 39;
    var upKey = 40;
    var downKey = 38;
    
    //prevents snake from moving too quickly
    if(changingDirection) return;
    changingDirection = true;
    
    //storing key pressed
    var keypressed = event.keyCode;
    
    //directional velocities
    var goingUP = dy === 10;
    var goingDOWN = dy ===-10;
    var goingRIGHT = dx === 10;
    var goingLEFT = dx === -10;
    
    //changing direction
    if (keypressed === leftKey && !goingRIGHT){//turn left
        dx=-10;
        dy=0
    }
    else if(keypressed === rightKey && !goingLEFT){
        dx=10;
        dy=0;
    }
    else if (keypressed === upKey && !goingDOWN){//turn down
        dx = 0;
        dy = 10;
    }
    else if(keypressed === downKey && !goingUP){//turn up
        dx=0;
        dy=-10;
    }
}

function hasGameEnded(){
    for(var i=4; i<snake.length; i++){
        var hasCollided = snake[i].x === snake[0].y === snake[0].y;
        if(hasCollided){return true;}
    }
    
    var hitLeft = snake[0].x< 0;
    var hitRight = snake[0].x > snakeboard.width - 10;
    var hitTop = snake[0].y < 0;
    var hitBot = snake[0].y > snakeboard.height - 10;
    
    return hitBot || hitLeft || hitTop || hitRight;
}

function randomFood(min,max){
    return Math.round((Math.random() * (max-min) + min) / 10) * 10; 
}

function drawFood(){
    snakeboard_ctx.fillStyle = foodColour;
    snakeboard_ctx.strokeStyle = foodBorder;
    snakeboard_ctx.fillRect(foodX,foodY,10,10);
    snakeboard_ctx.strokeRect(foodX,foodY,10,10);
}

function genFood(){
    //x cooredinate of food
    foodX = randomFood(0,snakeboard.width - 10);
    // y coordinate of food
    foodY = randomFood(0,snakeboard.height - 10);
    snake.forEach(function hasSnakeEaten(part){
        var hasEaten = part.x == foodX && part.y == foodY;
        if(hasEaten){
            genFood();
        }
    });
}
        
//called when game starts
function main(){
    if(hasGameEnded()){
        return;
    }
    changingDirection = false;
    setTimeout(function onTick(){ 
        clearCanvas(); 
        drawFood();
        moveSnake(); 
        drawSnake();
        //repeat until game has ended
        main();
    },100)
}

genFood();
//start game
main();
//listen for keypress
document.addEventListener("keydown", changeDirection);
