const dealButton = document.getElementById('deal-button');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const result = document.getElementById('result');

let deck = [];
let playerCards = [];
let dealerCards = [];
let gameInProgress = false;

function initializeDeck() {
    deck = [
        '2♠', '3♠', '4♠', '5♠', '6♠', '7♠', '8♠', '9♠', '10♠', 'J♠', 'Q♠', 'K♠', 'A♠',
        '2♥', '3♥', '4♥', '5♥', '6♥', '7♥', '8♥', '9♥', '10♥', 'J♥', 'Q♥', 'K♥', 'A♥',
        '2♦', '3♦', '4♦', '5♦', '6♦', '7♦', '8♦', '9♦', '10♦', 'J♦', 'Q♦', 'K♦', 'A♦',
        '2♣', '3♣', '4♣', '5♣', '6♣', '7♣', '8♣', '9♣', '10♣', 'J♣', 'Q♣', 'K♣', 'A♣'
    ];
}

function drawInitialHands() {
    shuffleDeck(deck);
    playerCards = [drawCard(), drawCard()];
    dealerCards = [drawCard(), drawCard()];
}

initializeDeck();

dealButton.addEventListener('click', () => {
    if (gameInProgress) {
        return; // Evita iniciar una nueva partida si ya está en curso
    }

    // Elimina las cartas de la partida anterior
    playerHand.innerHTML = '';
    dealerHand.innerHTML = '';

    // Vuelve a inicializar el mazo y reparte dos cartas a cada jugador
    initializeDeck();
    drawInitialHands();

    // Actualiza la interfaz con las cartas repartidas
    updateHand(playerHand, playerCards, 'Tu mano:');
    updateHand(dealerHand, [dealerCards[0], '??'], 'Mano del Dealer:');

    // Habilita los botones de juego
    hitButton.disabled = false;
    standButton.disabled = false;
    dealButton.disabled = true;

    // Reinicia el resultado
    result.textContent = '';

    gameInProgress = true;
});

hitButton.addEventListener('click', () => {
    if (!gameInProgress) {
        return; // Evita tomar cartas si no hay una partida en curso
    }

    // Obtiene una carta aleatoria y la agrega a la mano del jugador
    const newCard = drawCard();
    playerCards.push(newCard);

    // Actualiza la interfaz
    playerHand.innerHTML += `<span>${newCard}</span>`;

    // Verifica si el jugador se pasó de 21
    const playerScore = calculateScore(playerCards);
    if (playerScore > 21) {
        endGame(false);
    }
});

standButton.addEventListener('click', () => {
    if (!gameInProgress) {
        return; // Evita plantarse si no hay una partida en curso
    }

    // Elimina los "??"
    dealerHand.innerHTML = '';

    // Muestra todas las cartas del dealer
    updateHand(dealerHand, dealerCards, 'Mano del Dealer:');

    // El dealer juega automáticamente hasta alcanzar 17 o más
    while (calculateScore(dealerCards) < 17) {
        const newCard = drawCard();
        dealerCards.push(newCard);
        dealerHand.innerHTML += `<span>${newCard}</span>`;
    }

    // Verifica el resultado del juego
    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    if (playerScore === 21 || (dealerScore > 21 && playerScore <= 21) || (playerScore <= 21 && playerScore > dealerScore)) {
        endGame(true);
    } else {
        endGame(false);
    }
});

function updateHand(handElement, cards, title) {
    handElement.innerHTML = `<h2>${title}</h2>`;
    cards.forEach(card => {
        let suitSymbol = '';
        if (card.includes('♥')) {
            suitSymbol = '♥';
        } else if (card.includes('♦')) {
            suitSymbol = '♦';
        } else if (card.includes('♠')) {
            suitSymbol = '♠';
        } else if (card.includes('♣')) {
            suitSymbol = '♣';
        }

        handElement.innerHTML += `<span>${card} ${suitSymbol}</span>`;
    });
}

function calculateScore(cards) {
    let score = 0;
    let hasAce = false;

    for (const card of cards) {
        if (card.includes('A')) {
            hasAce = true;
            score += 11;
        } else if (card.includes('K') || card.includes('Q') || card.includes('J')) {
            score += 10;
        } else {
            score += parseInt(card);
        }
    }

    // Ajusta la puntuación si hay un As en la mano
    if (hasAce && score > 21) {
        score -= 10;
    }

    return score;
}

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function drawCard() {
    if (deck.length === 0) {
        // El mazo está vacío, vuelve a inicializarlo y barájalo
        initializeDeck();
        shuffleDeck(deck);
    }
    return deck.pop();
}

function endGame(playerWins) {
    hitButton.disabled = true;
    standButton.disabled = true;

    const playerScore = calculateScore(playerCards);
    const dealerScore = calculateScore(dealerCards);

    // Muestra todas las cartas del dealer
    dealerHand.innerHTML = '';
    updateHand(dealerHand, dealerCards, 'Mano del Dealer:');

    if (playerWins) {
        result.textContent = '¡Ganaste!';
    } else {
        result.textContent = 'Perdiste.';
    }

    gameInProgress = false;
    
    // Habilita el botón "Repartir" para iniciar una nueva partida
    dealButton.disabled = false;
}
