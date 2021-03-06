function Game(ctx, assets, keyboard){
  //assets
  this.assets = assets;

  //keyboard
  this.keyboard = keyboard;

  //status
  this.status = 'start';  //start, gameover, pause, normal

  //context
  this.ctx = ctx;
  this.ctx.width = 800;
  this.ctx.height = 600;

  //snake
  this.snake = new Snake(this.ctx, this.assets);

  //star
  this.starTimeout = undefined;
  this.starInterval = undefined;
  this.underStarFX = false;

  //scoreBalls
  this.scoreBalls = [];
  this.scoreBallsInterval = undefined;

  //blocks
  this.crashInterval = undefined;
  this.destroyingBlockInterval = undefined;
  this.destroying = false;
  this.currentDestroyingBlock = undefined;

  //blockPatterns
  this.blockPatterns = [];
  this.lastY = -200;
  this.lastDistance = 0;

  //wallPatterns
  this.wallPatterns = [];
  this.collisionWithWall = false;

  //score
  this.maxScore = 0;
  this.score = 0;

  //sound
  this.audioStart = document.getElementById('audio-start');
  this.audioCrash = document.getElementById('audio-crash');
  this.audioGameover = [document.getElementById('audio-gameover-1'), document.getElementById('audio-gameover-2'), document.getElementById('audio-gameover-3')];
  this.audioStar = [document.getElementById('audio-star-1'), document.getElementById('audio-star-2'), document.getElementById('audio-star-3')];
  this.audioScoreBall = document.getElementById('audio-scoreBall');
}

//General functions
Game.prototype.init = function(){
  //sets game loop
  //manages events
  //generates game elements (scoreBalls, blocks)
  //make an initial draw
  this.assets.directionTicks = 0;
  this._generateInitialScenario();
}
Game.prototype._generateInitialScenario = function(){
  this._generatePatterns();
  this._generateScoreBalls();
}
Game.prototype.restartGame = function(){
  this.destroying = false;
  this.scoreBalls = [];
  this.blockPatterns = [];
  this.score = 0;
  this.lastY = -200;
  this._generateInitialScenario();
  this.snake.restart();
  this.assets.drawInterval = this.assets.drawIntervalInit;
  // this._draw();
}
Game.prototype.pauseInterval = function(){
  //pauses the main setInterval (pauses the loop)
  game.intervalPaused = true;
}
Game.prototype.resumeInterval = function(){
  //resumes the main setInterval (resumes the loop)
  game.intervalPaused = false;
}

