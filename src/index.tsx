/* eslint-disable react/prop-types */
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

interface SquareProps {
  onClick: () => any;
  value: string | null;
}
type Squares = (string | null)[];

const Square: React.FunctionComponent<SquareProps> = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
};

interface BoardProps {
  squares: Squares;
  onClick: (i: number) => void;
}

class Board extends React.Component<BoardProps> {
  renderSquare(i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {[0, 1, 2].map((i) => (
          <div key={i} className="board-row">
            {[0, 1, 2].map((j) => this.renderSquare(i * 3 + j))}
          </div>
        ))}
      </div>
    );
  }
}

const MoveList: React.FunctionComponent<{
  history: HistEntry[];
  historySortReversed: boolean;
  buttonClickFn: (move: number) => void;
  stepNumber: number | undefined;
}> = (props) => {
  const moves = props.history.map((step: HistEntry, move: number) => {
    const desc = move ? `Go to move #${move}` : "Go to game start";
    return (
      <li
        key={move}
        className={move === props.stepNumber ? "selected" : undefined}
      >
        <button onClick={() => props.buttonClickFn(move)}>
          <span className={move === props.stepNumber ? "selected" : undefined}>
            {desc}
          </span>
        </button>
        {step.moveLocation === null
          ? ""
          : ` - (${Math.floor(step.moveLocation / 3) + 1}, ${
              (step.moveLocation % 3) + 1
            })`}
      </li>
    );
  });

  if (props.historySortReversed) moves.reverse();

  return (
    <ol reversed={props.historySortReversed} className="moves">
      {moves}
    </ol>
  );
};

type HistEntry = {
  squares: Squares;
  moveLocation: number | null;
};

type GameState = {
  history: HistEntry[];
  stepNumber: number;
  xIsNext: boolean;
  historySortReversed: boolean;
};

class Game extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          moveLocation: null,
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      historySortReversed: false,
    };
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares,
          moveLocation: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleHistorySort() {
    this.setState({
      historySortReversed: !this.state.historySortReversed,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      if (this.state.stepNumber === 9) {
        status = "Draw!";
      } else {
        status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.toggleHistorySort()}>
              Reverse History Sort
            </button>
          </div>
          <MoveList
            history={this.state.history}
            historySortReversed={this.state.historySortReversed}
            buttonClickFn={(step: number) => this.jumpTo(step)}
            stepNumber={this.state.stepNumber}
          />
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: Squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
