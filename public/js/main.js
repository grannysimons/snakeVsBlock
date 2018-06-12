var game;
var idInterval;
var lastKeyPressed;

//alias definition
var assets;
var snake;

window.onload = function(){
  game = new Game();
  game.init();

  //alias assignment
  assets = game.assets;
  snake = game.snake;

  //test
  setTest();
}

function setTest(){
  var BALLS_TEST = 2;
  for(var i=0; i<BALLS_TEST; i++)
  {
    snake.addBall();
  }
  snake.draw();
}

function clearIntervalIfOtherKeyPressed(key)
{
  if(lastKeyPressed != key)
  {
    clearInterval(idInterval);
    idInterval = undefined;
  }
}

function setKeyPressed(key)
{
  lastKeyPressed = key;
}

window.onkeydown = function(e){
  if(e.key === "ArrowRight")
  {
    console.log('right');
    clearIntervalIfOtherKeyPressed('right');
    if (!idInterval) idInterval = setInterval(function(){
      snake.moveRight();
      game.clearCanvas();
      snake.draw();
    }, assets.snakeCalculationPeriod);
    setKeyPressed('right');
  }
  else if(e.key === "ArrowLeft")
  {
    console.log('left');
    clearIntervalIfOtherKeyPressed('left');
    if (!idInterval) idInterval = setInterval(function(){
      snake.moveLeft();
      game.clearCanvas();
      snake.draw();
    }, assets.snakeCalculationPeriod);
    setKeyPressed('left');
  }
}
window.onkeyup = function(e){
  console.log('key Up');
  if(idInterval)
  {
    clearInterval(idInterval);
    idInterval = undefined;
  }
  if (!idInterval) idInterval = setInterval(function(){
    snake.moveForward();
    game.clearCanvas();
    snake.draw();
  }, assets.snakeCalculationPeriod);
}