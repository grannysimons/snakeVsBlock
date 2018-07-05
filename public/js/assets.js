function Assets(){
  // snake
  this.snakeDistanceToLow = 200;
  this.snakeBallRadius = 7;
  this.snakeColorNormal = "yellow";
  this.snakeColor = this.snakeColorNormal;
  this.scoreColor = "lightgray";
  this.toleranceToCollision = 2;
  this.starColors = ['#24ffad', '#71ff5d', '#f5fe5f', '#ff5138', '#27fef1', '#ff9445'];

  this.snakeVerticalIncrementTurnInitial = 2 * this.snakeBallRadius - 3;
  this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurnInitial;

  this.snakeVerticalIncrementTurnInitial_FP = 2 * this.snakeBallRadius;
  this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurnInitial_FP;
 
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
  this.blockColors = ['#24ffad', '#71ff5d', '#f5fe5f', '#ff5138', '#27fef1', '#ff9445'];
  this.blockScoreColor = 'black';
  this.starTime = 5000;
  this.maxBlockScores = 30;

  //blockPattern
  this.distanceMax = 400;
  this.distanceMin = 200;
  this.maxPatterns = 1; //max number of patterns to be generated at the same time

  // game
  this.directionTicks = 0;
  this.firstDirectionTicks = 5;
  this.drawIntervalInit = 5;
  this.drawInterval = this.drawIntervalInit;
  this.pauseInterval = 20;
  this.gameInterval = 60;
  this.starInterval = 30;
  this.normalInterval = 50;
  this.starColorInterval = 40;
}

Assets.prototype.calculateVerticalIncrement = function(){
  (this.snakeVerticalIncrementTurn = this.snakeVerticalIncrementTurn - 0.6*this.directionTicks);
  if(this.snakeVerticalIncrementTurn < 0.5) this.snakeVerticalIncrementTurn = 0.5; 
}
Assets.prototype.calculateXincrement = function(x1, dir){
  this.calculateVerticalIncrement();
  var result = Math.sqrt(4*this.snakeBallRadius*this.snakeBallRadius - this.snakeVerticalIncrementTurn * this.snakeVerticalIncrementTurn);
  if (dir === 'right') return x1 + result;
  else if(dir === 'left') return x1 - result;
  else return "error";

}
Assets.prototype.calculateVerticalIncrement_FP = function(){

  (this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurn_FP - this.directionTicks);
  if(this.snakeVerticalIncrementTurn_FP < 0.2) this.snakeVerticalIncrementTurn_FP = 0.2; 
}
Assets.prototype.calculateXincrement_FP = function(x1, dir, comesFrom){
  this.calculateVerticalIncrement_FP();
  var result = Math.sqrt(4*this.snakeBallRadius*this.snakeBallRadius - this.snakeVerticalIncrementTurn_FP * this.snakeVerticalIncrementTurn_FP);
  if (dir === 'right' || (dir === 'forward' && comesFrom === 'left')) return x1 + result;
  else if(dir === 'left' || (dir === 'forward' && comesFrom === 'right')) return x1 - result;
  else if(dir === 'forward' && (!comesFrom || comesFrom === 'noKey')) return x1;
  else
  {
    return "error";
  }
}
Assets.prototype.calculateVerticalIncrementForward_FP = function(){
  (this.snakeVerticalIncrementTurn_FP = this.snakeVerticalIncrementTurn_FP - 0.2*this.directionTicks);
  if(this.snakeVerticalIncrementTurn_FP < 0.2) this.snakeVerticalIncrementTurn_FP = 0.2; 
}