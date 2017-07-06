// Canvas creatation and adding
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 550;
document.getElementById('wrapper').appendChild(canvas);

// Interface object. Renders map. Contains player name and score.
var InterF = function(){
  this.width = canvas.width;
  this.height = canvas.height;
  this.scoreLabel = "SCORE: ";
  this.scoreValue = 0;
  this.player;
}
InterF.prototype.render = function(){
  ctx.fillStyle = 'rgb(131, 190, 105)';
  ctx.fillRect(0,0,this.width,this.height);

  ctx.beginPath();
  ctx.moveTo(20,20);
  ctx.lineTo(this.width - 20,20);
  ctx.lineTo(this.width - 20,this.height - 70);
  ctx.lineTo(20,this.height - 70);
  ctx.lineTo(20,20);
  ctx.stroke();
}

InterF.prototype.updateScore = function(){
  ctx.fillStyle = "rgb(131, 190, 105)";
  ctx.fillRect(20,525,200, 40);
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(this.scoreLabel + this.scoreValue,20,525);
  ctx.fillText("PLAYER: " + this.player,220,525);
}

// Snake object.
var Snake = function(){
  this.direction = 'up';
  this.body = [{'x': 240, 'y':240},{'x': 240, 'y':220},{'x': 240, 'y':200},{'x': 240, 'y':180}];
  this.speed = 15;
  this.size = 20;
  this.food = false;
}

// Movement method. Checking for borders. Flag for food.
Snake.prototype.update = function(dt) {
    var list = this.body;
    ctx.clearRect(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y, this.size, this.size);
    this.nextItem();
    if(list[list.length - 1].y < snake.size ||
      list[list.length - 1].y > (interF.width - (snake.size * 2)) ||
      list[list.length - 1].x < snake.size ||
      list[list.length - 1].x > (interF.width - (snake.size * 2))){
      this.reset();
    }
    if(!this.food) {
      this.body.shift();
    } else {
      if(this.speed > 5){
        this.speed -=  1;
      }
      this.food = false;
    }
}

//  Restart game
Snake.prototype.reset = function(){
   snake = new Snake();
   point.reset();
}

// Adding next box to the Snake body and removes to old one. Depending on direction.
Snake.prototype.nextItem = function () {
  var list = this.body;
  switch (this.direction) {
    case 'up':
      var next = {'x' : list[list.length - 1].x, 'y' : list[list.length - 1].y - this.size};
      this.body.push(next);
      break;
    case 'right':
      var next = {'x' : list[list.length - 1].x + this.size, 'y' : list[list.length - 1].y};
      this.body.push(next);
      break;
    case 'down':
      var next = {'x' : list[list.length - 1].x, 'y' : list[list.length - 1].y + this.size};
      this.body.push(next);
      break;
    case 'left':
      var next = {'x' : list[list.length - 1].x - this.size, 'y' : list[list.length - 1].y};
      this.body.push(next);
      break;
    default:
  }
}

// Handle human imput.
Snake.prototype.changeDir = function(key){
  if(this.direction != "up" && key == "down" || key == "up" && this.direction != "down" ||
      this.direction != "left" && key == "right" || key == "left" && this.direction != "right")
      {
        this.direction = key;
      }
}

// Rendering snake it self.
Snake.prototype.render = function(){
  var list = this.body;

  for(var i = list.length-1; i <= list.length-1 && i > 0; i--){
    if(i == list.length-1){
      ctx.fillStyle = 'white';
    } else {
      ctx.fillStyle = 'black';
    }

    ctx.fillRect(list[i].x+1, list[i].y+1, this.size-1, this.size-1);

    if(!this.isUnique()){
      snake.reset();
    }
  }
}

// Checking for self crossing.
Snake.prototype.isUnique = function compare(){
  var result = true;
  var list = this.body;
  for(var i = list.length - 2; i >= 0 ; i--){
    if(list[list.length - 1].x == list[i].x && list[list.length - 1].y == list[i].y) {
      result = false;
      break;
    }
  }
  return result;
}

// Food object. Spawns at random location each time.
var Point = function() {
  this.x = this.newLoc(snake.size,interF.width - snake.size,snake.size);
  this.y = this.newLoc(snake.size,interF.width - snake.size,snake.size);
  this.meter = (snake.size - 4)/3;
}
// Rendering.
Point.prototype.render = function() {
  if(point.checkPosition()){
    ctx.fillStyle = "rgb(215, 58, 228)";
    ctx.fillRect(this.x + 2 + this.meter, this.y + 2,this.meter, this.meter);
    ctx.fillRect(this.x + 2, this.y + 2 + this.meter,this.meter, this.meter);
    ctx.fillRect(this.x + 2 + (this.meter * 2), this.y + 2 + this.meter,this.meter, this.meter);
    ctx.fillRect(this.x + 2 + this.meter, this.y + 2 + (this.meter * 2) ,this.meter, this.meter);
  } else {
    this.reset();
  }
}
// To not appear inside the Snake.
Point.prototype.checkPosition = function() {
  var result = true;
  var list = snake.body;
  for(var i = list.length - 2; i >= 0 ; i--){
    if(this.x == list[i].x && this.y == list[i].y) {
      result = false;
      break;
    }
  }
  return result;
}
// Check if food is reached.
Point.prototype.checkCollision = function(){
  var result = false;
  if(this.x == snake.body[snake.body.length -1].x && this.y == snake.body[snake.body.length -1].y){
      snake.food = true;
      interF.scoreValue += 1;
      interF.updateScore();
      this.reset();
      result = true;
  }
  return result;
}

// Reset food.
Point.prototype.reset = function() {
  point = new Point();
}

//  function for random location.
Point.prototype.newLoc = function(min,max,num) {
    return Math.floor(Math.floor(Math.random()*(max-min+1)+min) / num) * num;
}

// Initializing objects.
var interF = new InterF();
var snake = new Snake();
var point = new Point();

// Human input listeners
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if(allowedKeys[e.keyCode]){
      snake.changeDir(allowedKeys[e.keyCode]);
    }
});
