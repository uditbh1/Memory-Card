import './App.css';
import Card from './components/Card';
import { useState, useEffect } from 'react';

function App() {
  const [pokemonData, setPokemonData] = useState([]);
  const [memory, setMemory] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const fetchPokemonData = async () => {
      // Step 1: Fetch the list of Pokémon
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=18&offset=0');
      const data = await response.json();

      // Step 2: Fetch detailed data for each Pokémon
      const detailedPokemonData = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return pokemonResponse.json();
        })
      );

      // Step 3: Shuffle the array of Pokémon
      const shuffledPokemonData = shuffleArray(detailedPokemonData);

      // Step 4: Update state with the shuffled data
      setPokemonData(shuffledPokemonData);
    };

    fetchPokemonData();
  }, []);

  const handleClick = (pokemonName) => {
    console.log("pokemon clicked ",pokemonName)
    if (memory.includes(pokemonName)) {
      // If the Pokémon was already clicked, reset the score and memory
      setBestScore(Math.max(score, bestScore));
      setScore(0);
      setMemory([]);
    } else {
      // If the Pokémon was not clicked before, update the score and memory
      setScore(score + 1);
      setBestScore(Math.max(score + 1, bestScore));
      setMemory([...memory, pokemonName]);
    }

    // Shuffle the Pokémon data to randomize the order
    const shuffledPokemonData = shuffleArray([...pokemonData]);
    setPokemonData(shuffledPokemonData);
  };

  return (
    <>
      <div className="header">
        <div className="header-left">
          <h1>Memory card game</h1>
          <h3>Get points by clicking on an image but don't click on any more than once!</h3>
        </div>
        <div className="header-right">
          <h3>Score: {score}</h3>
          <h3>Best Score: {bestScore}</h3>
        </div>
      </div>
      <div className="main-content">
        {pokemonData.map((pokemon) => (
          <Card
            key={pokemon.id}
            name={pokemon.name}
            img={pokemon.sprites.other['official-artwork'].front_default}
            onClick={() => handleClick(pokemon.name)} // Pass as a callback
          />
        ))}
      </div>
    </>
  );
}

export default App;