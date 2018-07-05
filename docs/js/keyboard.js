function Keyboard(ctx, assets){
    this.keys = [];
    this.ctx = ctx;
    this.assets = assets;
    this.lastKeyPressed;

    window.addEventListener('keydown', function(e){
        switch(e.key)
        {
          case 'ArrowRight':
            this.keys[this.assets.ARROW_RIGHT] = true;
          break;
          case 'ArrowLeft':
            this.keys[this.assets.ARROW_LEFT] = true;
          break;
          case 'Enter':
            this.keys[this.assets.ENTER] = true;
          break;
          case ' ':
            this.keys[this.assets.SPACEBAR] = true;
          break;
        }
      }.bind(this));
      window.addEventListener('keyup', function(e){
        for (var i = 0; i<this.keys.length; i++)
        {
          this.keys[i]=false;
        }
      }.bind(this));
}

//init
Keyboard.prototype.initKeys = function(){
    this.keys[assets.ARROW_RIGHT] = false;
    this.keys[assets.ARROW_LEFT] = false;
    this.keys[assets.SPACEBAR] = false;
    this.keys[assets.ENTER] = false;
}

//manage pressed keys
Keyboard.prototype.isRightPressed = function(){
    return this.keys[this.assets.ARROW_RIGHT];
}
Keyboard.prototype.isLeftPressed = function(){
    return this.keys[this.assets.ARROW_LEFT];
}
Keyboard.prototype.isSpacebarPressed = function(){
    return this.keys[this.assets.SPACEBAR];
}
Keyboard.prototype.isEnterPressed = function(){
    return this.keys[this.assets.ENTER];
}
Keyboard.prototype.anyKeyPressed = function(){
    //cheks if any key has been pressed
    var anyKeyPressed = false;
    this.keys.forEach(function(value){
      if (value === true) anyKeyPressed = true;
    });
    return anyKeyPressed;
}
Keyboard.prototype.setKeyPressed = function(key)
{
  //sets last key pressed
  this.lastKeyPressed = key;
}
Keyboard.prototype.checkNewKeyPressed = function(key)
{
  return !(this.lastKeyPressed === key);
}
Keyboard.prototype.getKeysArray = function(){
    return this.keys;
}