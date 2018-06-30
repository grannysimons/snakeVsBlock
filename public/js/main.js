var TEST = false;

window.onload = function(){
var game = new Game();
game.init();
game.loadSound();

if(TEST) game.setTest();
}