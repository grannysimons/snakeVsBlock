var game;
var idIntervals = [];
window.onload = function(){
  game = new Game();
  game.init();

  //prova
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
  game.snake.addBall();
  game.init();
}


window.onkeydown = function(e){
  if(e.key === "ArrowRight")
  {
    idIntervals.push(setInterval(function(){
      snakeContinuousMov('right');
    }, 70));
  }
  else if(e.key === "ArrowLeft")
  {
    idIntervals.push(setInterval(function(){
      snakeContinuousMov('left');
    }, 70));
  }
}
window.onkeyup = function(e){
  if(e.key === "ArrowRight")
  {
    idIntervals.forEach(function(idInterval){
      clearInterval(idInterval);
    });
  }
  else if(e.key === "ArrowLeft")
  {
    idIntervals.forEach(function(idInterval){
      clearInterval(idInterval);
    });
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