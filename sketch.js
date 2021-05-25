//Create variables here
var dog,dog1,dog2;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var milk,milkimg;
var readState,gameState;


function preload(){
   dog1=loadImage("images/dogImg.png");
   dog2=loadImage("images/dogImg1.png");
   milkimg=loadImage("images/Milk.png");
   washrrom=loadImage("virtual pet images/Wash Room.png")
   bedroom=loadImage("virtual pet images/Bed Room.png")
   garden=loadImage("virtual pet images/Garden.png")
  }

//Function to set initial environment
function setup() {
  database=firebase.database();
  createCanvas(500,500);
  foodObj=new Food();
  dog=createSprite(250,300,150,150);
  dog.addImage(dog1);
  dog.scale=0.15;
 //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
   
  feed=createButton("Feed the dog");
  feed.position(650,90);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(750,90);
  addFood.mousePressed(addFoods);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
}

// function to display UI
function draw() {
currentTime=hour();
if(currentTime==(lastFed+1)){
  update("Playing");
  foodObj.garden();
}else if(currentTime==(lastFed+2)){
  update("Sleeping");
  foodObj.bedroom();
}else if(currentTime>(lastFed) && currentTime<=(lastFed+4)){
  update("Bathing");
  foodObj.washroom()
}else{
update("hungry")
foodObj.display();
}


 
  
 if(gameState!=="hungry"){
   feed.hide();
   addFood.hide();
   dog.remove();
 }else{
   feed.show();
   addFood.show();
   //dog.addImage(dog1);
 }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(dog2);
  milk=createSprite(180,320,10,10);
  milk.addImage(milkimg);
  milk.scale=0.1;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
//function to update gamestates in database
function update(state){
  database.ref('/').update({
    gameState:state
  });
}