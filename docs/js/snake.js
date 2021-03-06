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

// general
Snake.prototype.restart = function(){
  this.body = [{
    x: this.ctx.width * 0.5,
    y: this.ctx.height - this.assets.snakeDistanceToLow,
  }];
  this.score = 1;
}

//check collisions
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
  var tolerance = this.assets.toleranceToCollision;
  var horizontalCollision = (((head.x + radius + tolerance > block.x) && (head.x + radius + tolerance< block.x + block.width)) || 
  ((head.x - radius - tolerance < block.x + block.width) && (head.x - radius - tolerance > block.x)));
  var verticalCollision = (head.y - radius > block.y) && (head.y - radius < block.y + block.height);
  return verticalCollision && horizontalCollision;
}
Snake.prototype.hasCollidedWithWall = function(wall){
  if(this.body.length === 0) return false;
  var head = this.body[0];
  var radius = this.assets.snakeBallRadius;
  var tolerance = this.assets.toleranceToCollision;
  var horizontalCollision = (((head.x + radius + tolerance > wall.x) && (head.x + radius + tolerance< wall.x + wall.width)) || 
  ((head.x - radius - tolerance < wall.x + wall.width) && (head.x - radius - tolerance > wall.x)));
  var verticalCollision = (head.y - radius > wall.y) && (head.y - radius < wall.y + wall.height);
  return verticalCollision && horizontalCollision;
}

//drawing
Snake.prototype.printScore = function(){
  this.ctx.font="10px Arial";
  this.ctx.fillStyle=this.assets.scoreColor;
  if (this.body.length>0) this.ctx.fillText(this.score,this.body[0].x - 3, this.body[0].y - this.assets.snakeBallRadius - 6);
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

//manage snake body
Snake.prototype.addBall = function(){
  if(this.body.length < 1) return;
  this.body.push({
    x: this.body[this.body.length-1].x,
    y: this.body[this.body.length-1].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.deleteBall = function(){
  this.body.pop();
}

//movement
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
Snake.prototype.recalculatePosition = function(incY){
  //baixar-ho tot l'últim increment vertical de la serp
  this.assets.drawInterval = - incY;
  this.body.forEach(function(ball){
    ball.y = ball.y - incY;
  }.bind(this));
}

//direction (general)
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
  this.recalculatePosition(- 2 * this.assets.snakeBallRadius);
}
Snake.prototype.moveRight = function(){
  this.assets.snakeVerticalIncrementTurn = this._resetVerticalIncrement();
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn);
  }
  else if (this.body.length === 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[0].x, 'right');
    this.body[0].y = this.body[0].y - this.assets.snakeVerticalIncrementTurn;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn);
  }
  if (this.body[0].x + this.assets.snakeBallRadius > this.ctx.width) this.body[0].x = this.ctx.width - this.assets.snakeBallRadius;
}
Snake.prototype.moveLeft = function(){
  this.assets.snakeVerticalIncrementTurn = this._resetVerticalIncrement();
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn);
  }
  else if(this.body.length === 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[0].x, 'left');
    this.body[0].y = this.body[0].y - this.assets.snakeVerticalIncrementTurn;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn);
  }
  if (this.body[0].x - this.assets.snakeBallRadius < 0) this.body[0].x = this.assets.snakeBallRadius;
}
Snake.prototype._resetVerticalIncrement = function(){
  return this.assets.snakeVerticalIncrementTurnInitial;
}

//direction (FP stands for First Positions)
Snake.prototype.moveRight_FP = function(){
  this.assets.snakeVerticalIncrementTurn_FP = this._resetVerticalIncrement_FP();
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn_FP);
  }
  else
  {
    this.body[0].x = this.body[0].x + 3;
    this.body[0].y = this.body[0].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn_FP);
    // this.body[0].x = this.body[0].x + 2*this.assets.snakeBallRadius;
  }
}
Snake.prototype.moveLeft_FP = function(){
  this.assets.snakeVerticalIncrementTurn_FP = this._resetVerticalIncrement_FP();
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn_FP);
  }
  else
  {
    this.body[0].x = this.body[0].x - 3;
    this.body[0].y = this.body[0].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn_FP);
  }
}
Snake.prototype.moveForward_FP = function(lastKey){
  this.move();
  if(this.body.length > 1)
  {
    var incrementX = 7;
    var incrementY = Math.sqrt(4*this.assets.snakeBallRadius*this.assets.snakeBallRadius - incrementX*incrementX);
    switch(lastKey)
    {
      case 'right':
        this.body[0].x = this.body[1].x + incrementX;
        this.body[0].y = this.body[1].y - incrementY;
        this.recalculatePosition(- incrementY);
      break;
      case 'left':
        this.body[0].x = this.body[1].x - incrementX;
        this.body[0].y = this.body[1].y - incrementY;
        this.recalculatePosition(- incrementY);
      break;
      default:
        this.body[0].x = this.body[1].x;
        this.body[0].y = this.body[1].y - 2*this.assets.snakeBallRadius;
        this.recalculatePosition(- 2*this.assets.snakeBallRadius);
      break;
    }
  }
  else if(this.body.length === 1)
  {
    this.body[0].x = this.assets.calculateXincrement_FP(this.body[0].x, 'forward', lastKey);
    this.body[0].y = this.body[0].y - this.assets.snakeVerticalIncrementTurn_FP;
    this.recalculatePosition(- this.assets.snakeVerticalIncrementTurn_FP);
  }
}
Snake.prototype._resetVerticalIncrement_FP = function(){
  return this.assets.snakeVerticalIncrementTurnInitial_FP;
}

