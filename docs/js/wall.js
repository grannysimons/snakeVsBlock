function Wall(assets, ctx)
{
  this.ctx = ctx;
  this.assets = assets;
  this.width = this.assets.wallWidth;
  this.height = this._calculateWallHeight();;
  this.x = this.assets.blockWidth * (1 + Math.floor(Math.random() * 7)) - this.assets.wallWidth/2;
  this.y = - this.height;
  this.color = 'white';
}

Wall.prototype._calculateWallHeight = function(){
    var height = (Math.random()*100) + 100;
    if(height > 0) return height;
    else return 0;
}
Wall.prototype.draw = function(){
  this.ctx.beginPath();
  this.ctx.arc(this.x + this.width/2, this.y , this.width/2, 0*Math.PI,2*Math.PI)
  this.ctx.arc(this.x + this.width/2, this.y + this.height , this.width/2, 0*Math.PI,2*Math.PI)
  this.ctx.rect(this.x, this.y, this.width, this.height);
  this.ctx.fillStyle = this.color;
  this.ctx.fill();
}
Wall.prototype.recalculatePosition = function(){
  this.y += this.assets.drawInterval;
}
Wall.prototype.setPosition = function(x, y){
  this.x = x;
  this.y = y;
}