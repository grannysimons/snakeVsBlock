function Snake(ctx, assets){
  this.assets = assets;
  this.ctx = ctx;
  this.body = [{
    x: this.ctx.width * 0.5,
    y: this.ctx.height - this.assets.snakeDistanceToLow,
  }];
  this.score = 0;
  this.animationInterval = undefined;
  this.isIntervalPaused = false;
}

Snake.prototype.startLoop = function(funct){
  this.animationInterval = setInterval(function(){
    funct();
  }.bind(this), this.assets.snakeMovementInterval);
}

Snake.prototype.hasCollided = function(scoreBall){
  var head = this.body[0];
  var radius = this.assets.snakeBallRadius;
  var verticalCollision = (((head.x - radius < scoreBall.x + radius) && (head.x - radius > scoreBall.x - radius)) 
  || ((head.x + radius > scoreBall.x - radius) && (head.x + radius < scoreBall.x + radius)));
  var horizontalCollision = ((head.y - radius > scoreBall.y - radius) && (head.y - radius < scoreBall.y + radius));
  return verticalCollision && horizontalCollision;
}
Snake.prototype.looseBall = function(){}
Snake.prototype.gameOver = function(){}

Snake.prototype.addBall = function(){
  this.body.push({
    x: this.body[this.body.length-1].x,
    y: this.body[this.body.length-1].y + 2 * this.assets.snakeBallRadius,
  });
  this.draw();
}
Snake.prototype.addBallToBeginning = function(){
  this.body.unshift({
    x: this.body[0].x,
    y: this.body[0].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.move = function (){
  this.body.pop();
  //afegir una bola al principi del this.body amb les característiques de la primera bola
  var firstBall = {
    x: this.body[0].x,
    y: this.body[0].y
  };
  this.body.unshift(firstBall);
}
Snake.prototype.moveForward = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.body[1].x;
    this.body[0].y = this.body[1].y - 2 * this.assets.snakeBallRadius;
  }
  this.keepSnakeQuiet(- 2 * this.assets.snakeBallRadius);
}
Snake.prototype.moveRight = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
  }
  this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn);
}
Snake.prototype.moveLeft = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
  }
  this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn);
}
Snake.prototype.moveRightFirstPositions = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
  }
  this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn_FP);
}
Snake.prototype.moveLeftFirstPositions = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
  }
  this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn_FP);
}
Snake.prototype.moveForwardFirstPositions = function(lastKey){
  this.move();
  if(this.body.length > 1)
  {
    if (lastKey === 'right')
    {
      this.assets.calculateVerticalIncrement_FP();
      this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'left');
      this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
      this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn_FP);
    }
    else if (lastKey === 'left') 
    {
      this.body[0].x = this.body[1].x + 5;
      this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn - 5;
      this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn - 5);
    }
    else 
    {
      this.body[0].x = this.body[1].x;
      this.body[0].y = this.body[1].y - 2 * this.assets.snakeBallRadius;
      this.keepSnakeQuiet(- 2 * this.assets.snakeBallRadius);
    }
  }
}
Snake.prototype.keepSnakeQuiet = function(incY){
  //baixar-ho tot 2r
  this.body.forEach(function(ball){
    ball.y = ball.y - incY;
  }.bind(this));
}

Snake.prototype.draw = function(){
  // this.keepSnakeQuiet();
  this.body.forEach(function(ball){
    this.drawBall(ball);
  }.bind(this));
}
Snake.prototype.drawBall = function(ball){
  //pintar bola al principi
  this.ctx.beginPath();
  this.ctx.arc(ball.x, ball.y, this.assets.snakeBallRadius, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = this.assets.snakeColorNormal;
  this.ctx.fill();
  this.ctx.closePath();
}
