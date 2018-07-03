function Assets(){
  // snake
  this.snakeCalculationPeriod = 100;
  this.snakeDistanceToLow = 200;
  this.snakeBallRadius = 7;
  this.snakeVerticalIncrementTurnInitial = 2 * this.snakeBallRadius - 3;
  this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurnInitial;
  this.snakeVerticalIncrementTurnInitial_FP = 2 * this.snakeBallRadius - 5;
  this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurnInitial_FP;
  this.snakeColorNormal = "yellow";
  this.snakeColor = this.snakeColorNormal;
  this.scoreColor = "lightgray";
  this.snakeIncrementBalls = 10;
  this.snakeIncrementNextBall = 0.2;
  this.toleranceToCollision = 2;
  this.starColors = ['#24ffad', '#71ff5d', '#f5fe5f', '#ff5138', '#27fef1', '#ff9445'];

  // scoreball
  this.scoreBallColorNormal = "yellow";
  this.ballScores = [1,2,3,4,5];
  this.maxScoreBalls = 6;
  this.addingScoreBallsPeriod = 2000;
  
  // keyboard
  this.ARROW_RIGHT = 0;
  this.ARROW_LEFT = 1;
  this.SPACEBAR = 2;
  this.ENTER = 3;
  
  // block
  this.blockWidth = 80;
  this.blockHeight = 60;
  this.maxBlocks = 1;
  this.addingBlocksPeriod = 2000;
  this.maxBlockScores = 30;
  this.blockColors = ['#24ffad', '#71ff5d', '#f5fe5f', '#ff5138', '#27fef1', '#ff9445'];
  this.blockScoreColor = 'black';
  this.starTime = 5000;

  //blockPattern
  this.distanceMax = 400;
  this.distanceMin = 200;
  this.maxPatterns = 1; //max number of patterns to be generated at the same time

  // game
  this.directionTicks = 0;
  this.firstDirectionTicks = 5;
  this.drawInterval = 5;
  this.pauseInterval = 20;
  this.gameInterval = 50;
  this.starInterval = 30;
  this.normalInterval = 50;
  this.starColorInterval = 40;
}

Assets.prototype.calculateVerticalIncrement = function(){
  (this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurn - 0.1 * this.directionTicks);
  if(this.snakeVerticalIncrementTurn < 0.5) this.snakeVerticalIncrementTurn = 0.5; 
}
Assets.prototype.calculateXincrement = function(x1, dir){
  this.calculateVerticalIncrement();
  var result1 = 0.5 * (2 * x1 + Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  var result2 = 0.5 * (2 * x1 - Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  if(dir === "right")
  {
    return Math.floor(result1 > x1 ? result1 : result2);
  }
  else if(dir === "left") return Math.floor(result1 < x1 ? result1 : result2);
  return "error";
}
Assets.prototype.calculateVerticalIncrement_FP = function(){
  (this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurn_FP - 0.1 * this.directionTicks);
  if(this.snakeVerticalIncrementTurn_FP < 0.5) this.snakeVerticalIncrementTurn_FP = 0.5; 
}
Assets.prototype.calculateXincrement_FP = function(x1, dir){
  this.calculateVerticalIncrement_FP();
  var result1 = 0.5 * (2 * x1 + Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn_FP,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  var result2 = 0.5 * (2 * x1 - Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn_FP,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  if(dir === "right")
  {
    return Math.floor(result1 > x1 ? result1 : result2);
  }
  else if(dir === "left") return Math.floor(result1 < x1 ? result1 : result2);
  return "error";
}