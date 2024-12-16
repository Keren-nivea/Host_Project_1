const gameContainer = document.querySelector('.game-container');
const cards = document.querySelectorAll('.card-container');
const startGameButton = document.querySelector('.game-container button');
const playground = document.querySelector('.playground');
const repeatIcon = document.querySelector('.fa-repeat');
const main = document.querySelector('.main');

let levels = 2, col = 2, rows = 2, matched = 0,turns=0;
let card1 = null, card2 = null, isPreventClick = false;

cards.forEach(element => {
    element.addEventListener("click", (e) => {
        cards.forEach(el => el.classList.remove("active"));
        e.target.parentElement.classList.add("active");
        levels = e.target.parentElement.getAttribute("level");
        col = e.target.parentElement.getAttribute("col");
        rows = e.target.parentElement.getAttribute("rows");
    });
});

startGameButton.addEventListener("click", () => {
    main.style.display = "none";
    playground.style.display = "grid";
    updatePlaygroundSize();
    playground.style.gridTemplateColumns = `repeat(${col},auto)`;
    playground.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    repeatIcon.style.display="block";
    createCards();
});

function createCards() {
    const cardImages = ["scenery1.jpeg", "scenery2.jpeg", "scenery3.jpeg", "scenery4.jpeg",
        "scenery5.jpeg", "scenery6.jpeg", "scenery7.jpeg", "scenery8.jpeg","scenery9.jpeg","scenery10.jpeg","scenery11.jpeg","scenery12.jpeg","scenery13.jpeg","scenery14.jpeg","scenery15.jpeg","scenery16.jpeg","scenery17.jpeg","scenery18.jpeg"];
    const selectedCards = cardImages.slice(0, levels);
    shuffleCards([...selectedCards, ...selectedCards]);
}

function shuffleCards(cards) {
    playground.innerHTML = "";
    cards.sort(() => Math.random() - 0.5);
    cards.forEach(card => {
        playground.innerHTML += `
        <div class="card">
            <div class="front"><i class="fa fa-question"></i></div>
            <div class="back"><img src="./images/${card}" alt="scenery"></div>
        </div>`;
    });
    setupCardClick();
}

function setupCardClick() {
    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        card.addEventListener('click', () => {
            if (isPreventClick || card.classList.contains('flipped')) return;
            card.classList.add('flipped');

            if (!card1) {
                card1 = card;
            } else {
                card2 = card;
                turns++;
                checkMatch();
            }
        });
    });
}

function checkMatch() {
    isPreventClick = true;
    const img1 = card1.querySelector('.back img').src;
    const img2 = card2.querySelector('.back img').src;

    if (img1 === img2) {
        matched++;
        resetCards();

        if(matched == levels){endGame();}
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            resetCards();
        }, 1000);
    }
}

function endGame() {
    isPreventClick = true;  
    const maxScore = 1000;
    const penalty = 10; 
    const finalScore = Math.max(0, maxScore - (turns * penalty));  

    playground.innerHTML = `
        <div class="score-container">
            <h2>Game Over!</h2>
            <p>Your score: ${finalScore}</p>
            <p>Total turns: ${turns}</p>
            <button id="play-again">Play Again</button>
        </div>
    `;
    playground.style.height="250px";
    playground.style.width="150px";
    repeatIcon.style.display="none";

    const playAgainButton = document.querySelector('#play-again');
    playAgainButton.addEventListener('click', restartGame);
}

function restartGame() {
    turns = 0;        
    matched = 0;     
    card1 = card2 = null;
    isPreventClick = false;

    playground.innerHTML = "";  

    playground.style.display = "none";
    main.style.display = "block";   
    
    playground.style.gridTemplateColumns = "";
    playground.style.gridTemplateRows = "";
}


function resetCards() {
    [card1, card2] = [null, null];
    isPreventClick = false;
}

repeatIcon.addEventListener("click", () => {
    playground.innerHTML = "";  
    matched = 0;  
    card1 = card2 = null;  
    IsPreventClick = false;  
    createCards();
});


 
function updatePlaygroundSize() {
    const cardSize = window.innerWidth <= 500 ? 60 : 100;   
    const gapSize = 2;  
    const padding = 12;  

    const playgroundWidth = col * (cardSize + gapSize) - gapSize + padding * 2;
    const playgroundHeight = rows * (cardSize + gapSize) - gapSize + padding * 2;

    playground.style.gridTemplateColumns = `repeat(${col}, ${cardSize}px)`;
    playground.style.gridTemplateRows = `repeat(${rows}, ${cardSize}px)`;
    playground.style.width = `${playgroundWidth}px`;
    playground.style.height = `${playgroundHeight}px`;

    playground.style.margin = "0 auto";
}

 
window.addEventListener('resize', updatePlaygroundSize);

updatePlaygroundSize();
