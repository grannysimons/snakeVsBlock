function Snake(ctx, assets){
  this.assets = assets;
  this.ctx = ctx;
  this.body = [{
    x: 200, //this.ctx.width/2,
    y: 400, //this.ctx.height-this.assets.snakeDistanceToLow
    angle: 0
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
    angle: 0
  });
}
Snake.prototype.addBallToBeginning = function(){
  this.body.unshift({
    x: this.body[0].x,
    y: this.body[0].y + 2 * this.assets.snakeBallRadius,
    angle: this.body[0].angle
  });
}
Snake.prototype.move = function (){
  //eliminar ultima bola del this.body
  this.body.pop();
  //afegir una bola al principi del this.body amb les característiques de la primera bola
  var firstBall = this.body[0];
  this.body.unshift(firstBall);
  
}
Snake.prototype.moveForward = function(){
  //elimino rotacions
  this.ctx.rotate((2*Math.PI/180) * (- this.body[0].angle));
  this.move();
}
Snake.prototype.moveRight = function(){
  //rotació dreta
  // this.ctx.rotate((2*Math.PI/180) * (this.assets.snakeIncrementAngle));
  this.move();
  if(this.body.length > 1)
  {
    this.body[0].x = this.assets.calculateXincrement(this.body[1].x, 'right');
    this.body[0].y = this.body[1].y - this.assets.snakeVerticalIncrementTurn;
  }
  // this.addBallToBeginning(); //TEST
}
Snake.prototype.moveLeft = function(){
  //rotació esquerra
  // this.ctx.rotate((2*Math.PI/180) * (- this.assets.snakeIncrementAngle));
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
}
// Snake.prototype._clearBall = function(ball){
//   var radius = this.assets.snakeBallRadius;
//   this.ctx.clearRect(ball.x-radius, ball.y-radius, 2 * radius, 2 * radius);
// }