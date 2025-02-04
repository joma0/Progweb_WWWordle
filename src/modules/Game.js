"use strict";
import Answer from "./Answer";

class Game {
  answers = [];
  currentTry = 0;

  constructor(tryNumber) {
    this.tryNumber = tryNumber;
  }

  createBoard() {
    for (let index = 1; index <= this.tryNumber; index++) {
      this.answers.push(new Answer(this));
    }
    this.currentTry = 1;
    this.answers[this.currentTry - 1].switchState();
  }

  nextTry() {
    this.answers[this.currentTry - 1].switchState();
    this.currentTry += 1;
    this.answers[this.currentTry - 1].switchState();
  }

  displayMessage(message) {
    document.querySelector(".message").textContent = message;
  }
}

export default Game;
