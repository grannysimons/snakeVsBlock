function Scoreball(assets, ctx){
  this.assets = assets;
  this.ctx = ctx;
  this.points = this.assets.scores[Math.floor(Math.random() * this.assets.scores.length)];
  this.x = Math.random() * this.ctx.width;
  this.y = (Math.random() * this.ctx.height)%(this.ctx.height - this.assets.snakeDistanceToLow) - this.ctx.height;
}

Scoreball.prototype.draw = function(){
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, this.assets.snakeBallRadius, 0, 2 * Math.PI, false);
  this.ctx.fillStyle = this.assets.scoreBallColorNormal;
  this.ctx.fill();
  this.ctx.closePath();

  this.ctx.font="10px Arial";
  this.ctx.fillStyle=this.assets.scoreColor;
  this.ctx.fillText(this.points,this.x - 3, this.y - this.assets.snakeBallRadius - 6);
}

Scoreball.prototype.recalculatePosition = function(){
    this.y += this.assets.drawInterval;
}

Scoreball.prototype.setFirstScoreball = function(){
  this.y = (Math.random() * this.ctx.height)%(this.ctx.height - this.assets.snakeDistanceToLow);
}