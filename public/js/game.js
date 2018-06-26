function Game(){
  //assets
  this.assets = new Assets();

  //status
  this.status = 'start';  //start, gameover, pause, normal
  this.intervalPaused = false;
  this.gameOver = false;
  this.pauseTicks = this.assets.pauseInterval + 1;
  this.justStarted = true;

  //context
  this.ctx = document.getElementById('canvas').getContext('2d');
  this.ctx.width = 800;
  this.ctx.height = 600;

  //snake
  this.snake = new Snake(this.ctx, this.assets);

  //keyboard
  this.keys = [];
  this.keys[this.assets.ARROW_RIGHT] = false;
  this.keys[this.assets.ARROW_LEFT] = false;
  this.keys[this.assets.SPACEBAR] = false;
  this.keys[this.assets.ENTER] = false;
  this.lastKeyPressed = undefined;

  //intervals
  this.idInterval = undefined;
  this.gameInterval = undefined;
  this.waitingInterval = undefined;

  //scoreBalls
  this.scoreBalls = [];
  this.scoreBallsInterval = undefined;

  //blocks
  this.blocks = [];
  this.blocksInterval = undefined;

  //blockPatterns
  this.blockPatterns = [];
  this.lastY = 0;
  this.patterns = true; //if we work in single blocks (false) or in whole patterns (true)
}
//Test
Game.prototype.setTest = function(){
  //sets test for develop purposes
  //activate test from main.js
  var BALLS_TEST = 10;
  for(var i=0; i<BALLS_TEST; i++)
  {
    this.snake.addBall();
    this.snake.score = 11;
  }
}

