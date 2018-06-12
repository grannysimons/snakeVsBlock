var game;
var idInterval;
//alias
var assets;
var snake;

window.onload = function(){
  game = new Game();
  game.init();

  //alias assignment
  assets = game.assets;
  snake = game.snake;

  //prova
  var BALLS_TEST = 6;
  for(var i=0; i<BALLS_TEST; i++)
  {
    snake.addBall();
  }
  snake.draw();
}


window.onkeydown = function(e){
  if(e.key === "ArrowRight")
  {
    if (!idInterval) idInterval = setInterval(function(){
      console.log("setInterval");
      snake.moveRight();
      game.clearCanvas();
      snake.draw();
    }, assets.snakeCalculationPeriod);
  }
  else if(e.key === "ArrowLeft")
  {
    if (!idInterval) idInterval = setInterval(function(){
      console.log("setInterval");
      snake.moveLeft();
      game.clearCanvas();
      snake.draw();
    }, assets.snakeCalculationPeriod);
  }
}
window.onkeyup = function(e){
  if(e.key === "ArrowRight")
  {
    clearInterval(idInterval);
    idInterval = undefined;
  }
  else if(e.key === "ArrowLeft")
  {
    clearInterval(idInterval);
    idInterval = undefined;
  }
}

snakeContinuousMov = function(dir){
  if(dir === 'right')
  {
    game.clearCanvas();
    game.snake.moveRight();
    game.snake.draw();
  }
  else if(dir === 'left')
  {
    game.clearCanvas();
    game.snake.moveLeft();
    game.snake.draw();
  }
  
}