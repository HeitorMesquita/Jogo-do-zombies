var bg,bgImg;
var player, shooterImg, shooter_shooting;

var explosion;
var heart1, heart2, heart3;
var zombie, zombieImg;

var zombiesGroup, ammoGroup;

var ammo;
var ammo_1;

var life = 3;
var score = 0;
var ammos = 64;

var gameState = "play";

var explosionSound, loseSound, winSound;

function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")

  bgImg = loadImage("assets/bg.jpeg")

  heart1Img = loadImage("./assets/heart_1.png");
  heart2Img = loadImage("./assets/heart_2.png");
  heart3Img = loadImage("./assets/heart_3.png");
  ammo_1 = loadImage("./assets/ammo_1.png");

  zombieImg = loadImage("./assets/zombie.png");

  explosionSound = loadSound("./assets/explosion.mp3");
  loseSound = loadSound("./assets/lose.mp3");
  winSound = loadSound("./assets/win.mp3");

  winSound.loop = false;
  loseSound.loop = false;

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adicionando a imagem de fundo
  bg = createSprite(displayWidth/2,displayHeight/2,20,20)
  bg.addImage(bgImg)
  bg.scale = 1
  

  //criando o sprite do jogador
  player = createSprite(displayWidth - 1150, displayHeight - 300, 50, 50);
  player.addImage(shooterImg)
  player.scale = 0.3
  //player.debug = true
  player.setCollider("rectangle",0,0,300,300)

  zombiesGroup = new Group();
  ammoGroup = new Group();

}

function draw() {
  background(0); 
  
  if (gameState === "play"){

    //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
    if(keyDown("UP_ARROW")||touches.length>0){
      player.y = player.y-30
    }

    if(keyDown("DOWN_ARROW")||touches.length>0){
      player.y = player.y+30
    }

    zombies()
    //solte balas e mude a imagem do atirador para a posição de tiro quando a tecla de espaço for pressionada
    if(keyWentDown("space")){
      player.addImage(shooter_shooting)
      explosionSound.play();
      ammo = createSprite(player.x, player.y - 25, 20, 10);
      ammo.addImage(ammo_1);
      ammo.scale = 0.04
      ammo.velocityX = 10;
      ammoGroup.add(ammo);
      ammos = ammos - 1;
    }

    //o jogador volta à imagem original quando pararmos de pressionar a barra de espaço
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }

    if(zombiesGroup.isTouching(ammoGroup)){
      for (var i = 0; i < zombiesGroup.length; i++){
        if(zombiesGroup[i].isTouching(ammoGroup)){
          zombiesGroup[i].destroy();
          ammoGroup.destroyEach();
          score = score + 1;
        }
      }
    }

    if(zombiesGroup.isTouching(player)){
      for (var i = 0; i < zombiesGroup.length; i++){
        if(zombiesGroup[i].isTouching(player)){
          zombiesGroup[i].destroy();
          life = life - 1;
        }
      }
    }

    if(score === 50){
      gameState = "win"
      winSound.play();
      winSound.setVolume(0.5)
    }

    if(ammos === 0){
      gameState = "end"
      loseSound.play();
      loseSound.setVolume(0.5)
    }

    if(life === 0){
      gameState = "end"
      loseSound.play();
      loseSound.setVolume(0.5)
    }
  }

  drawSprites();

  if(gameState === "end"){
    zombiesGroup.destroyEach();
    player.destroy();
    textSize(32);
    fill("red");
    text("GameOver",500,200);
  }

  if(gameState === "win"){
    zombiesGroup.destroyEach();
    textSize(32);
    fill("green");
    text("Winner",500,200);
  }
  
  textSize(18);
  fill("red");
  text("Vidas: " + life, 1000, 40);
  text("Pontuação: " + score, 1000, 70);
  text("Munição: " + ammos, 1000, 100);

}

function zombies(){
  if(frameCount % 90 === 0){
    var zombie = createSprite(width, height/2, 20, 20);
    zombie.y = Math.round(random(100, height - 80));
    zombie.addImage(zombieImg);
    zombie.velocityX = -3
    zombie.scale = 0.15
    zombiesGroup.add(zombie);
    //zombie.debug = true;
    zombie.setCollider("rectangle", 0,0,200,800)
    zombie.lifetime = 500

  }

}