//Generate and manage game elements
Game.prototype.generateScoreBalls = function(){
  //fills the array this.scoreBalls
  for(var i=0; i<this.assets.maxScoreBalls; i++)
  {
    var scoreBall = new Scoreball(this.assets, this.ctx);
    scoreBall.setFirstScoreball();
    this._addScoreBallToGame(scoreBall);
  }
  if(this.scoreBallsInterval === undefined) this.scoreBallsInterval = setInterval(function(){
    // if (this._isIntervalPaused() || this._isGameOver()) return;
    if (this.status != 'normal') return;
    for(var i=0; i<this.assets.maxScoreBalls; i++)
    {
      // this.scoreBalls.push(new Scoreball(this.assets, this.ctx));
      var scoreBall = new Scoreball(this.assets, this.ctx);
      this._addScoreBallToGame(scoreBall);
    }
  }.bind(this),this.assets.addingScoreBallsPeriod);
}
Game.prototype._addScoreBallToGame = function(ball){
  var collisionBlockBall = false;
  this.blockPatterns.forEach(function(blockPattern){
    blockPattern.pattern.forEach(function(block){
      var horizontalCollision = ((ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision < block.x + block.width) && (ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision > block.x)) ||
      ((ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision < block.x + block.width) && (ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision > block.x));
      var verticalCollision = ((ball.y - this.assets.snakeBallRadius - this.assets.toleranceToCollision > block.y) && (ball.y - this.assets.snakeBallRadius - this.assets.toleranceToCollision < block.y + block.height)) ||
      ((ball.y + this.assets.snakeBallRadius + this.assets.toleranceToCollision > block.y) && (ball.y + this.assets.snakeBallRadius + this.assets.toleranceToCollision < block.y + block.height))
      var edge = (ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision < 0) || (ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision > this.ctx.width);
      var invalidPosition = (verticalCollision && horizontalCollision) || edge;
      if(invalidPosition)
      {
        collisionBlockBall = true;
      }
    }.bind(this));
  }.bind(this));
  if(!collisionBlockBall)
  {
    this.scoreBalls.push(ball);
  }

}
Game.prototype.generateBlocks = function(){
  //generate and add blocks
  for(var i=0; i<this.assets.maxBlocks; i++)
  {
    var block = new Block(this.assets, this.ctx);
    // block.setFirstBlock();
    this.blocks.push(block);
  }
  if(this.blocksInterval === undefined) this.blocksInterval = setInterval(function(){
    if (this._isIntervalPaused()) return;
    for(var i=0; i<this.assets.maxBlocks; i++)
    {
      this.blocks.push(new Block(this.assets, this.ctx));
    }
  }.bind(this),this.assets.addingBlocksPeriod);
}
Game.prototype.generateBlockPatterns = function(){
  // generate maxPatterns block patterns
  for(var i=0; i<this.assets.maxPatterns; i++)
  {
    var blockPat = new BlockPattern(this.assets, this.ctx);
    blockPat.generatePatternAt(this.lastY, this.snake.score);
    this.blockPatterns.push(blockPat);
    this.lastY = blockPat.y;
    // console.log(this.lastY - this.ctx.height);
  }
}
Game.prototype.checkCollision = function(){
  //collision with balls + add balls
  //collision with blocks + delete balls

  this.scoreBalls.forEach(function(scoreBall, index){
    if(this.snake.hasCollidedWithScoreBall(scoreBall))
    {
      // this.snake.score += scoreBall.points;
      this.scoreBalls.splice(index,1);
      for(var i=0; i<scoreBall.points; i++)
      {
        this.snake.score ++;
        this.snake.addBall.bind(this)
        setTimeout(function(){
          this.snake.addBall();
        }.bind(this), 100 * i);
        this.draw();
      }
    }
  }.bind(this));  

  if(this.patterns)
  {
    this.blockPatterns.forEach(function(blockPattern, indextBlockPattern){
      blockPattern.pattern.forEach(function(block, indexBlock){
        if(this.snake.hasCollidedWithBlock(block))
        {
          if(block.points < this.snake.score)
          {
            for(var i=0; i<block.points; i++)
            {
              setTimeout(function(){
                this.snake.score --;
                this.snake.deleteBall();
                this.draw();
              }.bind(this), 100 * i);
            }
            this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
          }
          else
          {
            this.setGameOver();
            this._pauseInterval();
            for(var i=0; i<block.points; i++)
            {
              setTimeout(function(){
                this.snake.score --;
                if (this.snake.score < 0)
                {
                  this.snake.score = 0;
                }
                this.snake.deleteBall();
                this.draw();
              }.bind(this), 100 * i);
            }
          }
        }
      }.bind(this));
    }.bind(this));
  }
  else
  {
    this.blocks.forEach(function(block, index){
      if(this.snake.hasCollidedWithBlock(block))
      {
        if(block.points < this.snake.score)
        {
          this.snake.score -= block.points;
          this.blocks.splice(index, 1);
          for(var i=0; i<block.points; i++)
          {
            setTimeout(function(){
              var pointsIndex = i;
              this.snake.deleteBall();
              if(pointsIndex >= 0) this._pauseInterval();
              if(pointsIndex === block.points) this.resumeInterval();
              this.draw();
            }.bind(this), 100 * i, i);
          }
        }
        else
        {
          this.setGameOver();
          setTimeout(function(){
            this.snake.deleteBall();
            // if(this.snake.body.length === 0) this._pauseInterval();
          }.bind(this), 100 * i);
          this.draw();
        }
      }
    }.bind(this));
  }
}
Game.prototype.manageBlocks = function(){
  if(this.patterns)
    {
      if(this.blockPatterns.length === 0 || (this.blockPatterns.length > 0 && this.blockPatterns[this.blockPatterns.length -1].y > 0))
      {
        this.generateBlockPatterns();
      } 
      for (var i=0; i<this.blockPatterns.length; i++)
      {
        this.blockPatterns[i].recalculatePosition();
      }
      if (this.blockPatterns.length > 0) this.lastY = this.blockPatterns[this.blockPatterns.length - 1].y;
      else if(this.blockPatterns.length === 1) this.lasty = this.blockPatterns[0].y;
    }
    else 
    {
      this.blocks.recalculatePosition();
    }
    this.deleteBlocksOutOfCanvas();
}
Game.prototype.deleteBlocksOutOfCanvas = function(){
  //deletes blocks out of the canvas
  this.blocks.forEach(function(block, index){
    if (block.y > this.ctx.height) this.blocks.splice(index, 1);
  }.bind(this));
  
  this.blockPatterns.forEach(function(blockPattern, index){
    if (blockPattern.y > this.ctx.height) this.blockPatterns.splice(index, 1);
  }.bind(this));
}

