"use strict";

import Game from "./modules/Game";

// Créer la partie avec le nombre de tentatives souhaitées
const game = new Game(5);
game.createBoard();

// Afficher les formulaires dans le DOM
const board = document.querySelector(".board");
game.answers.forEach((answer) => {
  board.appendChild(answer.form);
});

// Afficher un message de bienvenue
game.displayMessage("Bonjour");
