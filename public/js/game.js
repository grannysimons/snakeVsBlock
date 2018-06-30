function Game(){
  //assets
  this.assets = new Assets();

  //status
  this.status = 'start';  //start, gameover, pause, normal
  this.intervalPaused = false;
  this.gameOver = false;
  this.pauseTicks = this.assets.pauseInterval + 1;
  this.justStarted = true;
  this.underStarFX = false;

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
  this.starTimeout = undefined;
  this.starInterval = undefined;

  //scoreBalls
  this.scoreBalls = [];
  this.scoreBallsInterval = undefined;

  //blocks
  this.blocks = [];
  this.blocksInterval = undefined;
  this.crashInterval = undefined;

  //blockPatterns
  this.blockPatterns = [];
  this.lastY = 0;
  this.patterns = true; //if we work in single blocks (false) or in whole patterns (true)

  //score
  this.maxScore = 0;
  this.score = 0;

  //sound
  this.soundStart = ["soundStart"];
  this.soundStar = ["soundStar1", "soundStar2", "soundStar3", "soundStar4"];
  this.soundCrash = ["soundCrash"];
  this.soundGameOver = ["soundGameOver1" , "soundGameOver2" , "soundGameOver3"];
  this.playingSound = undefined;
}
//Test
Game.prototype.setTest = function(){
  //sets test for develop purposes
  //activate test from main.js
  var BALLS_TEST = 70;
  for(var i=0; i<BALLS_TEST; i++)
  {
    this.snake.addBall();
    this.snake.score = 71;
  }
}

//Sound functions
Game.prototype.loadSound = function () {
  createjs.Sound.registerSound("../sounds/crash.mp3", this.soundCrash[0]);
  createjs.Sound.registerSound("../sounds/gameover1.mp3", this.soundGameOver[0]);
  createjs.Sound.registerSound("../sounds/gameover2.mp3", this.soundGameOver[1]);
  createjs.Sound.registerSound("../sounds/gameover3.mp3", this.soundGameOver[2]);
  createjs.Sound.registerSound("../sounds/star1.mp3", this.soundStar[0]);
  createjs.Sound.registerSound("../sounds/star2.mp3", this.soundStar[1]);
  createjs.Sound.registerSound("../sounds/star3.mp3", this.soundStar[2]);
  createjs.Sound.registerSound("../sounds/start.mp3", this.soundStart[0]);
}
Game.prototype.playSound = function (soundID) {
  createjs.Sound.play(soundID);
}

