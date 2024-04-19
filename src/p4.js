export class Game {
  constructor() {
    this.row = prompt('Entrez le nombre de lignes');
    this.col = prompt('Entrez le nombre de colonnes');
    if(this.row > 20){
      this.row = 20;
    }
    if(this.col > 20){
      this.col = 20;
    }
    this.player1 = 1;
    this.player2 = 2;
    this.player = this.player1;
    this.player1Points = 0;
    this.player2Points = 0;
    this.player1Color = prompt('Entrez la couleur du joueur 1 (red, yellow, green, orange)');
    this.player2Color = prompt('Entrez la couleur du joueur 2 (red, yellow, green, orange)');
    if(this.player1Color === this.player2Color){
      alert("Les joueurs ne peuvent pas avoir la meme couleur, le joueur 1 sera rouge et le joueur 2 sera jaune");
      this.player1Color = "red";
      this.player2Color = "yellow";
    }
    this.createGame();
    this.playerPoints = document.createElement("p");
    this.playerPoints.textContent = `Player 1 : ${this.player1Points} - ${this.player2Points} : Player 2`;
    document.body.appendChild(this.playerPoints);
    addEventListener("keydown", (event) => {
      if (event.key === "g") {
        this.resetGrid();
      } else if (event.key === "p") {
        this.resetPoints();
      } else if (event.key === "m") {
        this.cancelLastMoove();
      }
    });
    this.lastMoove;
  }
  createGame() {
    var container = document.createElement("div");
    container.style.display = "inline-block";
    container.style.textAlign = "center";
    container.style.backgroundColor = "blue";
    container.style.borderRadius = "15px";
    container.style.padding = "10px";
    document.body.appendChild(container);
    var table = document.createElement("table");
    container.appendChild(table);
    for (var y = 0; y < this.row; y++) {
      var tr = document.createElement("tr");
      table.appendChild(tr);
      for (var x = 0; x < this.col; x++) {
        var td = document.createElement("td");
        td.setAttribute("class", "col");
        td.addEventListener("click", (event) => {
          this.putColor(event.target);
        });
        td.setAttribute("data-y", y + 1);
        td.setAttribute("data-x", x + 1);
        td.setAttribute("data-player", "aucun");
        tr.appendChild(td);
      }
    }
    var classCol = document.getElementsByClassName("col");
    for (var i = 0; i < classCol.length; i++) {
      classCol[i].style.width = "50px";
      classCol[i].style.height = "50px";
      classCol[i].style.borderRadius = "50%";
      classCol[i].style.backgroundColor = "white";
      classCol[i].style.margin = "5px";
      classCol[i].style.display = "inline-block";
    }
    let turn = document.createElement("p");
    turn.textContent = "C'est au tour du joueur " + this.player;
    turn.setAttribute("id", "turn");
    document.body.appendChild(turn);
    let reset = document.createElement("p");
    reset.textContent = "(press g to reset grid)";
    document.body.appendChild(reset);
    let restart = document.createElement("p");
    restart.textContent = "(press p to reset points)";
    document.body.appendChild(restart);
    let cancel = document.createElement("p");
    cancel.textContent = "(press m to cancel last moove)";
    document.body.appendChild(cancel);
  }
  putColor(td) {
    let turn = document.getElementById("turn");
    let x = td.getAttribute('data-x');
    let xTop = document.querySelector(`[data-x="${x}"][data-y="${1}"]`);
    if (xTop.getAttribute("data-player") === "aucun") {
      if (this.player == 1) {
        for (let i = this.row; i > 0; i--) {
          let element = document.querySelector(`[data-x="${x}"][data-y="${i}"]`);
          if (element.style.backgroundColor === "white") {
            element.style.backgroundColor = this.player1Color;
            element.setAttribute("data-player", this.player1);
            this.checkVictory(element);
            this.checkEgality();
            this.switchPlayer();
            turn.textContent = "C'est au tour du joueur " + this.player;
            let y = element.getAttribute("data-y");
            this.saveMoove(x, y);
            break;
          }
        }
      } else {
        for (let i = this.row; i > 0; i--) {
          let element = document.querySelector(`[data-x="${x}"][data-y="${i}"]`);
          if (element.style.backgroundColor === "white") {
            element.style.backgroundColor = this.player2Color;
            element.setAttribute("data-player", this.player2);
            this.checkVictory(element);
            this.checkEgality();
            this.switchPlayer();
            turn.textContent = "C'est au tour du joueur " + this.player;
            let y = element.getAttribute("data-y");
            this.saveMoove(x, y);
            break;
          }
        }
      }
    }
  }
  checkVictory(element) {
    let x = element.getAttribute("data-x");
    let y = element.getAttribute("data-y");
    let color = element.style.backgroundColor;
    let points = 0;
    for (let i = y; i <= this.row; i++) {
      let elementTesting = document.querySelector(`[data-x="${x}"][data-y="${i}"]`);
      if (elementTesting.style.backgroundColor === color) {
        points = points + 1;
      } else {
        break;
      }
    }
    if (points === 4) {
      setTimeout(() => {
        this.switchPlayer();
        alert(`Le joueur "${this.player}" a gagné !`);
        this.countPoints();
        this.resetGrid();
        turn.textContent = "C'est au tour du joueur 1";
      }, 10);
    }
    let pointsLeft = 1;
    for (let i = 1; i <= this.col; i++) {
      let elementTestingLeft = document.querySelector(`[data-x="${x - i}"][data-y="${y}"]`);
      if (elementTestingLeft) {
        if (elementTestingLeft.style.backgroundColor === color) {
          pointsLeft = pointsLeft + 1;
        } else if (elementTestingLeft.style.backgroundColor !== color) {
          break;
        }
      }
    }
    let pointsRigth = 0;
    for (let i = 1; i <= this.col; i++) {
      let elementTestingRigth = document.querySelector(`[data-x="${parseInt(x) + i}"][data-y="${parseInt(y)}"]`);
      if (elementTestingRigth) {
        if (elementTestingRigth.style.backgroundColor === color) {
          pointsRigth = pointsRigth + 1;
        } else if (elementTestingRigth.style.backgroundColor !== color) {
          break;
        }
      }
    }
    let pointsLeftRigth = pointsLeft + pointsRigth;
    if (pointsLeftRigth === 4) {
      setTimeout(() => {
        this.switchPlayer();
        alert(`Le joueur "${this.player}" a gagné !`);
        this.countPoints();
        this.resetGrid();
        turn.textContent = "C'est au tour du joueur 1";
      }, 10);
    }
    pointsLeft = 1;
    for (let i = 1; i <= this.row; i++) {
      let elementTestingLeft = document.querySelector(`[data-x="${x - i}"][data-y="${y - i}"]`);
      if (elementTestingLeft) {
        if (elementTestingLeft.style.backgroundColor === color) {
          pointsLeft = pointsLeft + 1;
        } else if (elementTestingLeft.style.backgroundColor !== color) {
          break;
        }
      }
    }
    pointsRigth = 0;
    for (let i = 1; i <= this.row; i++) {
      let elementTestingRigth = document.querySelector(`[data-x="${parseInt(x) + i}"][data-y="${parseInt(y) + i}"]`);
      if (elementTestingRigth) {
        if (elementTestingRigth.style.backgroundColor === color) {
          pointsRigth = pointsRigth + 1;
        } else if (elementTestingRigth.style.backgroundColor !== color) {
          break;
        }
      }
    }
    pointsLeftRigth = pointsLeft + pointsRigth;
    if (pointsLeftRigth === 4) {
      setTimeout(() => {
        this.switchPlayer();
        alert(`Le joueur "${this.player}" a gagné !`);
        this.countPoints();
        this.resetGrid();
        turn.textContent = "C'est au tour du joueur 1";
      }, 10);
    }
    pointsLeft = 1;
    pointsRigth = 0;
    for (let i = 1; i <= this.row; i++) {
      let elementTestingLeft = document.querySelector(`[data-x="${x + i}"][data-y="${y - i}"]`);
      if (elementTestingLeft) {
        if (elementTestingLeft.style.backgroundColor === color) {
          pointsLeft = pointsLeft + 1;
        } else if (elementTestingLeft.style.backgroundColor !== color) {
          break;
        }
      }
    }
    pointsRigth = 0;
    for (let i = 1; i <= this.row; i++) {
      let elementTestingRigth = document.querySelector(`[data-x="${parseInt(x) - i}"][data-y="${parseInt(y) + i}"]`);
      if (elementTestingRigth) {
        if (elementTestingRigth.style.backgroundColor === color) {
          pointsRigth = pointsRigth + 1;
        } else if (elementTestingRigth.style.backgroundColor !== color) {
          break;
        }
      }
    }
    pointsLeftRigth = pointsLeft + pointsRigth;
    if (pointsLeftRigth === 4) {
      setTimeout(() => {
        this.switchPlayer();
        alert(`Le joueur "${this.player}" a gagné !`);
        this.countPoints();
        this.resetGrid();
        turn.textContent = "C'est au tour du joueur 1";
      }, 10);
    }
  }
  switchPlayer() {
    if (this.player == 1) {
      this.player = this.player2;
    } else {
      this.player = this.player1;
    }
  }
  resetGrid() {
    let allItems = document.getElementsByClassName("col");
    Array.from(allItems).forEach(element => {
      element.style.backgroundColor = "white";
      element.setAttribute("data-player", "aucun");
    });
    this.player = 1;
    turn.textContent = "C'est au tour du joueur 1";
  }
  resetPoints() {
    this.player1Points = 0;
    this.player2Points = 0;
    this.playerPoints.textContent = `Player 1 : ${this.player1Points} - ${this.player2Points} : Player 2`;
  }
  checkEgality() {
    let allItems = document.getElementsByClassName("col");
    let egality = true;
    Array.from(allItems).forEach(element => {
      if (element.getAttribute("data-player") === "aucun") {
        egality = false;
      }
    });
    if (egality === true) {
      setTimeout(() => {
        alert("Egalité !");
        this.resetGrid();
      }, 10);
    }
  }
  countPoints() {
    if (this.player === 1) {
      this.player1Points = this.player1Points + 1;
      this.playerPoints.textContent = `Player 1 : ${this.player1Points} - ${this.player2Points} : Player 2`;
    } else {
      this.player2Points = this.player2Points + 1;
      this.playerPoints.textContent = `Player 1 : ${this.player1Points} - ${this.player2Points} : Player 2`;
    }
  }
  saveMoove(x, y) {
    this.lastMoove = [x, y];
  }
  cancelLastMoove() {
    if (this.lastMoove !== null) {
      let lastMooveElement = document.querySelector(`[data-x="${parseInt(this.lastMoove[0])}"][data-y="${parseInt(this.lastMoove[1])}"]`);
      console.log(lastMooveElement);
      lastMooveElement.style.backgroundColor = "white";
      lastMooveElement.setAttribute("data-player", "aucun");
      this.switchPlayer();
      turn.textContent = "C'est au tour du joueur " + this.player;
      this.lastMoove = null;
    }
  }
}