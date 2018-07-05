var game, ctx, assets;

//keyboard
var keys = [];
var keyboard;

//intervals
var screenInterval, gameInterval, starInterval, waitingInterval;

//status
var intervalPaused = false;
var gameOver = false;
var pauseTicks;


window.onload = function(){
  ctx = document.getElementById('canvas').getContext('2d');
  assets = new Assets();
  keyboard = new Keyboard(ctx, assets);
  game = new Game(ctx, assets, keyboard);
  game.init();

  initVariables();

  if(assets.TEST) setTest();

  gameInterval = setInterval(update, assets.gameInterval);
}

function initVariables(){
  pauseTicks = assets.pauseInterval + 1;
  WALLS = this.assets.WALLS;
  this.keyboard.initKeys();
}
function update(){
  // function to be executed at every iteration of the main loop

  //manage ENTER key
  if(keyboard.isEnterPressed())
  {
    if(game.status === 'start')
    {
      game.status = 'normal';
      game.stopAudios(true, true, true, true, true);
      game.audioStart.play();
    }
    else if(game.status === 'gameover')
    {
      game.restartGame();
      clearInterval(gameInterval);
      gameInterval = setInterval(update, assets.gameInterval);
      game.status = 'start';
    }
  }
  
  //manage status
  if(game.status === 'start')
  {
    startScreen();
  }
  else if(game.status === 'normal')
  {
    //hide all screens (game over, start or pause screen)
    hideAllScreens(); 

    //check if the snake has eaten a star
    if(game.underStarFX)
    {
      if(gameInterval)
      {
        clearInterval(gameInterval);
        gameInterval = undefined;
      }
      if(!starInterval)
      {
        starInterval = setInterval(update, assets.starInterval);
      }
    }
    else
    {
      if(starInterval)
      {
        clearInterval(starInterval);
        starInterval = undefined
      }
      if(!gameInterval)
      {
        gameInterval = setInterval(update, assets.gameInterval);
      }
    }
    
    //if no key was pressed and no blocks are being destroied
    if(!keyboard.anyKeyPressed() && game.destroying === false)
    {
      resetDirectionTicksFirstTime('noKey');
      assets.directionTicks < assets.firstDirectionTicks ? game.snake.moveForward_FP(keyboard.lastKeyPressed) : game.snake.moveForward();
      keyboard.setKeyPressed('noKey');
      assets.directionTicks++;
    }
    //if a key was pressed (right or left) and a block was being destroied.
    else if(keyboard.anyKeyPressed() && game.destroying === true)
    {
      game.adaptVerticalIncrementCrashing();
      keyboard.getKeysArray().forEach(function(value, key){
        if(value === true)
        {
          switch(key)
          {
            case assets.ARROW_RIGHT:
              game.snake.moveRight();
            break;
            case assets.ARROW_LEFT:
            game.snake.moveLeft();
            break;
          }
        }
      });
    }
    //if a key was pressed and no blocks were being destroied
    else if(keyboard.anyKeyPressed() && game.destroying === false)
    {
      keyboard.getKeysArray().forEach(function(value, key){
        if(value === true)
        {
          switch(key)
          {
            case assets.ARROW_RIGHT:
              resetDirectionTicksFirstTime('right');
              keyboard.setKeyPressed('right');
              if (assets.directionTicks < assets.firstDirectionTicks)
              {
                if(this.game.collisionWithWall)
                {
                  game.snake.moveForward();
                  console.log("collision with wall: RIGHT");
                }
                else game.snake.moveRight_FP();
              }
              else
              {
                if(this.game.collisionWithWall) game.snake.moveForward();
                else game.snake.moveRight();
              }
              assets.directionTicks++;
            break;
            case assets.ARROW_LEFT:
              resetDirectionTicksFirstTime('left');
              keyboard.setKeyPressed('left');
              if (assets.directionTicks < assets.firstDirectionTicks)
              {
                if(this.game.collisionWithWall)
                {
                  game.snake.moveForward();
                  console.log("collision with wall: LEFT");
                }
                else game.snake.moveLeft_FP();
              }
              else 
              {
                if(this.game.collisionWithWall) game.snake.moveForward();
                else game.snake.moveLeft();
              }
              assets.directionTicks++;
            break;
            case assets.SPACEBAR:
              if(isSoftPauseKeyOff() || pauseTicks > assets.pauseInterval)
              {
                game.status = 'pause';
                softPauseKeyOff();
                softPauseKeyOn();
                game.stopAudios(true,false,false,true,false);
                game.audiosPlaying().forEach(function(audio){
                  audio.pause();
                });
              }
            break;
          }
        }
      });
    }

    game.checkCollision();
    if(!game.destroying)
    {
      game.scoreBalls.forEach(function(scoreBall){
        scoreBall.recalculatePosition();
      });
      game.manageBlocks();
      if(this.assets.WALLS) game.manageWalls();
      game.checkScoreBallsPosition();
    }
  }
  else if(game.status === 'gameover')
  {
    gameOverScreen();
    //if user already lost
    keyboard.setKeyPressed(undefined);
    return;
  }
  else if(game.status === 'pause')
  {
    if(keyboard.isSpacebarPressed() && pauseTicks > assets.pauseInterval)
    {
      softPauseKeyOff();
      softPauseKeyOn();
      game.status = 'normal';
      game.resumeInterval();
      game.audiosPlaying().forEach(function(audio){
        audio.play();
      });
    }
    else
    {
      game.pauseInterval();
      pauseScreen();
      softPauseKeyOn();
      game.stopAudios(true,false,false,true,false);
      game.audiosPlaying().forEach(function(audio){
        audio.pause();
      });
    }
  }
  clearCanvas();
  draw();
}
function resetDirectionTicksFirstTime(direction){
  if(keyboard.checkNewKeyPressed(direction))
  {
    assets.directionTicks = 0;
  }
}

//Test
function setTest(){
  //sets test for develop purposes
  //activate test from main.js
  var BALLS_TEST = 70;
  for(var i=0; i<BALLS_TEST; i++)
  {
    game.snake.addBall();
    game.snake.score = 71;
  }
}

//Drawing functions
function clearCanvas(){
  //clears everything
  game.clearCanvas();
}
function draw(){
  //draw everything
  game.draw();
  game.printScore();
}

//pause and game over
function pauseScreen(){
  hideAllScreens();
  document.getElementsByClassName('pause')[0].style.display = 'block';
}
function gameOverScreen(){
  hideAllScreens();
  document.getElementsByClassName('gameover')[0].style.display = 'block';  
}
function isGameOver(){
  return (game.gameOver && !game._anyKeyPressed());
}
function setGameOver(){
  game.gameOver = true;
  //show gameOver image
  gameOverScreen();
  game.status = 'gameover';
}
function startScreen(){
  hideAllScreens();
  document.getElementsByClassName('start')[0].style.display = 'block';
}
function hideAllScreens(){
  document.getElementsByClassName('pause')[0].style.display = 'none';
  document.getElementsByClassName('start')[0].style.display = 'none';
  document.getElementsByClassName('gameover')[0].style.display = 'none';
}
function softPauseKeyOn(){
  if(!waitingInterval)
  {
    pauseTicks = 0;
    waitingInterval = setInterval(function(){
      pauseTicks ++;
    }, game.assets.gameInterval);
  }
}
function softPauseKeyOff(){
  if(waitingInterval != undefined)
  {
    clearInterval(waitingInterval);
    waitingInterval = undefined;
  }
}
function isSoftPauseKeyOff(){
  if(waitingInterval === undefined) return true;
  else return false;
}