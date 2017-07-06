var Engine = (function(global) {
  var doc = global.document,
      win = global.window,
      frames = 0;

  function main(){
    frames++;
    if(frames === snake.speed){
        frames = 0;
        snake.update();
    }
    render();
    win.requestAnimationFrame(main);
  }

  function init() {
    main();
  }

  function render(){
    interF.render(canvas.width,canvas.height);
    interF.updateScore();
    point.checkCollision();
    point.render();
    snake.render();
  }

  document.getElementById('startGame').addEventListener('click', function(){
  var player = document.getElementById('player');
  if(player.value){
    document.getElementById('snakebox').style.display = "none";
    interF.player = player.value;
    init();
  } else {
    player.placeholder = "ENTER NAME"
  }
})
})(this);
