function WallPattern(assets, ctx){
    this.assets = assets;
    this.ctx = ctx;
    this.pattern = [];  //8 positions
    this.numPatterns = 8;
    this.numHoles = Math.floor(Math.random() * 7) + 2;
    this.y = 100;
}

WallPattern.prototype.generateWallAt = function(posY, lastDistance){
    //generates the wall
    var distance = lastDistance;
    if(posY != 0) this.y = posY - distance;
    for (var i = 0; i < this.numHoles; i++)
    {
        this.pattern.push(false);
    }
    for(var i = this.numHoles; i<this.numPatterns; i++)
    {
        var newWall = new Wall(this.assets, this.ctx);
        this.pattern.push(newWall);
    }
    this.pattern = this._shuffle(this.pattern);
}
WallPattern.prototype.move = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            this.pattern[i].y += this.assets.drawInterval;
        }
    }
}
WallPattern.prototype.draw = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            this.pattern[i].draw();
        }
    }
}
WallPattern.prototype.recalculatePosition = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            this.pattern[i].recalculatePosition();
            this.y = this.pattern[i].y;
        }
    }
}
WallPattern.prototype._shuffle = function(array)
{
    let ctr = array.length;
    let temp;
    let index;

    // While there are elements in the array
    while (ctr > 0) {
    // Pick a random index
        index = Math.floor(Math.random() * ctr);
    // Decrease ctr by 1
        ctr--;
    // And swap the last element with it
        temp = array[ctr];
        array[ctr] = array[index];
        array[index] = temp;
    }
    return array;
}
