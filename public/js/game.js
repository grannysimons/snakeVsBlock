function Game(){
  this.assets = new Assets();
  this.ctx = document.getElementById('canvas').getContext('2d');
  this.ctx.width = 800;
  this.ctx.height = 600;
  this.snake = new Snake(this.ctx, this.assets);
  this.scoreBalls = [];
  this.blocks = [];
  this.keys = [];
  this.keys[this.assets.ARROW_RIGHT] = false;
  this.keys[this.assets.ARROW_LEFT] = false;
  this.keys[this.assets.SPACEBAR] = false;
  this.idInterval = undefined;
  this.lastKeyPressed = undefined;
  this.scoreBallsInterval = undefined;
  this.blocksInterval = undefined;
}
Game.prototype.init = function(){
  this.snake.startLoop(this._update.bind(this));

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
    for (var i = 0; i<this.keys.length; i++)
    {
      this.keys[i]=false;
    }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft")
    {
      this.assets.intervalTicks = 0;
      this.assets.resetVerticalIncrement();
      this.snake.moveForward();
      // this.clearCanvas();
      this.snake.draw();
    }
  }.bind(this));

  this.generateScoreBalls();
  this.generateBlocks();
  this.draw();
}
Game.prototype.generateScoreBalls = function(){
  for(var i=0; i<this.assets.maxScoreBalls; i++)
  {
    var scoreBall = new Scoreball(this.assets, this.ctx);
    scoreBall.setFirstScoreball();
    this.scoreBalls.push(scoreBall);
  }
  this.scoreBallsInterval = setInterval(function(){
    if (this.isIntervalPaused()) return;
    for(var i=0; i<this.assets.maxScoreBalls; i++)
    {
      this.scoreBalls.push(new Scoreball(this.assets, this.ctx));
    }
  }.bind(this),this.assets.addingScoreBallsPeriod);
}
Game.prototype.checkCollision = function(){
  //collision with balls
  this.scoreBalls.forEach(function(scoreBall, index){
    if(this.snake.hasCollidedWithScoreBall(scoreBall))
    {
      this.snake.score += scoreBall.points;
      this.scoreBalls.splice(index,1);
      for(var i=0; i<scoreBall.points; i++)
      {
        this.snake.addBall.bind(this)
        setTimeout(function(){
          this.snake.addBall();
        }.bind(this), 100 * i);
        this.draw();
      }
    }
  }.bind(this));  
  //collision with blocks
  this.blocks.forEach(function(block, index){
    if(this.snake.hasCollidedWithBlock(block))
    {
      if(block.points < this.snake.score)
      {
        this.snake.score -= block.points;
        this.blocks.splice(index, 1);
        console.log('block.points: ' + block.points);
        for(var i=0; i<block.points; i++)
        {
          setTimeout(function(){
            var pointsIndex = i;
            this.snake.deleteBall();
            if(pointsIndex >= 0) this.pauseInterval();
            if(pointsIndex === block.points) this.resumeInterval();
            this.draw();
            console.log('pointsIndex: ' + pointsIndex);
          }.bind(this), 100 * i, i);
        }
      }
      else
      {
        console.log('You lost!');
        setTimeout(function(){
          this.snake.deleteBall();
          if(this.snake.body.length === 0) this.pauseInterval();
        }.bind(this), 100 * i);
        this.draw();
      }
    }
  }.bind(this));
}
Game.prototype.printScore = function(){
  this.ctx.font="30px Arial";
  this.ctx.fillStyle="red";
  this.ctx.fillText(this.snake.score,this.ctx.width - 70, this.ctx.height - 50);
}
// Game.prototype.clearCanvas = function(){}
Game.prototype.draw = function(){
  this.ctx.clearRect(0,0,this.ctx.width, this.ctx.height);
  this.snake.draw();
  this.scoreBalls.forEach(function(scoreBall){
    scoreBall.recalculatePosition();
    scoreBall.draw();
  });
  this.blocks.forEach(function(block){
    block.recalculatePosition();
    block.draw();
  });
  this.printScore();
  this.snake.printScore(); 
}
Game.prototype.generateBall = function(){}
Game.prototype.generateBlocks = function(){
  for(var i=0; i<this.assets.maxBlocks; i++)
  {
    var block = new Block(this.assets, this.ctx);
    block.setFirstBlock();
    this.blocks.push(block);
  }
  this.blocksInterval = setInterval(function(){
    if (this.isIntervalPaused()) return;
    for(var i=0; i<this.assets.maxBlocks; i++)
    {
      this.blocks.push(new Block(this.assets, this.ctx));
    }
  }.bind(this),this.assets.addingBlocksPeriod);
}
Game.prototype.deleteBlocksOutOfCanvas = function(){
  this.blocks.forEach(function(block, index){
    if (block.y > this.ctx.height) this.blocks.splice(index, 1);
  }.bind(this));
}
Game.prototype.destroyBlock = function(blockObj){}
Game.prototype.generateWall = function(){}
Game.prototype.finish = function(){}
Game.prototype.setTest = function(){
  // var BALLS_TEST = 1;
  // for(var i=0; i<BALLS_TEST; i++)
  // {
  //   this.snake.addBall();
  // }
}
Game.prototype.pauseInterval = function(){
  this.snake.isIntervalPaused = true;
}
Game.prototype.resumeInterval = function(){
  this.snake.isIntervalPaused = false;
}
Game.prototype.isIntervalPaused = function(){
  return this.snake.isIntervalPaused;
}
Game.prototype.adaptVerticalIncrement = function(key)
{
  if(this.lastKeyPressed != key)
  {
    this.assets.resetVerticalIncrement();
  }
}
Game.prototype.adaptVerticalIncrementFirstPositions = function(key)
{
  if(this.lastKeyPressed != key)
  {
    this.assets.resetVerticalIncrement_FP();
  }
}
Game.prototype.setKeyPressed = function(key)
{
  this.lastKeyPressed = key;
}
Game.prototype._update = function()
{
  //first check if paused
  if(this._anyKeyPressed() && this.keys[this.assets.SPACEBAR] === true)
  {
    this.adaptVerticalIncrement('space');
    if(this.isIntervalPaused()) this.resumeInterval();
    else this.pauseInterval();
  }
  if(!this.isIntervalPaused())
  {
    if(this._anyKeyPressed() === false)
    {
      if (this.assets.intervalTicks < this.assets.firstIntervalTicks)
      {
        this.snake.moveForwardFirstPositions(this.lastKeyPressed);
      }
      else
      {
        this.snake.moveForward();
      }
      // this.snake.draw();
      this.assets.intervalTicks++;
    }
    else
    {
      this.keys.forEach(function(value, key){
        if(value === true)
        {
          switch(key)
          {
            case this.assets.ARROW_RIGHT:
              if (this.assets.intervalTicks < this.assets.firstIntervalTicks)
              {
                this.adaptVerticalIncrementFirstPositions('right');
                this.snake.moveRightFirstPositions();
                // this.snake.draw();
              }
              else
              {
                this.adaptVerticalIncrement('right');
                this.snake.moveRight();
                // this.snake.draw();
              }
              this.setKeyPressed('right');
              this.assets.intervalTicks++;
            break;
            case this.assets.ARROW_LEFT:
              if (this.assets.intervalTicks < this.assets.firstIntervalTicks)
              {
                this.adaptVerticalIncrementFirstPositions('left');
                this.snake.moveLeftFirstPositions();
                // this.snake.draw();
              }
              else 
              {
                this.adaptVerticalIncrement('left');
                this.snake.moveLeft();
                // this.snake.draw();
              }
              this.setKeyPressed('left');
              this.assets.intervalTicks++;
            break;
            case this.assets.SPACEBAR:
              // snake.keepSnakeQuiet();
            
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
    this.checkCollision();
    this.deleteBlocksOutOfCanvas();
    this.draw();
  }
}
Game.prototype._anyKeyPressed = function(){
  var anyKeyPressed = false;
  this.keys.forEach(function(value){
    if (value === true) anyKeyPressed = true;
  });
  return anyKeyPressed;
}