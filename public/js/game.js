function Game(ctx, assets, keyboard){
  //assets
  this.assets = assets;

  //keyboard
  this.keyboard = keyboard;

  //status
  this.status = 'start';  //start, gameover, pause, normal
  // this.lastKeyPressed;

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
  this.blocksInterval = undefined;
  this.crashInterval = undefined;
  this.destroyingBlockInterval = undefined;
  this.destroying = false;
  this.currentDestroyingBlock = undefined;

  //blockPatterns
  this.blockPatterns = [];
  this.lastY = 0;

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

  // if(!this.gameInterval) this.gameInterval = setInterval(this._update.bind(this), this.assets.gameInterval);

  this.assets.directionTicks = 0;
  this._generateInitialScenario();
  // this._draw();
}
Game.prototype._generateInitialScenario = function(){
  this._generateBlockPatterns();
  this._generateScoreBalls();
}
Game.prototype._restartGame = function(){
  this.scoreBalls = [];
  this.blockPatterns = [];
  this.score = 0;
  this.lastY = 0;
  this._generateInitialScenario();
  this.snake.restart();
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
    this._addScoreBallToGame(scoreBall);
  }
  if(this.scoreBallsInterval === undefined) this.scoreBallsInterval = setInterval(function(){
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
      this.scoreBalls.splice(index,1);
      for(var i=0; i<scoreBall.points; i++)
      {
        this.snake.score ++;
        
        setTimeout(function(){
          this.audioScoreBall.play();
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
        else if(block.points < this.snake.score)
        {
          this.currentDestroyingBlock = block;
          console.log('creem destroyingBlockInterval');
          if(!this.destroyingBlockInterval) this.destroyingBlockInterval = setInterval(function(){
            console.log('dins el setInterval: '+this.destroyingBlockInterval);
            this.snake.score --;
            this.snake.deleteBall();
            this.destroying = true;
            block.points--;
            if (block.points <= 0)
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
              // if(!this.underStarFX)
              // {

              // }
            }
            
            this.draw();
          }.bind(this), 50);


          

          // if(block.hasStar() === true)
          // {
          //   this.snake.score -= block.points;
          //   for(var i=0; i<block.points; i++)
          //   {
          //     this.snake.deleteBall();
          //   }
          //   this.underStarFX = true;
          //   if(this.starTimeout === undefined) this.starTimeout = setTimeout(function(){
          //     this.status = 'normal';
          //     this.assets.gameInterval = this.assets.normalInterval;
          //     this.starTimeout = undefined;
          //     clearInterval(this.starInterval);
          //     this.starInterval = undefined;
          //     this.underStarFX = false;
          //     this.snake.color = this.assets.snakeColorNormal;
          //   }.bind(this), this.assets.starTime);
          //   if(this.starInterval === undefined) this.starInterval = setInterval(function(){
          //     this.snake.color = this.assets.starColors[Math.floor(Math.random() * this.assets.starColors.length)];
          //   }.bind(this), this.assets.starColorInterval);
          // }
          // if(!this.underStarFX)
          // {
          //   for(var i=0; i<block.points; i++)
          //   {
          //     setTimeout(function(){
          //       block.points--;
          //       if (block.points <= 0)
          //       {
          //         this._crashFX();
          //         this.blockPatterns[indextBlockPattern].pattern[indexBlock] = false;
          //       }
          //       this.snake.score --;
          //       this.snake.deleteBall();
          //       this.draw();
          //     }.bind(this), 30 * i);
          //   }
          // }
        }
        else
        {
          this.pauseInterval();
          for(var i=0; i<block.points; i++)
          {
            this.snake.score --;
            if (this.snake.score < 0)
            {
              this.snake.score = 0;
            }
            this.snake.deleteBall();
            // this._draw();

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
          // this._setGameOver();
          this.status = 'gameover';
          this.stopAudios(true, true, true, true, true);
          var randIndex = Math.floor(Math.random() * this.audioGameover.length);
          this.audioGameover[randIndex].play();
        }
      }
    }.bind(this));
  }.bind(this));

  if(collision === false && this.destroyingBlockInterval)
  {
    console.log("ja no hi ha colisio!");
    clearInterval(this.destroyingBlockInterval);
    this.destroyingBlockInterval = undefined;
    this.destroying = false;
  }
}
Game.prototype._manageBlocks = function(){
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
  this._deleteBlocksOutOfCanvas();
}
Game.prototype._deleteBlocksOutOfCanvas = function(){
  //deletes blocks out of the canvas
  // this.blocks.forEach(function(block, index){
  //   if (block.y > this.ctx.height) this.blocks.splice(index, 1);
  // }.bind(this));
  
  this.blockPatterns.forEach(function(blockPattern, index){
    if (blockPattern.y > this.ctx.height) this.blockPatterns.splice(index, 1);
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
  var radi = this.assets.snakeBallRadius - 1;
  if(!this.crashInterval) this.crashInterval = setInterval(function(){
    x1+=5;
    y1+=5;
    x2-=5;
    y2-=5;
    radi = radi<=0.6 ? 0 : radi-0.6;
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
  if(!this.audioStart.ended) audiosPlaying.push(this.audioStart);
  if(!this.audioCrash.ended) audiosPlaying.push(this.audioCrash);
  if(!this.audioScoreBall.ended) audiosPlaying.push(this.audioScoreBall);
  this.audioGameover.forEach(function(audio){
    if(!audio.ended) audiosPlaying.push(audio);
  });
  this.audioStar.forEach(function(audio){
    if(!audio.ended) audiosPlaying.push(audio);
  });
  return audiosPlaying;
}
//Drawing functions
Game.prototype.draw = function(){
  this.scoreBalls.forEach(function(scoreBall){
    // scoreBall.recalculatePosition();
    scoreBall.draw();
  });
 
  this.snake.printScore(); 
  this.snake.draw();

  this.blockPatterns.forEach(function(pattern){
    pattern.draw();
  });
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
Game.prototype._adaptVerticalIncrement = function(key){
  //if there has been a change of direction, it resets snake vertical increment
  // if(this.lastKeyPressed != key)
  if(keyboard.checkNewKeyPressed(key))
  {
    this.snake.resetVerticalIncrement();
  }
}
Game.prototype._adaptVerticalIncrementFirstPositions = function(key){
  //if there has been a change of direction, it resets snake vertical increment in the first positions
  // if(this.lastKeyPressed != key)
  if(keyboard.checkNewKeyPressed(key))
  {
    this.snake.resetVerticalIncrement_FP();
  }
}
Game.prototype.adaptVerticalIncrementCrashing = function(){
  //if there has been a change of direction, it resets snake vertical increment
  // if(this.lastKeyPressed != key)
  this.snakeVerticalIncrementTurn = 0;
}



// Game.prototype.generateWall = function(){}