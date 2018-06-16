function Block(assets, ctx)
{
  this.ctx = ctx;
  this.assets = assets;
  this.width = this.assets.blockWidth;
  this.height = this.assets.blockHeight;
  this.x = (Math.random() * this.ctx.width - this.assets.blockWidth) + this.assets.blockWidth/2;
  this.y = - this.assets.blockHeight;
  this.borderRadius = 10;
  this.points = Math.floor(Math.random() * this.assets.maxBlockScores) + 1;
  this.color = this.assets.blockColors[Math.floor(Math.random() * this.assets.blockColors.length)];
}

Block.prototype.draw = function(){
  this.ctx.beginPath();
  this.ctx.moveTo(this.x, this.y);
  this.ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + this.borderRadius, this.borderRadius);
  this.ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - this.borderRadius, this.y + this.height, this.borderRadius);
  this.ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - this.borderRadius, this.borderRadius);
  this.ctx.arcTo(this.x, this.y, this.x + this.borderRadius, this.y, this.borderRadius);
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
  this.ctx.stroke();   

  this.ctx.font="20px Arial";
  this.ctx.fillStyle=this.assets.scoreColor;
  this.ctx.fillText(this.points,this.x + this.width/2 - 11, this.y + this.height/2 + 6);
}

Block.prototype.setFirstBlock = function(){

}

Block.prototype.recalculatePosition = function(){
  this.y += this.assets.drawInterval;
}
