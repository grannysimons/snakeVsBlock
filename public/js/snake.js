function Snake(ctx, assets){
  this.assets = assets;
  this.ctx = ctx;
  this.body = [{
    x: this.ctx.width * 0.5,
    y: this.ctx.height - this.assets.snakeDistanceToLow,
  }];
  this.score = 1;
  this.color = this.assets.snakeColor;
}
Snake.prototype.hasCollidedWithScoreBall = function(scoreBall){
  if(this.body.length === 0) return false;
  var head = this.body[0];
  var radius = this.assets.snakeBallRadius;
  var tolerance = this.assets.toleranceToCollision;
  var verticalCollision = 
    (((head.x - radius < scoreBall.x + radius + tolerance) && 
    (head.x - radius > scoreBall.x - radius - tolerance)) 
    || 
    ((head.x + radius > scoreBall.x - radius - tolerance) && 
    (head.x + radius < scoreBall.x + radius + tolerance)));
  var horizontalCollision = ((head.y - radius > scoreBall.y - radius - tolerance) && (head.y - radius < scoreBall.y + radius + tolerance));
  return verticalCollision && horizontalCollision;
}
Snake.prototype.hasCollidedWithBlock = function(block){
  if(this.body.length === 0) return false;
  var head = this.body[0];
  var radius = this.assets.snakeBallRadius;
  var verticalCollision = (((head.x + radius + this.assets.toleranceToCollision > block.x) && (head.x + radius + this.assets.toleranceToCollision< block.x + block.width)) || 
  ((head.x - radius - this.assets.toleranceToCollision < block.x + block.width) && (head.x - radius - this.assets.toleranceToCollision > block.x)));
  var horizontalCollision = (head.y - radius - this.assets.toleranceToCollision > block.y) && (head.y - radius - this.assets.toleranceToCollision < block.y + block.height);
  return verticalCollision && horizontalCollision;
}
Snake.prototype.printScore = function(){
  this.ctx.font="10px Arial";
  this.ctx.fillStyle=this.assets.scoreColor;
  if (this.body.length>0) this.ctx.fillText(this.score,this.body[0].x - 3, this.body[0].y - this.assets.snakeBallRadius - 6);
}
Snake.prototype.addBallToBeginning = function(){
  this.body.unshift({
    x: this.body[0].x,
    y: this.body[0].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.addBall = function(){
  this.body.push({
    x: this.body[this.body.length-1].x,
    y: this.body[this.body.length-1].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.deleteBall = function(){
  this.body.pop();
}
Snake.prototype.move = function (){
  //afegir una bola al principi del this.body amb les característiques de la primera bola
  if(this.body.length === 0) return;
  var firstBall = {
    x: this.body[0].x,
    y: this.body[0].y
  };
  this.body.pop();
  this.body.unshift(firstBall);
}
Snake.prototype.moveForward = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.body[1].x;
    this.body[0].y = this.body[1].y - 2 * this.assets.snakeBallRadius;
  }
  else if(this.body.length === 1)
  {
    this.body[0].y = this.body[0].y - 2 * this.assets.snakeBallRadius;
  }
  this.keepSnakeQuiet(- 2 * this.assets.snakeBallRadius);
}
Snake.prototype.moveRight = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
    this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn);
  }
  else if (this.body.length === 1)
  {
    this.body[0].x = this.body[0].x + 10;
    // this.body[0].y = this.body[0].y - 2 * this.assets.snakeBallRadius;
  }
  if (this.body[0].x + this.assets.snakeBallRadius > this.ctx.width) this.body[0].x = this.ctx.width - this.assets.snakeBallRadius;
}
Snake.prototype.moveLeft = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
    this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn);
  }
  else if(this.body.length === 1)
  {
    this.body[0].x = this.body[0].x - 10;
  }
  if (this.body[0].x - this.assets.snakeBallRadius < 0) this.body[0].x = this.assets.snakeBallRadius;
}
Snake.prototype.moveRightFirstPositions = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn_FP);
  }
  else
  {
    this.body[0].x = this.body[0].x + 10;
  }
}
Snake.prototype.moveLeftFirstPositions = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.keepSnakeQuiet(- this.assets.snakeVerticalIncrementTurn_FP);
  }
  else
  {
    this.body[0].x = this.body[0].x - 10;
  }
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
  this.assets.drawInterval = - incY;  //AFEGIT
  this.body.forEach(function(ball){
    ball.y = ball.y - incY;
  }.bind(this));
}
Snake.prototype.draw = function(){
  this.body.forEach(function(ball){
    this.drawBall(ball);
  }.bind(this));
}
Snake.prototype.drawBall = function(ball){
  this.ctx.beginPath();
  this.ctx.arc(ball.x, ball.y, this.assets.snakeBallRadius, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
  this.ctx.closePath();
}
Snake.prototype.resetVerticalIncrement = function(){
  this.snakeVerticalIncrementTurn = this.assets.snakeVerticalIncrementTurnInitial;
}
Snake.prototype.resetVerticalIncrement_FP = function(){
  this.snakeVerticalIncrementTurn_FP = this.assets.snakeVerticalIncrementTurnInitial_FP;
}
Snake.prototype.restart = function(){
  this.body = [{
    x: this.ctx.width * 0.5,
    y: this.ctx.height - this.assets.snakeDistanceToLow,
  }];
  this.score = 1;
}