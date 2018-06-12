function Snake(ctx, assets){
  this.assets = assets;
  this.ctx = ctx;
  this.body = [{
    x: 200, //this.ctx.width/2,
    y: 200, //this.ctx.height-this.assets.snakeDistanceToLow
    incX: 0
  }];
  this.score = 0;
}
Snake.prototype.move = function(){}
Snake.prototype.hasCollided = function(){}
Snake.prototype.looseBall = function(){}
Snake.prototype.gameOver = function(){}

Snake.prototype.addBall = function(){
  this.body.push({
    x: this.body[this.body.length-1].x,
    y: this.body[this.body.length-1].y + 2 * this.assets.snakeBallRadius,
    incX: 0
  });
}

Snake.prototype.moveRight = function(){
  var ballMoved = 0;
  var intervalId = setInterval(function(){
    this.clearBall(this.body[ballMoved]);
    this.calculateNewPosition(ballMoved, 'right');
    this.drawBall(this.body[ballMoved]);
    ballMoved++;
    if(ballMoved >= this.body.length)
    {
      clearInterval(intervalId);
    }
  }.bind(this), this.assets.snakeMovementInterval);
}

Snake.prototype.moveLeft = function(){
  var ballMoved = 0;
  var intervalId = setInterval(function(){
    this.clearBall(this.body[ballMoved]);
    this.calculateNewPosition(ballMoved,'left');
    this.drawBall(this.body[ballMoved]);
    ballMoved++;
    if(ballMoved >= this.body.length)
    {
      clearInterval(intervalId);
    }
  }.bind(this), this.assets.snakeMovementInterval);
}

Snake.prototype.calculateNewPosition = function(ballMoved, direction){
  if(direction === 'right')
  {
    this.body[ballMoved].x += this.assets.snakeIncrementBalls;
    if(this.body[ballMoved].x > this.ctx.canvas.width) this.body[ballMoved].x = this.ctx.canvas.width;
  }
  else if(direction === 'left')
  {
    this.body[ballMoved].x -= this.assets.snakeIncrementBalls;
    if(this.body[ballMoved].x < 0) this.body[ballMoved].x = 0;
  }
}

Snake.prototype.draw = function(){
  this.body.forEach(function(ball){
    this.drawBall(ball);
  }.bind(this));
}

Snake.prototype.drawBall = function(ball){
  this.ctx.beginPath();
  this.ctx.arc(ball.x, ball.y, this.assets.snakeBallRadius, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = this.assets.snakeColorNormal;
  this.ctx.fill();
}

Snake.prototype.clearBall = function(ball){
  var radius = this.assets.snakeBallRadius;
  this.ctx.clearRect(ball.x-radius, ball.y-radius, 2 * radius, 2 * radius);
}