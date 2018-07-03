var TEST = true;
var game, ctx, assets;
//keyboard
var keys = [];
var keyboard;
//intervals
var screenInterval, gameInterval, waitingInterval;
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

  if(TEST) setTest();

  screenInterval = setInterval(update, assets.gameInterval);
}
function initVariables(){
  pauseTicks = assets.pauseInterval + 1;
  this.keyboard.initKeys();
}
function update(){
  // function to be executed at every iteration of the main loop

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
      game._restartGame();
      clearInterval(gameInterval);
      gameInterval = setInterval(update, assets.gameInterval);
      game.status = 'start';
    }
  }
  
  if(game.status === 'start')
  {
    startScreen();
  }
  else if(game.status === 'normal')
  {
    hideAllScreens();
    if(game.underStarFX)
    {
      clearInterval(gameInterval);
      gameInterval = setInterval(update, this.assets.starInterval);
    }
    else
    {
      clearInterval(gameInterval);
      gameInterval = setInterval(update, this.assets.gameInterval);
    }
    
    if(!keyboard.anyKeyPressed() && game.destroying === false)
    {
      if(keyboard.checkNewKeyPressed('nokey')) game.assets.directionTicks = 0;
      keyboard.setKeyPressed('nokey');
      if (game.assets.directionTicks < assets.firstDirectionTicks)
      {
        // game.snake.moveForwardFirstPositions(lastKeyPressed);
        game.snake.moveForward();
      }
      else
      {
        game.snake.moveForward();
      }
      game.assets.directionTicks++;
    }
    else if(keyboard.anyKeyPressed() && game.destroying === true)
    {
      game.adaptVerticalIncrementCrashing();
      keyboard.whatWasPressed().forEach(function(value, key){
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
    else if(game.destroying === false)
    {
      keyboard.whatWasPressed().forEach(function(value, key){
        if(value === true)
        {
          switch(key)
          {
            case assets.ARROW_RIGHT:
              if(keyboard.checkNewKeyPressed('right')) game.assets.directionTicks = 0;

              if (game.assets.directionTicks < assets.firstDirectionTicks)
              {
                game._adaptVerticalIncrementFirstPositions('right');
                game.snake.moveRightFirstPositions();
                // this.snake.moveRight();
              }
              else
              {
                game._adaptVerticalIncrement('right');
                game.snake.moveRight();
              }
              keyboard.setKeyPressed('right');
              game.assets.directionTicks++;
            break;
            case assets.ARROW_LEFT:
              if(keyboard.checkNewKeyPressed('left')) game.assets.directionTicks = 0;
                if (game.assets.directionTicks < assets.firstDirectionTicks)
                {
                  game._adaptVerticalIncrementFirstPositions('left');
                  game.snake.moveLeftFirstPositions();
                  // this.snake.moveLeft();
                }
                else 
                {
                  game._adaptVerticalIncrement('left');
                  game.snake.moveLeft();
                }
                keyboard.setKeyPressed('left');
                game.assets.directionTicks++;
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

    game._checkCollision();
    if(!game.destroying)
    {
      game.scoreBalls.forEach(function(scoreBall){
        scoreBall.recalculatePosition();
      });
      game._manageBlocks();
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
      game._adaptVerticalIncrement('space');
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