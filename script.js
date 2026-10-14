const emojis = ["🍎","🍌","🍇","🍉","🍓","🍒","🥝","🍍","🥥","🥑","🍑","🍋"];

let firstCard, secondCard;
let lock = false;
let moves = 0;
let matched = 0;
let timer = 0;
let interval;

const game = document.getElementById("game");

function startGame(){
  game.innerHTML = "";
  clearInterval(interval);
  timer = 0;
  moves = 0;
  matched = 0;

  document.getElementById("moves").textContent = moves;
  document.getElementById("time").textContent = timer;
  document.getElementById("progress").style.width = "0%";

  let size = document.getElementById("difficulty").value;
  game.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  let pairs = (size * size) / 2;
  let selected = emojis.slice(0, pairs);
  let cards = [...selected, ...selected].sort(()=>0.5 - Math.random());

  cards.forEach(icon => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${icon}</div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card, icon));
    game.appendChild(card);
  });
}

function flipCard(card, icon){
  if(lock || card.classList.contains("flip")) return;

  if(timer === 0){
    interval = setInterval(()=>{
      timer++;
      document.getElementById("time").textContent = timer;
    },1000);
  }

  card.classList.add("flip");

  if(!firstCard){
    firstCard = {card, icon};
  } else {
    secondCard = {card, icon};
    lock = true;
    moves++;
    document.getElementById("moves").textContent = moves;

    if(firstCard.icon === secondCard.icon){
      firstCard.card.classList.add("match");
      secondCard.card.classList.add("match");
      matched += 2;
      updateProgress();
      resetTurn();

      if(matched === game.children.length){
        winGame();
      }

    } else {
      setTimeout(()=>{
        firstCard.card.classList.remove("flip");
        secondCard.card.classList.remove("flip");
        resetTurn();
      },800);
    }
  }
}

function resetTurn(){
  firstCard = null;
  secondCard = null;
  lock = false;
}

function updateProgress(){
  let percent = (matched / game.children.length) * 100;
  document.getElementById("progress").style.width = percent + "%";
}

function winGame(){
  clearInterval(interval);
  launchConfetti();
  setTimeout(()=>{
    alert(`🎉 You Won!\nMoves: ${moves}\nTime: ${timer}s`);
  },500);
}

/* CONFETTI */
function launchConfetti(){
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let pieces = [];

  for(let i=0;i<100;i++){
    pieces.push({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      size: Math.random()*5+5,
      speed: Math.random()*3+2
    });
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.fillRect(p.x,p.y,p.size,p.size);
      p.y += p.speed;
      if(p.y > canvas.height) p.y = 0;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* START */
startGame();