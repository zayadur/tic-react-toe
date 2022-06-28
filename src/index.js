import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Board extends React.Component {
    constructor(props) {
        super(props);
        /*
            declaring a shared state to allow to allow children to communicate
            setting initial values for Board's state
        */
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true
        };
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        /*
            splicing to prevent mutating the original array to allow...
            - implement features like undo/redo, keeping previous data intact
            - easily detect changes to data and determine when to re-render
        */
        if (calculateWinner(squares) || squares[i]) return; // stop function if win condition true or if square has a value
        squares[i] = this.state.xIsNext ? 'X' : 'O';    // true? 'X'
        this.setState({
            squares: squares,
            xIsNext: !this.state.xIsNext    // flip value of xIsNext every time a move is made
        }); // calling setState on a component updates child components as well
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Your move ' + (this.state.xIsNext ? 'X' : 'O') + ':';
        }

        return (
            <div>
                <div className="status">{status}</div>
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

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
