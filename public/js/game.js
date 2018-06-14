function Game(){
  this.assets = new Assets();
  this.ctx = document.getElementById('canvas').getContext('2d');
  this.snake = new Snake(this.ctx, this.assets);
  this.blocks = [];
  this.keys = [];
  this.idInterval = undefined;
  this.lastKeyPressed = undefined;
}

Game.prototype.init = function(){
  this.snake.draw();
  this.keys[this.assets.ARROW_RIGHT] = false;
  this.keys[this.assets.ARROW_LEFT] = false;
  this.keys[this.assets.SPACEBAR] = false;

  this.snake.animationInterval = setInterval(function(){
    this.checkKey();
  }.bind(this), this.assets.snakeMovementInterval);

  window.addEventListener('keydown', function(e){
    switch(e.key)
    {
      case 'ArrowRight':
        this.keys[this.assets.ARROW_RIGHT] = true;
      break;
      case 'ArrowLeft':
        this.keys[this.assets.ARROW_LEFT] = true;
      break;
      case ' ':
        this.keys[this.assets.SPACEBAR] = true;
      break;
    }
  }.bind(this));
  window.addEventListener('keyup', function(e){
    console.log('key Up');

    for (var i = 0; i<this.keys.length; i++)
    {
      this.keys[i]=false;
    }

    if (e.key != " ")
    {
      if(this.idInterval)
      {
        clearInterval(this.idInterval);
        this.idInterval = undefined;
        this.assets.resetVerticalIncrement();
        this.assets.intervalTicks = 0;
      }
      if (!this.idInterval) this.idInterval = setInterval(function(){
        this.snake.moveForward();
        this.clearCanvas();
        this.snake.draw();
        this.assets.intervalTicks++;
      }.bind(this), this.assets.snakeCalculationPeriod);
    }
  }.bind(this));
}

Game.prototype.clearCanvas = function(){}
Game.prototype.draw = function(){}
Game.prototype.generateBall = function(){}
Game.prototype.generateBlocks = function(){}
Game.prototype.destroyBlock = function(blockObj){}
Game.prototype.generateWall = function(){}
Game.prototype.finish = function(){}

Game.prototype.setTest = function(){
  var BALLS_TEST = 6;
  for(var i=0; i<BALLS_TEST; i++)
  {
    this.snake.addBall();
  }
}

Game.prototype.clearIntervalIfOtherKeyPressed = function(key)
{
  if(this.lastKeyPressed != key)
  {
    this.assets.resetVerticalIncrement();
    this.assets.intervalTicks = 0;
    clearInterval(this.idInterval);
    this.idInterval = undefined;
  }
}

Game.prototype.setKeyPressed = function(key)
{
  this.lastKeyPressed = key;
}


Game.prototype.checkKey = function()
{
  this.keys.forEach(function(value, key){
    if(value === true)
    {
      switch(key)
      {
        case this.assets.ARROW_RIGHT:
          console.log('right');
          this.clearIntervalIfOtherKeyPressed('right');
          if (!this.idInterval) this.idInterval = setInterval(function(){
            this.snake.moveRight();
            // snake.keepSnakeQuiet();
            this.snake.draw();
            this.assets.intervalTicks++;
          }.bind(this), this.assets.snakeCalculationPeriod);
          this.setKeyPressed('right');
        break;
        case this.assets.ARROW_LEFT:
          console.log('left');
          this.clearIntervalIfOtherKeyPressed('left');
          if (!this.idInterval) this.idInterval = setInterval(function(){
            this.snake.moveLeft();
            // snake.keepSnakeQuiet();
            this.snake.draw();
            this.assets.intervalTicks++;
          }.bind(this), this.assets.snakeCalculationPeriod);
          this.setKeyPressed('left');
        break;
        case this.assets.SPACEBAR:
          // snake.keepSnakeQuiet();
          this.clearIntervalIfOtherKeyPressed('left');
        break;
        case this.assets.A:
          //add ball
          //snake.keepSnakeQuiet();
          this.snake.addBall();
        break;
      }
    }
  }.bind(this));
}