//Generate and manage game elements
Game.prototype._generateScoreBalls = function(){
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
  var invalidPosition = false;
  var textVerticalSpace = 20;
  this.blockPatterns.forEach(function(blockPattern){
    blockPattern.pattern.forEach(function(block){
      var horizontalCollision = ((ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision < block.x + block.width) && (ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision > block.x)) ||
      ((ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision < block.x + block.width) && (ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision > block.x));
      var verticalCollision = ((ball.y - this.assets.snakeBallRadius - this.assets.toleranceToCollision - textVerticalSpace > block.y) && (ball.y - this.assets.snakeBallRadius - this.assets.toleranceToCollision - textVerticalSpace < block.y + block.height)) ||
      ((ball.y + this.assets.snakeBallRadius + this.assets.toleranceToCollision > block.y) && (ball.y + this.assets.snakeBallRadius + this.assets.toleranceToCollision < block.y + block.height));
      var edge = (ball.x - this.assets.snakeBallRadius - this.assets.toleranceToCollision < 0) || (ball.x + this.assets.snakeBallRadius + this.assets.toleranceToCollision > this.ctx.width);
      invalidPosition = (verticalCollision && horizontalCollision) || edge;
    }.bind(this));
  }.bind(this));
  if(!invalidPosition)
  {
    this.scoreBalls.push(ball);
  }

}
Game.prototype._generateBlocks = function(){
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
Game.prototype._generateBlockPatterns = function(){
  // generate maxPatterns block patterns
  for(var i=0; i<this.assets.maxPatterns; i++)
  {
    var blockPat = new BlockPattern(this.assets, this.ctx);
    blockPat.generatePatternAt(this.lastY, this.snake.score);
    this.blockPatterns.push(blockPat);
    this.lastY = blockPat.y;
  }
}
Game.prototype._checkCollision = function(){
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
        this._draw();
      }
      if(this.snake.score > this.score) this.score = this.snake.score;
      if(this.score > this.maxScore) this.maxScore = this.score;
      this._printScore();
    }
  }.bind(this));  

  if(this.patterns)
  {
    this.blockPatterns.forEach(function(blockPattern, indextBlockPattern){
      blockPattern.pattern.forEach(function(block, indexBlock){
        if(this.snake.hasCollidedWithBlock(block))
        {
          if(this.underStarFX)
          {
            this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
            this._crashFX(block);
          }
          else if(block.points < this.snake.score)
          {
            if(block.hasStar() === true)
            {
              this.snake.score -= block.points;
              for(var i=0; i<block.points; i++)
              {
                this.snake.deleteBall();
              }
              this.assets.gameInterval = this.assets.starInterval;
              clearInterval(this.gameInterval);
              this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);
              this.underStarFX = true;
              if(this.starTimeout === undefined) this.starTimeout = setTimeout(function(){
                this.assets.gameInterval = this.assets.normalInterval;
                clearInterval(this.gameInterval);
                this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);
                this.starTimeout = undefined;
                clearInterval(this.starInterval);
                this.starInterval = undefined;
                this.underStarFX = false;
                this.snake.color = this.assets.snakeColorNormal;
              }.bind(this), this.assets.starTime);
              if(this.starInterval === undefined) this.starInterval = setInterval(function(){
                this.snake.color = this.assets.starColors[Math.floor(Math.random() * this.assets.starColors.length)];
              }.bind(this), this.assets.starColorInterval);
            }
            if(!this.underStarFX)
            {
              for(var i=0; i<block.points; i++)
              {
                setTimeout(function(){
                  this.snake.score --;
                  this.snake.deleteBall();
                  this._draw();
                }.bind(this), 100 * i);
              }
            }

            this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
            this._crashFX(block);
          }
          else
          {
            // this._pauseInterval();
            for(var i=0; i<block.points; i++)
            {
              this.snake.score --;
              if (this.snake.score < 0)
              {
                this.snake.score = 0;
              }
              this.snake.deleteBall();
              this._draw();

              // setTimeout(function(){
              //   this.snake.score --;
              //   if (this.snake.score < 0)
              //   {
              //     this.snake.score = 0;
              //   }
              //   this.snake.deleteBall();
              //   this._draw();
              // }.bind(this), 100 * i);
            }
            this._setGameOver();
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

        if(this.underStarFX)
        {
          this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
          this._crashFX(block);
        }
        else if(block.points < this.snake.score)
        {
          this.snake.score -= block.points;
          this.blocks.splice(index, 1);
          for(var i=0; i<block.points; i++)
          {
            setTimeout(function(){
              var pointsIndex = i;
              this.snake.deleteBall();
              if(pointsIndex >= 0) this._pauseInterval();
              if(pointsIndex === block.points) this._resumeInterval();
              this._draw();
            }.bind(this), 100 * i, i);
          }
        }
        else
        {
          this._setGameOver();
          setTimeout(function(){
            this.snake.deleteBall();
            // if(this.snake.body.length === 0) this._pauseInterval();
          }.bind(this), 100 * i);
          this._draw();
        }
      }
    }.bind(this));
  }
}
Game.prototype._manageBlocks = function(){
  if(this.patterns)
    {
      if(this.blockPatterns.length === 0 || (this.blockPatterns.length > 0 && this.blockPatterns[this.blockPatterns.length -1].y > 0))
      {
        this._generateBlockPatterns();
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
    this._deleteBlocksOutOfCanvas();
}
Game.prototype._deleteBlocksOutOfCanvas = function(){
  //deletes blocks out of the canvas
  this.blocks.forEach(function(block, index){
    if (block.y > this.ctx.height) this.blocks.splice(index, 1);
  }.bind(this));
  
  this.blockPatterns.forEach(function(blockPattern, index){
    if (blockPattern.y > this.ctx.height) this.blockPatterns.splice(index, 1);
  }.bind(this));
}
Game.prototype._crashFX = function(block){
  var originX = this.snake.body[0].x;
  var originY = this.snake.body[0].y;
  var x1 = originX;
  var x2 = originX;
  var y1 = originY;
  var y2 = originY;
  var radi = this.assets.snakeBallRadius - 1;
  if(!this.crashInterval) this.crashInterval = setInterval(function(){
    x1+=5;
    y1+=5;
    x2-=5;
    y2-=5;
    radi = radi<=0.6 ? 0 : radi-0.6;
    this._clearCanvas();
    this._draw();

    this.ctx.beginPath();
    this.ctx.arc(x1,y1, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(x1,y2, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(x2,y1, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(x2,y2, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(x1,originY+1, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(x2,originY+1, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(originX+1,y1, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.arc(originX+1,y2, radi, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = 'yellow';
    this.ctx.fill();
    this.ctx.closePath();
  
    if (radi <= 0.0)
    {
      clearInterval(this.crashInterval);
      this.crashInterval = undefined;
    }
  }.bind(this), 40);
}

//Drawing functions
Game.prototype._printScore = function(){
  //prints score of this round
  document.getElementsByClassName('score')[0].innerHTML = this.score;
  //prints maximum score since web app was launched
  document.getElementsByClassName('max-score')[0].innerHTML = this.maxScore;
}
Game.prototype._clearCanvas = function(){
  //clears everything
  this.ctx.clearRect(0,0,this.ctx.width, this.ctx.height);
}
Game.prototype._draw = function(){
  //draw everything
  this._clearCanvas();

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
  
  this._printScore();
}

//Game status
Game.prototype._pauseInterval = function(){
  //pauses the main setInterval (pauses the loop)
  this.intervalPaused = true;
}
Game.prototype._resumeInterval = function(){
  //resumes the main setInterval (resumes the loop)
  this.intervalPaused = false;
}
Game.prototype._restartGame = function(){
  clearInterval(this.gameInterval);
  this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);
  this.scoreBalls = [];
  this.patterns = [];
  this.blockPatterns = [];
  this.score = 0;
  if(!this.patterns) this._generateBlocks();
  else this._generateBlockPatterns();
  this._generateScoreBalls();
  this.snake.restart();
  this._draw();
}
Game.prototype._isIntervalPaused = function(){ 
  //checks if the main setInterval is paused
  return this.intervalPaused;
}
Game.prototype._isGameOver = function(){
  return (this.gameOver && !this._anyKeyPressed());
}
Game.prototype._startScreen = function(){
  this._hideAllScreens();
  document.getElementsByClassName('start')[0].style.display = 'block';
}
Game.prototype._pauseScreen = function(){
  this._hideAllScreens();
  document.getElementsByClassName('pause')[0].style.display = 'block';
}
Game.prototype._gameOverScreen = function(){
  this._hideAllScreens();
  document.getElementsByClassName('gameover')[0].style.display = 'block';  
}
Game.prototype._hideAllScreens = function(){
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
Game.prototype._setGameOver = function(){
  // clearInterval(this.gameInterval);
  this.gameOver = true;
  //show gameOver image
  this._gameOverScreen();
  this.status = 'gameover';
}

//Position
Game.prototype._adaptVerticalIncrement = function(key){
  //if there has been a change of direction, it resets snake vertical increment
  if(this.lastKeyPressed != key)
  {
    this.snake.resetVerticalIncrement();
  }
}
Game.prototype._adaptVerticalIncrementFirstPositions = function(key){
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
Game.prototype._setKeyPressed = function(key)
{
  //sets last key pressed
  this.lastKeyPressed = key;
}

//General functions
Game.prototype.init = function(){
  //sets game loop
  //manages events
  //generates game elements (scoreBalls, blocks)
  //make an initial draw

  if(!this.gameInterval) this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);

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
          if (!this.playingSound) this.playingSound = setTimeout(function(){
            this.playSound(this.soundStart[0]);
          }, 1000);
          // this._restartGame();
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

  this._generateInitialScenario();
  this._draw();
}
Game.prototype._generateInitialScenario = function(){
  if(!this.patterns) this._generateBlocks();
  else this._generateBlockPatterns();
  this._generateScoreBalls();
}
Game.prototype._update = function()
{
  // function to be executed at every iteration of the loop
  if(this.status === 'start')
  {
    this._startScreen();
    return;
  }
  else if(this.status === 'normal')
  {
    // console.log(this.snake.body.length);
    this._hideAllScreens();
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
                this._adaptVerticalIncrementFirstPositions('right');
                // this.snake.moveRightFirstPositions();
                this.snake.moveRight();
              }
              else
              {
                this._adaptVerticalIncrement('right');
                this.snake.moveRight();
              }
              this._setKeyPressed('right');
              this.assets.intervalTicks++;
            break;
            case this.assets.ARROW_LEFT:
              if (this.assets.intervalTicks < this.assets.firstIntervalTicks)
              {
                this._adaptVerticalIncrementFirstPositions('left');
                // this.snake.moveLeftFirstPositions();
                this.snake.moveLeft();
              }
              else 
              {
                this._adaptVerticalIncrement('left');
                this.snake.moveLeft();
              }
              this._setKeyPressed('left');
              this.assets.intervalTicks++;
            break;
          }
        }
      }.bind(this));
    }
    this._checkCollision();
    this.scoreBalls.forEach(function(scoreBall){
      scoreBall.recalculatePosition();
    }.bind(this));
    this._manageBlocks();
    this._draw();
  }
  else if(this.status === 'gameover')
  {
    this._gameOverScreen();
    //if user already lost
    this._setKeyPressed(undefined);
    this.justStarted = false;
    return;
  }
  else if(this.status === 'pause')
  {
    this._pauseScreen();
    //this._anyKeyPressed() && this.keys[this.assets.SPACEBAR] === true && this.justStarted === false
    //spacebar is pressed to pause the game
    this._adaptVerticalIncrement('space');
    if(this._isIntervalPaused() && this.pauseTicks > this.assets.pauseInterval){
      this._resumeInterval();
      this._hideAllScreens();
      this._softPauseKey();
    }
    else if(this.pauseTicks > this.assets.pauseInterval)
    {
      this._pauseInterval();
      this._pauseScreen();
      this._softPauseKey();
    }
  }
  return;
}

Game.prototype.gameOverReload = function(){
  if(this.status === 'gameover')
  {
    window.location.reload(true);
  }
}

// Game.prototype.generateWall = function(){}