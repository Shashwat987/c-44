const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var player, playerBase, playerArcher;
var computer, computerBase, computerArcher;
var playerArcherLife = 3
var computerArcherLife = 3
//Declare an array for arrows playerArrows = [ ]
var playerArrows = [];
var computerArrows = [];
var arrow;

function preload(){
backgroundImg = loadImage ("assets/background.gif")
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  playerBase = new PlayerBase(300, random(450, height - 300), 180, 150);
  player = new Player(285, playerBase.body.position.y - 153, 50, 180);
  playerArcher = new PlayerArcher(
    340,
    playerBase.body.position.y - 180,
    120,
    120
  );

  computerBase = new ComputerBase(
    width - 300,
    random(450, height - 300),
    180,
    150
  );
  computer = new Computer(
    width - 280,
    computerBase.body.position.y - 153,
    50,
    180
  );
  computerArcher = new ComputerArcher(
    width - 340,
    computerBase.body.position.y - 180,
    120,
    120
  );
  //Function to manage computer Arrows
  handleComputerArcher(); 


}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

 // Use for loop to display arrow using showArrow() function
 for (var i = 0; i < playerArrows.length; i++) {
  showArrows(i, playerArrows);
}
player.display();
playerBase.display();
player.life();
playerArcher.display();
handlePlayerArrowCollision()
for (var i = 0; i < computerArrows.length; i++) {
  showArrows(i, computerArrows);
}
computer.display();
computerBase.display();
computer.life();
computerArcher.display();
handleComputerArrowCollision();

}

function keyPressed() {

  if(keyCode === 32){
    // create an arrow object and add into an array ; set its angle same as angle of playerArcher
    var posX = playerArcher.body.position.x;
    var posY = playerArcher.body.position.y;
    var angle = playerArcher.body.angle;

    var arrow = new PlayerArrow(posX, posY, 100, 10, angle);

    arrow.trajectory = [];
    Matter.Body.setAngle(arrow.body, angle);
    playerArrows.push(arrow);

  }
}

function keyReleased () {

  if(keyCode === 32){
    //call shoot() function for each arrow in an array playerArrows
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }

}
//Display arrow and Tranjectory
function showArrows(index, arrows) {
  arrows[index].display();
  
  if(arrows[index].body.position.x > width || arrows[index].body.position.y > height){
    if(!arrows[index].isRemoved){
      arrows[index].remove(index,arrows);
    }
    else{arrows[index].trajectory = []}
}
    
  
 

}

function handleComputerArcher() {
  if (!computerArcher.collapse && !playerArcher.collapse) {
    setTimeout(() => {
      var pos = computerArcher.body.position;
      var angle = computerArcher.body.angle;
      var moves = ["UP", "DOWN"];
      var move = random(moves);
      var angleValue;

      if (move === "UP" && computerArcher.body.angle < 1.67) {
        angleValue = 0.1;
      } else {
        angleValue = -0.1;
      }
      if (move === "DOWN" && computerArcher.body.angle < 1.47) {
        angleValue = 0.1;
      } else {
        angleValue = -0.1;
      }

      angle += angleValue;

      var arrow = new ComputerArrow(pos.x, pos.y, 100, 10, angle);

      Matter.Body.setAngle(computerArcher.body, angle);
      Matter.Body.setAngle(computerArcher.body, angle);

      computerArrows.push(arrow);
      setTimeout(() => {
        computerArrows[computerArrows.length - 1].shoot(angle);
      }, 100);

      handleComputerArcher();
    }, 2000);
  }
}

function handlePlayerArrowCollision() {
  for (var i = 0; i < playerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerBase.body
    );

    var archerCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computerArcher.body
    );

    var computerCollision = Matter.SAT.collides(
      playerArrows[i].body,
      computer.body
    );

    if (
      baseCollision.collided ||
      archerCollision.collided ||
      computerCollision.collided
    ) {
      console.log("Player arrow Collided");
      computerArcherLife-=1;
      computer.reduceLife(computerArcherLife);
      
      if(computerArcherLife <= 0 ){
       computerArcher.collapse = true;
       Matter.Body.setStatics(computerArcher.body,false);
       Matter.Body.setStatics(computer.body, false);
       Matter.Body.setPosition(computer.body,{x:width-100,y:computer.body.position.y});
      }
      }
    }
  

}

function handleComputerArrowCollision() {
  for (var i = 0; i < computerArrows.length; i++) {
    var baseCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerBase.body
    );

    var archerCollision = Matter.SAT.collides(
      computerArrows[i].body,
      playerArcher.body
    );

    var playerCollision = Matter.SAT.collides(
      computerArrows[i].body,
      player.body
    );

    if (
      baseCollision.collided ||
      archerCollision.collided ||
      playerCollision.collided
    ) {
       console.log("Computer Arrow Collided")
       playerArcherLife-=1;
      player.reduceLife(playerArcherLife);
      
      if(playerArcherLife <= 0 ){
       playerArcher.collapse = true;
       Matter.Body.setStatics(playerArcher.body,false);
       Matter.Body.setStatics(player.body, false);
       Matter.Body.setPosition(player.body,{x:100,y:player.body.position.y});
      }
    }
  }
}

