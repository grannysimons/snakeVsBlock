function Snake(ctx, assets){
  this.assets = assets;
  this.ctx = ctx;
  this.body = [{
    x: this.ctx.canvas.width * 0.5, //200, //this.ctx.width/2,
    y: this.ctx.canvas.height - this.assets.snakeDistanceToLow, //400, //this.ctx.height-this.assets.snakeDistanceToLow
  }];
  this.score = 0;
}
Snake.prototype.hasCollided = function(){}
Snake.prototype.looseBall = function(){}
Snake.prototype.gameOver = function(){}

Snake.prototype.addBall = function(){
  this.body.push({
    x: this.body[this.body.length-1].x,
    y: this.body[this.body.length-1].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.addBallToBeginning = function(){
  this.body.unshift({
    x: this.body[0].x,
    y: this.body[0].y + 2 * this.assets.snakeBallRadius,
  });
}
Snake.prototype.move = function (){
  //eliminar ultima bola del this.body
  this._clearBall(this.body[this.body.length-1]);
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
}
Snake.prototype.moveRight = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
  }
}
Snake.prototype.moveLeft = function(){
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'left');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
  }
}

Snake.prototype.draw = function(){
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
Snake.prototype._clearBall = function(ball){
  var radius = this.assets.snakeBallRadius;
  this.ctx.clearRect(ball.x-radius-0.3, ball.y-radius-0.3, 2 * radius+0.6, 2 * radius+0.6);
}