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
  var BALLS_TEST = 6;
  for(var i=0; i<BALLS_TEST; i++)
  {
    snake.addBall();
  }
}

function clearIntervalIfOtherKeyPressed(key)
{
  if(lastKeyPressed != key)
  {
    assets.resetVerticalIncrement();
    assets.intervalTicks = 0;
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
      assets.intervalTicks++;
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
      assets.intervalTicks++;
    }, assets.snakeCalculationPeriod);
    setKeyPressed('left');
  }
  else if(e.key === " ")
  {
    clearIntervalIfOtherKeyPressed('left');
  }
  else if(e.key === 'a')
  {
    //add ball
    snake.addBall();
  }
}
window.onkeyup = function(e){
  console.log('key Up');
  if (e.key != " ")
  {
    if(idInterval)
    {
      clearInterval(idInterval);
      idInterval = undefined;
      assets.resetVerticalIncrement();
      assets.intervalTicks = 0;
    }
    if (!idInterval) idInterval = setInterval(function(){
      snake.moveForward();
      game.clearCanvas();
      snake.draw();
    }, assets.snakeCalculationPeriod);
  }
}