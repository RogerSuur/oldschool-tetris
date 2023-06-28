const grid			  = document.querySelector('.grid')
const homeMenu		  = document.querySelector('.home-menu')
const scoreDisplay	  = document.querySelector('#score')
const linesDisplay	  = document.querySelector('#lines')
const levelDisplay	  = document.querySelector('#level')
const pauseBtn		  = document.querySelector('#pause-button')
const fpsCounter	  = document.querySelector('div#fpsCounter h1')
const upNextSquares   = document.querySelectorAll('.mini-grid div')
const pauseMenu		  = document.querySelector('.pause-menu')
const endMenu		  = document.querySelector('.end-menu')
const timerDisplay	  = document.querySelector('#timer')
const heart           = document.querySelector('#startHeart')
const heartBroken     = document.querySelector('#endHeart')
const enterUser       = document.querySelector('.enter-user')
const endScoreBoard	  = document.querySelector('#endScore')
const endTimeBoard	  = document.querySelector('#endTime')
const startBtn        = document.querySelector('#start-button')
const btn             = document.querySelector('#scores-button')
const scoreBoard	  = document.querySelector('.show-scores')
const scoreText	      = document.querySelector('.scoreText')
const scoresContainer = document.querySelector('#show-scores')
const scoresTable     = document.querySelector('#tableBody')
const pageButtons     = document.querySelector('.page-buttons')
const inputName       = document.querySelector('#input-box')
const score           = document.querySelector('#endScore')
const time            = document.querySelector('#endTime')
const getScoresButton = document.querySelector("#scores-button")
const postScoreButton = document.querySelector("#postForm")




const gw = 10; //grid width in squares
const upNextWidth = 4;
const upNextIndex = 0;

const lineScore = [0, 100, 300, 500, 800]