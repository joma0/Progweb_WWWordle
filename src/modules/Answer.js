"use strict";

class Answer {
  constructor(game) {
    this.form = this.#generateAnswerForm();
    this.game = game;
  }

  // Générer le formulaire
  #generateAnswerForm() {
    // Créer l'élément formulaire
    const form = document.createElement("form");

    // Créer les 5 inputs pour les lettres
    for (let i = 0; i <= 4; i++) {
      const input = document.createElement("input");
      input.classList.add("letter");
      input.type = "text";
      input.name = `letter-${i}`;
      input.maxLength = "1";
      form.appendChild(input);
      this.#handleFocus(input);
    }

    // Créer l'input Submit
    const inputSubmit = document.createElement("input");
    inputSubmit.type = "submit";
    inputSubmit.hidden = true;
    form.appendChild(inputSubmit);
    inputSubmit.addEventListener("click", (e) => {
      e.preventDefault();
      console.dir(e.target.form);
      this.getWord(e.target.form);
    });

    // Rendre le formulaire inactif
    form.inert = true;

    return form;
  }

  // Ajouter un event listener sur chaque input pour gérer le focus
  #handleFocus(input) {
    input.addEventListener("keyup", (e) => {
      if (this.#isAlphaNumericKey(e.key) || e.key === "ArrowRight") {
        e.target.nextSibling.focus();
      } else if (e.key === "ArrowLeft") {
        if (e.target.previousSibling != null) {
          e.target.previousSibling.focus();
        }
      }
    });
  }

  // Vérifier si un caractère est alphanumérique
  #isAlphaNumericKey(key) {
    return /^([\x30-\x39]|[\x61-\x7a])$/i.test(key);
  }

  // Vérifier si un mot ne contient que des caractères alphabétiques
  #isAlphabetic(word) {
    return /^[a-zA-Z]+$/.test(word);
  }

  // Changer l'état d'activation d'un formulaire
  switchState() {
    if (this.form.inert === true) {
      this.form.removeAttribute("inert");
      // Ajouter le focus sur le premier input
      this.form.firstChild.focus();
    } else {
      this.form.inert = true;
    }
  }

  // Récupérer les lettres entrées dans les input sous forme d'une chaine de caractères
  getWord(form) {
    const formData = new FormData(form);
    let word = "";
    for (let value of formData.values()) {
      word += value;
    }

    // Vérifier si le mot est valide
    if (this.#isAlphabetic(word) && word.length === this.game.tryNumber) {
      console.log("Il faut envoyer la requête");
      this.#verify(word);
    } else if (!this.#isAlphabetic(word)) {
      this.game.displayMessage("Ceci n'est pas un mot");
    } else if (word.length < this.game.tryNumber) {
      this.game.displayMessage("Le mot doit contenir 5 lettres");
    }
  }

  // Envoyer la tentative au serveur
  async #verify(word) {
    const url = "https://progweb-wwwordle-api.onrender.com/guess";
    const body = {
      guess: word,
    };
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(response);
    console.log(data);

    // Vérifier le statut de la requête
    if (data.status === "invalid") {
      this.game.displayMessage(data.message);
    } else if (data.status === "valid") {
      this.game.displayMessage(data.message);
      if (!this.#checkEachLetter(data.feedback)) {
        this.#guessedWrong();
      }
    }
  }

  // Vérifier chaque lettre pour lui attribuer la couleur correspondante et indiquer si le mot est trouvé ou non
  #checkEachLetter(feedback) {
    let index = 0;
    let guessedRight = true;
    for (let letter of feedback) {
      console.log(letter);

      switch (letter.status) {
        case "correct":
          this.form.children[index].classList.add("correct");
          break;
        case "present":
          this.form.children[index].classList.add("present");
          guessedRight = false;
          break;
        case "absent":
          this.form.children[index].classList.add("absent");
          guessedRight = false;
          break;
        default:
          break;
      }
      index++;
    }

    return guessedRight;
  }

  // Gérer l'état du jeu dans le cas où le mot n'est pas trouvé
  #guessedWrong() {
    if (this.game.currentTry < this.game.tryNumber) {
      // Dans le cas où il y a encore des tentatives disponibles
      this.game.nextTry();
    } else {
      // Dans le cas où il n'y a plus de tentative disponible
      this.game.displayMessage("Game over");
    }
  }
}

export default Answer;
