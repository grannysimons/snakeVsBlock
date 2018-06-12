function Game(){
  this.assets = new Assets();
  this.ctx = document.getElementById('canvas').getContext('2d');
  this.snake = new Snake(this.ctx, this.assets);
  this.blocks = [];
}

Game.prototype.init = function(){
  this.snake.draw();
}

Game.prototype.clearCanvas = function(){
  // this.ctx.clearRect(0, 0, this.ctx.width, this.ctx.height);
}

Game.prototype.draw = function(){
  
}
Game.prototype.generateBall = function(){
  
}
Game.prototype.generateBlocks = function(){
  
}
Game.prototype.destroyBlock = function(blockObj){
  
}
Game.prototype.generateWall = function(){
  
}
Game.prototype.finish = function(){
  
}