function Assets(){
  this.snakeCalculationPeriod = 100;
  this.snakeDistanceToLow = 100;
  this.snakeBallRadius = 5;
  this.snakeVerticalIncrementTurn = 2 * this.snakeBallRadius - 7;
  this.snakeColorNormal = "yellow";
  this.snakeMovementInterval = 20;
  this.snakeIncrementBalls = 10;
  this.snakeIncrementNextBall = 0.2;
  this.snakeIncrementAngle = 0.2;
}

Assets.prototype.calculateXincrement = function(x1, dir){
  var result1 = 0.5 * (2 * x1 + Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  var result2 = 0.5 * (2 * x1 - Math.sqrt( Math.pow(2*x1,2) - 4 * (Math.pow(this.snakeVerticalIncrementTurn,2) + Math.pow(x1,2) - 4 * Math.pow(this.snakeBallRadius,2))));
  if(dir === "right") return Math.floor(result1 > x1 ? result1 : result2);
  else if(dir === "left") return Math.floor(result1 < x1 ? result1 : result2);
  return "error";
}