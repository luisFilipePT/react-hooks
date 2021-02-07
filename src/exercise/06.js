// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  RESOLVED: 'RESOLVED',
  REJECTED: 'REJECTED',
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: STATUS.IDLE,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return

    setState({
      ...state,
      status: STATUS.PENDING,
    })

    async function getData() {
      try {
        const pokemon = await fetchPokemon(pokemonName)
        setState({
          ...state,
          pokemon,
          status: STATUS.RESOLVED,
        })
      } catch (error) {
        setState({
          ...state,
          error,
          status: STATUS.REJECTED,
        })
      }
    }

    getData()
  }, [pokemonName])

  const {status, error, pokemon} = state

  if (status === STATUS.REJECTED) throw error

  if (status === STATUS.IDLE) return 'Submit a pokemon'

  if (status === STATUS.PENDING)
    return <PokemonInfoFallback name={pokemonName} />

  return <PokemonDataView pokemon={pokemon} />
}

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
