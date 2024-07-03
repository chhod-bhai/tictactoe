import "./style.css";
type Player = "playerOne" | "playerTwo";

function globalCounter() {
  let counter = 0;
  return {
    get: () => counter++,
  };
}

const PLAYER_LABELS = {
  playerOne: "Player 1",
  playerTwo: "Player 2",
};

class TicTacToe {
  gameState: Map<Player, number[]>;
  maxContinousElements: Map<Player, number>;
  player: Player;
  moves: number;
  ended: boolean;
  gridSize: number;
  uniqueId: number;

  constructor(gridSize: number) {
    this.uniqueId = globalCounter().get();
    this.gridSize = gridSize;
    this.gameState = new Map<Player, number[]>([
      ["playerOne", new Array((gridSize + 1) * 2).fill(0)],
      ["playerTwo", new Array((gridSize + 1) * 2).fill(0)],
    ]);

    this.maxContinousElements = new Map<Player, number>([
      ["playerOne", 0],
      ["playerTwo", 0],
    ]);

    this.player = "playerOne";
    this.moves = 0;
    this.ended = false;
  }

  start(player?: Player) {
    if (player) {
      this.player = player;
    }
    this.constructGridOnDom();
  }

  constructGridOnDom() {
    const gameContainer = document.createElement("div");
    gameContainer.classList.add("game-container");

    const gameGrid = document.createElement("div");
    gameGrid.classList.add("grid");
    const gridWith = `${this.gridSize * 30 + this.gridSize * 4 - 4}px`;
    gameGrid.id = `grid#${this.uniqueId}`;
    // Styling grid
    gameGrid.style.width = gridWith;
    gameGrid.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

    // Add Click event listener
    gameGrid.addEventListener("mousedown", (e) => {
      if (e.target !== gameGrid && !this.ended) {
        const id = (e.target as HTMLElement).id;
        const [_, i, j] = id.split("-");
        this.makeMove(parseInt(i), parseInt(j));
      }
    });

    // Create Grid cells
    for (let i = 0; i < this.gridSize; i++) {
      for (let j = 0; j < this.gridSize; j++) {
        const childGridCell = document.createElement("div");
        childGridCell.classList.add("grid-cell");
        childGridCell.id = `${this.uniqueId}-${i}-${j}`;
        gameGrid.appendChild(childGridCell);
      }
    }
    gameContainer.appendChild(gameGrid);

    const gameStatus = document.createElement("div");
    gameStatus.id = `gamestatus#${this.uniqueId}`;
    gameStatus.style.display = "none";
    gameContainer.appendChild(gameStatus);

    document.body.appendChild(gameContainer);
  }

  switchPlayer() {
    this.player = this.player === "playerOne" ? "playerTwo" : "playerOne";
  }

  getPlayerCharacter() {
    return this.player === "playerOne" ? "X" : "O";
  }

  checkIfWon() {
    const maxCnt = this.maxContinousElements.get(this.player) || 0;
    return maxCnt === this.gridSize;
  }

  checkAndSetGameState() {
    const gameResultElement = document.getElementById(
      `gamestatus#${this.uniqueId}`
    );
    if (this.checkIfWon() && gameResultElement) {
      gameResultElement.innerText = `${PLAYER_LABELS[this.player]} won!`;
      gameResultElement.style.display = "block";
      this.ended = true;
    } else if (
      this.moves === this.gridSize * this.gridSize &&
      gameResultElement
    ) {
      gameResultElement.innerText = `It's a Draw!`;
      gameResultElement.style.display = "block";
      this.ended = true;
    } else return;
  }

  updateGameState(i: number, j: number) {
    let gs =
      this.gameState.get(this.player) ||
      new Array((this.gridSize + 1) * 2).fill(0);
    // handle row
    gs[i]++;
    let maxCntForPlayer = this.maxContinousElements.get(this.player) || 0;
    if (gs[i] > maxCntForPlayer) {
      maxCntForPlayer = Math.max(maxCntForPlayer, gs[i]);
    }
    // handle column
    gs[this.gridSize + j]++;
    maxCntForPlayer = Math.max(maxCntForPlayer, gs[this.gridSize + j]);
    // handle diagonal
    if (i === j) {
      gs[2 * this.gridSize]++;
      maxCntForPlayer = Math.max(maxCntForPlayer, gs[2 * this.gridSize]);
    }
    // handle reverse diagonal
    if (i + j === this.gridSize - 1) {
      gs[2 * this.gridSize + 1]++;
      maxCntForPlayer = Math.max(maxCntForPlayer, gs[2 * this.gridSize + 1]);
    }
    // refresh gamestate
    this.maxContinousElements.set(this.player, maxCntForPlayer);
    this.gameState.set(this.player, gs);
  }

  makeMove(i: number, j: number) {
    const cell = document.getElementById(`${this.uniqueId}-${i}-${j}`);
    if (cell && !cell.innerText) {
      this.moves++;
      cell.innerText = this.getPlayerCharacter();
      this.updateGameState(i, j);
      this.checkAndSetGameState();
      this.switchPlayer();
    }
  }
}

let tictactoe = new TicTacToe(3);
tictactoe.start();

// let tictactoe2 = new TicTacToe(3);
// tictactoe2.start();