//Drawing functions
Game.prototype.printGeneralScore = function(){
  //prints general score (right bottom red number)
  //for testint purpose
  this.ctx.font="30px Arial";
  this.ctx.fillStyle="white";
  this.ctx.fillText(this.snake.score,this.ctx.width - 70, this.ctx.height - 50);
}
Game.prototype.clearCanvas = function(){
  //clears everything
  this.ctx.clearRect(0,0,this.ctx.width, this.ctx.height);
}
Game.prototype.draw = function(){
  //draw everything
  this.clearCanvas();

  this.scoreBalls.forEach(function(scoreBall){
    // scoreBall.recalculatePosition();
    scoreBall.draw();
  });
 
  this.snake.printScore(); 
  this.snake.draw();

  if(this.patterns)
  {
    this.blockPatterns.forEach(function(pattern){
      pattern.draw();
    });
  }
  else
  {
    this.blocks.forEach(function(block){
      // block.recalculatePosition();
      block.draw();
    });
  }
  
  // this.printGeneralScore();
}

//Game status
Game.prototype._pauseInterval = function(){
  //pauses the main setInterval (pauses the loop)
  this.intervalPaused = true;
}
Game.prototype.resumeInterval = function(){
  //resumes the main setInterval (resumes the loop)
  this.intervalPaused = false;
}
Game.prototype._isIntervalPaused = function(){ 
  //checks if the main setInterval is paused
  return this.intervalPaused;
}
Game.prototype._isGameOver = function(){
  return (this.gameOver && !this._anyKeyPressed());
}
Game.prototype._isVeryBegining = function(){
  return (!this._anyKeyPressed() && this.justStarted === true);
}
Game.prototype._isBeginingAfterGameOver = function(){
  return (this._anyKeyPressed() && this.keys[this.assets.ENTER] === true && this.justStarted === false);
}
Game.prototype._startTheGame = function(){
  return (this._anyKeyPressed() && this.keys[this.assets.ENTER] === true && this.justStarted === true);
}
Game.prototype._pausedGame = function(){
  return (this._anyKeyPressed() && this.keys[this.assets.SPACEBAR] === true && this.justStarted === false);
}
Game.prototype._isNormalMode = function(){
  return (!this._isIntervalPaused() && !this._isGameOver());
}

//Position
Game.prototype.adaptVerticalIncrement = function(key){
  //if there has been a change of direction, it resets snake vertical increment
  if(this.lastKeyPressed != key)
  {
    this.snake.resetVerticalIncrement();
  }
}
Game.prototype.adaptVerticalIncrementFirstPositions = function(key){
  //if there has been a change of direction, it resets snake vertical increment in the first positions
  if(this.lastKeyPressed != key)
  {
    this.snake.resetVerticalIncrement_FP();
  }
}

//Keyboard
Game.prototype._anyKeyPressed = function(){
  //cheks if any key has been pressed
  var anyKeyPressed = false;
  this.keys.forEach(function(value){
    if (value === true) anyKeyPressed = true;
  });
  return anyKeyPressed;
}
Game.prototype.setKeyPressed = function(key)
{
  //sets last key pressed
  this.lastKeyPressed = key;
}

