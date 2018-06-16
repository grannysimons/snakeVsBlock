function Assets(){
  this.snakeCalculationPeriod = 100;
  this.snakeDistanceToLow = 200;
  this.snakeBallRadius = 7;
  this.snakeVerticalIncrementTurnInitial = 2 * this.snakeBallRadius - 3;
  this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurnInitial;
  this.snakeVerticalIncrementTurnInitial_FP = 2 * this.snakeBallRadius - 5;
  this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurnInitial_FP;
  this.snakeColorNormal = "yellow";
  this.scoreBallColorNormal = "yellow";
  this.scoreColor = "lightgray";
  this.snakeMovementInterval = 100;
  this.snakeIncrementBalls = 10;
  this.snakeIncrementNextBall = 0.2;
  this.intervalTicks = 0;
  this.firstIntervalTicks = 1;
  this.ARROW_RIGHT = 0;
  this.ARROW_LEFT = 1;
  this.SPACEBAR = 2;
  this.A = 3;
  this.scores = [1,2,3,4,5];
  this.maxScoreBalls = 2;
  this.addingScoreBallsPeriod = 2000;
  this.drawInterval = 5;
}

Assets.prototype.calculateVerticalIncrement = function(){
  (this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurn - 0.1 * this.intervalTicks);
  if(this.snakeVerticalIncrementTurn < 0.5) this.snakeVerticalIncrementTurn = 0.5; 
}

Assets.prototype.resetVerticalIncrement = function(){
  this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurnInitial;
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
  (this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurn_FP - 0.1 * this.intervalTicks);
  if(this.snakeVerticalIncrementTurn_FP < 0.5) this.snakeVerticalIncrementTurn_FP = 0.5; 
}

Assets.prototype.resetVerticalIncrement_FP = function(){
  this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurnInitial_FP;
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