//Generate and manage game elements
Game.prototype._generateScoreBalls = function(){
  //fills the array this.scoreBalls
  for(var i=0; i<this.assets.maxScoreBalls; i++)
  {
    var scoreBall = new Scoreball(this.assets, this.ctx);
    scoreBall.setFirstScoreball();
    this.scoreBalls.push(scoreBall);
  }
  if(this.scoreBallsInterval === undefined) this.scoreBallsInterval = setInterval(function(){
    if (this.status != 'normal') return;
    for(var i=0; i<this.assets.maxScoreBalls; i++)
    {
      var scoreBall = new Scoreball(this.assets, this.ctx);
      this.scoreBalls.push(scoreBall);
    }
  }.bind(this),this.assets.addingScoreBallsPeriod);
}
Game.prototype.checkScoreBallsPosition = function()
{
  var radius = this.assets.snakeBallRadius;
  var textVerticalSpace = 20;
  this.blockPatterns.forEach(function(blockPattern){
    blockPattern.pattern.forEach(function(block){
      this.scoreBalls.forEach(function(ball, index){
        var horizontalCollision = ((ball.x - radius - this.assets.toleranceToCollision < block.x + block.width) && (ball.x - radius - this.assets.toleranceToCollision > block.x)) ||
        ((ball.x + radius + this.assets.toleranceToCollision < block.x + block.width) && (ball.x + radius + this.assets.toleranceToCollision > block.x));
        var verticalCollision = ((ball.y - radius - this.assets.toleranceToCollision - textVerticalSpace > block.y) && (ball.y - radius - this.assets.toleranceToCollision - textVerticalSpace < block.y + block.height)) ||
        ((ball.y + radius + this.assets.toleranceToCollision > block.y) && (ball.y + radius + this.assets.toleranceToCollision < block.y + block.height));
        var edge = (ball.x - radius - this.assets.toleranceToCollision < 0) || (ball.x + radius + this.assets.toleranceToCollision > this.ctx.width);
        if ((verticalCollision && horizontalCollision) || edge)
        {
          this.scoreBalls.splice(index,1);
        }
      }.bind(this));
    }.bind(this));
  }.bind(this));

  this.scoreBalls.forEach(function(ball1){
    this.scoreBalls.forEach(function(ball2, index){
      if(ball1 != ball2)
      {
        var horizontalCollision = ((ball1.x + radius < ball2.x + radius) && (ball1.x + radius > ball2.x)) ||
        ((ball2.x + radius < ball1.x + radius) && (ball2.x + radius > ball1.x));
        var verticalCollision = ((ball1.y - radius > ball2.y - radius) && (ball1.y - radius < ball2.y) )||
        ((ball2.y - radius > ball1.y - radius) && (ball2.y - radius < ball1.y) );
        if (verticalCollision && horizontalCollision)
        {
          this.scoreBalls.splice(index,1);
        }
      }
    }.bind(this))
  }.bind(this));

  this.scoreBalls.forEach(function(ball, index){
    this.wallPatterns.forEach(function(wall){
      var horizontalCollision = ((ball.x + radius > wall.x) && (ball.x + radius < wall.x + wall.width)) || ((ball.x - radius < wall.x + wall.width) && (ball.x - radius > wall.x));  
      var verticalCollision = ((ball.y - radius > wall.y) && (ball.y - radius < wall.y + wall.height)) || ((ball.y + radius < wall.y + wall.height) && (ball.y + radius > wall.y));
      if(verticalCollision && horizontalCollision)
      {
        this.scoreBalls.splice(index,1);
      }
    }.bind(this));
  }.bind(this));
}
Game.prototype._generatePatterns = function(){
  // generate maxPatterns block patterns
  for(var i=0; i<this.assets.maxPatterns; i++)
  {
    var blockPat = new BlockPattern(this.assets, this.ctx);
    this.lastDistance = blockPat.generatePatternAt(this.lastY, this.snake.score);
    this.blockPatterns.push(blockPat);
    
    if(this.assets.WALLS)
    {
      var wallPat = new WallPattern(this.assets, this.ctx);
      wallPat.generateWallAt(this.lastY, this.lastDistance);
      this.wallPatterns.push(wallPat);
      this.lastY = blockPat.y;
    }
  }
}
Game.prototype.checkCollision = function(){
  //collision with balls + add balls
  //collision with blocks + delete balls
  //collision with walls + stop ball from moving out of it
  this.scoreBalls.forEach(function(scoreBall, index){
    if(this.snake.hasCollidedWithScoreBall(scoreBall))
    {
      this.audioScoreBall.play();
      this.scoreBalls.splice(index,1);
      for(var i=0; i<scoreBall.points; i++)
      {
        this.snake.score ++;
        
        setTimeout(function(){
          this.snake.addBall();
        }.bind(this), 100 * i);
        this.draw();
      }
      if(this.snake.score > this.score) this.score = this.snake.score;
      if(this.score > this.maxScore) this.maxScore = this.score;
      this.printScore();
    }
  }.bind(this));  

  var collision = false;
  this.blockPatterns.forEach(function(blockPattern, indextBlockPattern){
    blockPattern.pattern.forEach(function(block, indexBlock){
      if(this.snake.hasCollidedWithBlock(block))
      {
        collision = true;
        if(this.currentDestroyingBlock != block)
        {
          clearInterval(this.destroyingBlockInterval);
          this.destroyingBlockInterval = undefined;
        }
        if(this.underStarFX)
        {
          this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
          this._crashFX();
          setTimeout(function(){
            this.stopAudios(true, false, false, false, false);
            var randIndex = Math.floor(Math.random() * this.audioStar.length);
            this.audioStar[randIndex].play();
          }.bind(this), 3000);
        }
        this.currentDestroyingBlock = block;
        if(!this.destroyingBlockInterval) this.destroyingBlockInterval = setInterval(function(){
          this.snake.score --;
          this.snake.deleteBall();
          this.destroying = true;
          block.points--;
          this.draw();
          if(this.keyboard.isSpacebarPressed())
          {
            if(isSoftPauseKeyOff() || pauseTicks > assets.pauseInterval)
            {
              clearInterval(this.destroyingBlockInterval);
              this.destroyingBlockInterval = undefined;
              game.status = 'pause';
              softPauseKeyOff();
              softPauseKeyOn();
              game.stopAudios(true,false,false,true,false);
            }
          }
          //breaking block
          if (block.points <= 0 && this.snake.score > 0)
          {
            clearInterval(this.destroyingBlockInterval);
            this.destroyingBlockInterval = undefined;
            this._crashFX();
            this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
            if(block.hasStar() === true)
            {
              this.underStarFX = true;
              if(this.starTimeout === undefined) this.starTimeout = setTimeout(function(){
                this.status = 'normal';
                this.assets.gameInterval = this.assets.normalInterval;
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
            this.destroying = false;
          }
          //breaking snake
          else if(block.points >= 0 && this.snake.score <= 0)
          {
            clearInterval(this.destroyingBlockInterval);
            this.destroyingBlockInterval = undefined;
            this.pauseInterval();
            this.status = 'gameover';
            this.stopAudios(true, true, true, true, true);
            var randIndex = Math.floor(Math.random() * this.audioGameover.length);
            this.audioGameover[randIndex].play();
          }
        }.bind(this), 50);
      }
    }.bind(this));
  }.bind(this));

  this.collisionWithWall = false;
  this.wallPatterns.forEach(function(pattern){
    pattern.pattern.forEach(function(wall){
      if(this.snake.hasCollidedWithWall(wall))
      {
        var head = this.snake.body[0];
        var radius = this.assets.snakeBallRadius;
        if(this.keyboard.isRightPressed())
        {
          this.snake.body[0].x = wall.x - radius; 
        }
        else if(this.keyboard.isLeftPressed())        
        {
          this.snake.body[0].x = wall.x + wall.width + radius; 
        }
        this.collisionWithWall = true;
        this.clearCanvas();
        this.draw();
      }
    }.bind(this));
  }.bind(this));

  if(collision === false && this.destroyingBlockInterval)
  {
    clearInterval(this.destroyingBlockInterval);
    this.destroyingBlockInterval = undefined;
    this.destroying = false;
  }
}
Game.prototype.manageBlocks = function(){
  if(this.blockPatterns.length === 0 || (this.blockPatterns.length > 0 && this.blockPatterns[this.blockPatterns.length -1].y > 0))
  {
    this._generatePatterns();
  } 
  for (var i=0; i<this.blockPatterns.length; i++)
  {
    this.blockPatterns[i].recalculatePosition();
  }
  if (this.blockPatterns.length > 0) this.lastY = this.blockPatterns[this.blockPatterns.length - 1].y;
  this._deleteBlocksOutOfCanvas();
}
Game.prototype.manageWalls = function(){
  for (var i=0; i<this.wallPatterns.length; i++)
  {
    this.wallPatterns[i].recalculatePosition();
  }
  this._deleteWallsOutOfCanvas();
}
Game.prototype._deleteBlocksOutOfCanvas = function(){
  //deletes blocks out of the canvas
  this.blockPatterns.forEach(function(blockPattern, index){
    if (blockPattern.y > this.ctx.height) this.blockPatterns.splice(index, 1);
  }.bind(this));
}
Game.prototype._deleteWallsOutOfCanvas = function(){
  //deletes blocks out of the canvas
  this.wallPatterns.forEach(function(wallPattern, index){
    if (wallPattern.y > this.ctx.height) this.wallPatterns.splice(index, 1);
  }.bind(this));
}
Game.prototype._crashFX = function(){
  this.stopAudios(false, false, false, false, false);
  this.audioCrash.play();

  var originX = this.snake.body[0].x;
  var originY = this.snake.body[0].y;
  var x1 = originX;
  var x2 = originX;
  var y1 = originY;
  var y2 = originY;
  var radi = this.assets.snakeBallRadius;
  if(!this.crashInterval) this.crashInterval = setInterval(function(){
    x1+=5;
    y1+=5;
    x2-=5;
    y2-=5;
    radi = radi<=0.3 ? 0 : radi-0.3;
    this.clearCanvas();
    this.draw();

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

//Audio functions
Game.prototype.stopAudios = function(start, crash, score, gameover, star){
  if(start)
  {
    this.audioStart.pause();
    this.audioStart.currentTime = 0;      
  }
  if(crash)
  {
    this.audioCrash.pause();
    this.audioCrash.currentTime = 0;
  }

  if(score)
  {
    this.audioScoreBall.pause();
    this.audioScoreBall.currentTime = 0;
  }
  
  if(gameover) this.audioGameover.forEach(function(audio){
    audio.pause();
    audio.currentTime = 0;
  });

  if(star) this.audioStar.forEach(function(audio){
    audio.pause();
    audio.currentTime = 0;
  });
}
Game.prototype.audiosPlaying = function(){
  var audiosPlaying = [];
  if(this.audioStart.currentTime != 0) audiosPlaying.push(this.audioStart);
  if(this.audioCrash.currentTime != 0) audiosPlaying.push(this.audioCrash);
  if(this.audioScoreBall.currentTime != 0) audiosPlaying.push(this.audioScoreBall);
  this.audioGameover.forEach(function(audio){
    if(audio.currentTime != 0) audiosPlaying.push(audio);
  });
  this.audioStar.forEach(function(audio){
    if(audio.currentTime != 0) audiosPlaying.push(audio);
  });
  return audiosPlaying;
}

//Drawing functions
Game.prototype.draw = function(){
  this.wallPatterns.forEach(function(wall){
    wall.draw();
  });
  
  this.scoreBalls.forEach(function(scoreBall){
    // scoreBall.recalculatePosition();
    scoreBall.draw();
  });

  this.blockPatterns.forEach(function(pattern){
    pattern.draw();
  });
 
  this.snake.printScore(); 
  this.snake.draw();
}
Game.prototype.printScore = function(){
  //prints score of this round
  document.getElementsByClassName('score')[0].innerHTML = this.score;
  //prints maximum score since web app was launched
  document.getElementsByClassName('max-score')[0].innerHTML = this.maxScore;
}
Game.prototype.clearCanvas = function(){
  //clears everything
  ctx.clearRect(0,0,this.ctx.width, this.ctx.height);
}

//Position
Game.prototype.adaptVerticalIncrementCrashing = function(){
  //if there has been a change of direction, it resets snake vertical increment
  this.snakeVerticalIncrementTurn = 0;
}