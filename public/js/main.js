var TEST = true;

window.onload = function(){
  var game = new Game();
  game.init();

  if(TEST) game.setTest();
}