//General functions
Game.prototype._restartGame = function(){
  clearInterval(this.gameInterval);
  this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);
  this.scoreBalls = [];
  this.patterns = [];
  this.blockPatterns = [];
  this.generateScoreBalls();
  if(!this.patterns) this.generateBlocks();
  else this.generateBlockPatterns();
  this.snake.restart();
  this.draw();
}
Game.prototype.init = function(){
  //sets game loop
  //manages events
  //generates game elements (scoreBalls, blocks)
  //make an initial draw

  if(this.gameInterval === undefined) this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);

  window.addEventListener('keydown', function(e){
    switch(e.key)
    {
      case 'ArrowRight':
        this.keys[this.assets.ARROW_RIGHT] = true;
      break;
      case 'ArrowLeft':
        this.keys[this.assets.ARROW_LEFT] = true;
      break;
      case 'Enter':
        this.keys[this.assets.ENTER] = true;
        if(this.status === 'start')
        {
          this.status = 'normal';
        }
        else if(this.status === 'gameover')
        {
          this._restartGame();
          this.status = 'start';
        }
      break;
      case ' ':
        this.keys[this.assets.SPACEBAR] = true;
        if(this.status === 'normal')
        {
          this.status = 'pause';
        }
        else if(this.status === 'pause')
        {
          this.status = 'normal';
        }
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
      this.snake.resetVerticalIncrement();
      this.snake.moveForward();
      this.snake.draw();
    }
  }.bind(this));

  this.generateScoreBalls();
  if(!this.patterns) this.generateBlocks();
  else this.generateBlockPatterns();
  this.draw();
}
Game.prototype.startScreen = function(){
  this.hideAllScreens();
  document.getElementsByClassName('start')[0].style.display = 'block';
}
Game.prototype.pauseScreen = function(){
  this.hideAllScreens();
  document.getElementsByClassName('pause')[0].style.display = 'block';
}
Game.prototype.gameOverScreen = function(){
  this.hideAllScreens();
  document.getElementsByClassName('gameover')[0].style.display = 'block';  
}
Game.prototype.hideAllScreens = function(){
  document.getElementsByClassName('pause')[0].style.display = 'none';
  document.getElementsByClassName('start')[0].style.display = 'none';
  document.getElementsByClassName('gameover')[0].style.display = 'none';
}
Game.prototype._softPauseKey = function(){
  this.pauseTicks = 0;
  if(this.waitingInterval != undefined)
  {
    clearInterval(this.waitingInterval);
    this.waitingInterval = undefined;
  }
  this.waitingInterval = setInterval(function(){
    this.pauseTicks ++;
  }.bind(this), this.assets.gameInterval);
}
Game.prototype._update = function()
{
  // function to be executed at every iteration of the loop
  if(this.status === 'start')
  {
    console.log('status START'); 
    this.startScreen();
    return;
  }
  else if(this.status === 'normal')
  {
    // console.log('status NORMAL');
    console.log(this.snake.body.length);
    this.hideAllScreens();
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
                // this.snake.moveRightFirstPositions();
                this.snake.moveRight();
              }
              else
              {
                this.adaptVerticalIncrement('right');
                this.snake.moveRight();
              }
              this.setKeyPressed('right');
              this.assets.intervalTicks++;
            break;
            case this.assets.ARROW_LEFT:
              if (this.assets.intervalTicks < this.assets.firstIntervalTicks)
              {
                this.adaptVerticalIncrementFirstPositions('left');
                // this.snake.moveLeftFirstPositions();
                this.snake.moveLeft();
              }
              else 
              {
                this.adaptVerticalIncrement('left');
                this.snake.moveLeft();
              }
              this.setKeyPressed('left');
              this.assets.intervalTicks++;
            break;
          }
        }
      }.bind(this));
    }
    this.checkCollision();
    this.scoreBalls.forEach(function(scoreBall){
      scoreBall.recalculatePosition();
    }.bind(this));
    this.manageBlocks();
    this.draw();
  }
  else if(this.status === 'gameover')
  {
    this.gameOverScreen();
    console.log('status GAMEOVER');
    //this.gameOver && !this._anyKeyPressed()
    //if user already lost
    this.setKeyPressed(undefined);
    this.justStarted = false;
    return;
  }
  else if(this.status === 'pause')
  {
    this.pauseScreen();
    console.log('status PAUSE');
    //this._anyKeyPressed() && this.keys[this.assets.SPACEBAR] === true && this.justStarted === false
    //spacebar is pressed to pause the game
    this.adaptVerticalIncrement('space');
    if(this._isIntervalPaused() && this.pauseTicks > this.assets.pauseInterval){
      this.resumeInterval();
      this.hideAllScreens();
      this._softPauseKey();
    }
    else if(this.pauseTicks > this.assets.pauseInterval)
    {
      this._pauseInterval();
      this.pauseScreen();
      this._softPauseKey();
    }
  }
  return;
}
Game.prototype.setGameOver = function(){
  // clearInterval(this.gameInterval);
  this.gameOver = true;
  //show gameOver image
  this.gameOverScreen();
  this.status = 'gameover';
}

// Game.prototype.generateWall = function(){}