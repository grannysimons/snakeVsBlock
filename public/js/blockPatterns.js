function BlockPattern(assets, ctx){
    this.assets = assets;
    this.ctx = ctx;
    this.pattern = [];
    this.numBlocks = 10;
    this.numHoles = Math.floor(Math.random() * 7);
    this.y = 100;
}

BlockPattern.prototype.generatePatternAt = function(posY, userScore){
    //generates the pattern
    var distance = (Math.random() * (this.assets.distanceMax - this.assets.distanceMin)) + this.assets.distanceMin;
    if(posY != 0) this.y = posY - distance;
    for (var i = 0; i < this.numHoles; i++)
    {
        this.pattern.push(false);
    }
    for(var i = this.numHoles; i<this.numBlocks; i++)
    {
        var newBlock = new Block(this.assets, this.ctx);
        this.pattern.push(newBlock);
    }
    this._setUserScoreToBlock(this.pattern[this.numHoles], Math.floor(Math.random() * userScore));
    this._setUserScoreToBlock(this.pattern[this.numHoles + 1], Math.floor(Math.random() * userScore));
    this.pattern = this._shuffle(this.pattern);

    for(var i = 0; i < this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) === 'object') this.pattern[i].setPosition(i * this.pattern[i].width, this.y);
    }
}

BlockPattern.prototype._setUserScoreToBlock = function(block, score){
    block.score = score;
}

BlockPattern.prototype.move = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            this.pattern[i].y += this.assets.drawInterval;
        }
    }
}

BlockPattern.prototype.draw = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            // this.pattern[i].y += this.assets.drawInterval;
            this.pattern[i].draw();
        }
    }
}

BlockPattern.prototype.recalculatePosition = function(){
    for(var i = 0; i<this.pattern.length; i++)
    {
        if(typeof(this.pattern[i]) == 'object')
        {
            this.pattern[i].recalculatePosition();
            this.y = this.pattern[i].y;
        }
    }
}

BlockPattern.prototype._shuffle = function(array)
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
