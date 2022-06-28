import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

/* TODO
    - display location for each move as (col, row) in move history list
    - bold currently selected item in move list
    - rewrite board to use 2 loops to make squares
    - toggle to sort moves by ascending or descending order
    - when someone wins, highlight winning line
    - when draw, display draw
*/

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
        /*  history object will  have this shape...
            history = [
                // Before first move
                {
                    squares: [
                        null, null, null,
                        null, null, null,
                        null, null, null,
                    ]
                },
                // After first move
                {
                    squares: [
                        null, null, null,
                        null, 'X', null,
                        null, null, null,
                    ]
                },
                // After second move
                {
                    squares: [
                        null, null, null,
                        null, 'X', null,
                        null, null, 'O',
                    ]
                },
                // ...
            ]
        */
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1); // splice from 0 to stepNumber to hide "future history"
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{  // using concat() to avoid mutating original array
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    render() {
        const history = this.state.history;
        /*
            history[history.length - 1] shows most recent move
            history[this.state.stepNumber] shows moves up to a step
        */
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            // step is current history value
            // move is step index
            const desc = move ?
                'move ' + move :
                '(re)start';
            return (
                <li key={move}>
                    { /*
                        keys allow React to identify individual components and update their states
                            if key exists, move data,
                            if key exists previously but not anymore, destroy component,
                            if key doesn't exist previously and now exists, create component
                    */ }
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Your move ' + (this.state.xIsNext ? 'X' : 'O') + ':';
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
                    <ul>{moves}</ul>
                </div >
            </div >
        );
    }
}

class Board extends React.Component {
    // // Lifted to <Game />
    // constructor(props) {
    //     super(props);
    //     /*
    //         declaring a shared state to allow to allow children to communicate
    //         setting initial values for Board's state
    //     */
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true
    //     };
    // }

    // // Lifted to <Game />
    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     /*
    //         splicing to prevent mutating the original array to allow...
    //         - implement features like undo/redo, keeping previous data intact
    //         - easily detect changes to data and determine when to re-render
    //     */
    //     if (calculateWinner(squares) || squares[i]) return; // stop function if win condition true or if square has a value
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';    // true? 'X'
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext    // flip value of xIsNext every time a move is made
    //     }); // calling setState on a component updates child components as well
    // }

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />  // this.props... is this.state... if state is in this component
        );
    }   // TODO: read up on how props is working between components

    render() {
        // // Lifted to <Game />
        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Your move ' + (this.state.xIsNext ? 'X' : 'O') + ':';
        // }

        return (
            <div>
                {/* <div className="status">{status}</div> */}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

// // class version of Square component
// class Square extends React.Component {
//     // // adding constructor to initialize state
//     // constructor(props) {
//     //     super(props);   // access parent's props and methods
//     //     this.state = {
//     //         value: null,
//     //     }
//     // }

//     render() {
//         return (
//             <button
//                 className="square"
//                 onClick={() => {this.props.onClick()}}>
//                 {this.props.value}
//             </button>
//         );
//         /*  
//             we pass functions into events because React fires naked events automatically on render
//             run this.props.onClick() when onClick is fired
//             button text = this.props.value
//         */
//     }
// }

// function version of Square component
function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
    // define the lines that constitute a winning condition
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

    for (let i = 0; i < lines.length; i++) {    // for each line
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
