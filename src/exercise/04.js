// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({squares, selectSquare}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

const INITIAL_SQUARES_STATE = Array(9).fill(null)

function Game() {
  const [squares, setSquares] = useLocalStorageState(
    'squares',
    INITIAL_SQUARES_STATE,
  )
  const [history, setHistory] = useLocalStorageState('history', [])

  const currentStep = calculateCurrentStep(squares)
  const nextValue = calculateNextValue(squares)
  const winner = calculateWinner(squares)
  const status = calculateStatus(winner, squares, nextValue)

  React.useEffect(() => {
    if (history.length <= squares.filter(square => square !== null).length) {
      setHistory([...history, [currentStep, squares]])
    }
  }, [squares])

  function selectSquare(square) {
    if (winner || squares[square]) {
      return
    }

    let squaresCopy = [...squares]
    squaresCopy[square] = nextValue
    setSquares(squaresCopy)
  }

  function restart() {
    setSquares(INITIAL_SQUARES_STATE)
    setHistory([])
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map(elem => (
            <li key={elem[0]}>
              <button
                onClick={() => setSquares(elem[1])}
                disabled={elem[0] === currentStep}
              >
                {elem[0] === 0 ? 'Go to game start' : `Go to move#${elem[0]}`}
                {elem[0] === currentStep && '(current)'}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function calculateCurrentStep(squares) {
  return squares.filter(square => square !== null).length
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  const xSquaresCount = squares.filter(r => r === 'X').length
  const oSquaresCount = squares.filter(r => r === 'O').length
  return oSquaresCount === xSquaresCount ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
