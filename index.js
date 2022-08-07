
var gamePattern = [];
var userClickedPattern = [];
var buttonColours = ['red', 'blue', 'green', 'yellow'];
var level = 0;
var started = false;
var gamewin = 20;

$("#startgame").click(function(){
  if (!started){
    nextSequence();
    started = true;
  }
});

$(document).keypress(function(){
  if (!started){
    nextSequence();
    started = true;
  }
});

$(".clickbutton").click(function() {
  var userChosenColour = $(this).attr("id");
  userClickedPattern.push(userChosenColour);

  playAudio(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickedPattern.length - 1);
});

async function nextSequence() {
  if (level === gamewin){
    var audio = new Audio("sounds/win.wav");
    audio.play();
    $("#game-name").text("You Win");
    $("#game-start").text("Press any key to restart");
    $("#startgame").text("Restart");
    $("body").addClass("game-win");
    setTimeout(function () {
      $("body").removeClass("game-win");
    }, 400);
    startOver();
  }
  else {
    userClickedPattern = [];
    level ++;
    $("#game-name").text("Simon Game");
    $("#startgame").text("Started");
    $("#game-start").text("The Game is started");
    $("#game-level").text("Level : " + level);

    var randomNumber = Math.floor((Math.random() * 4));
    var randomChosenColour = buttonColours[randomNumber];

    gamePattern.push(randomChosenColour);

    if( $("#difficulty").is(':checked') ){
      flash(randomChosenColour);
      playAudio(randomChosenColour);
    }
    else{
      function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
      }
      var i = 0;
      while(i < level){
        await sleep(500);
        flash(gamePattern[i]);
        playAudio(gamePattern[i]);
        i++;
      }
    }
  }
}

function flash (flashpattern){
  $("#" + flashpattern).fadeIn(100).fadeOut(100).fadeIn(100);
}

function playAudio (soundname){
  var audio = new Audio("sounds/"+ soundname +".mp3");
  audio.play();
}

function checkAnswer(currentLevel){
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      setTimeout(function () {
        nextSequence();
      }, 600);
    }
  }
  else {
    playAudio("lose");
    $("#game-name").text("Game Over");
    $("#game-start").text("Press any key to restart");
    $("#startgame").text("Restart");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);
    startOver();
  }
}

function animatePress(currentColor){
  $("#" + currentColor).addClass("pressed");
  setTimeout(function () {
    $("#" + currentColor).removeClass("pressed");
  }, 150);
}

function startOver(){
  started = false;
  level = 0;
  gamePattern = [];
}
