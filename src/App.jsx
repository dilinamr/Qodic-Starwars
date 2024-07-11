import React, { useState, useEffect } from "react";
import axios from "axios";
import CharacterList from "./components/CharacterList";
import Pagination from "./components/Pagination";
import "./App.css";
import Loading from "./components/Loading";

const App = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    homeworld: "",
    film: "",
    species: "",
  });
  //Data fetching
  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `https://swapi.dev/api/people/?page=${page}`
        );
        setCharacters(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      } catch (error) {
        setError("Error fetching data. Please try again later.");
      }

      setLoading(false);
    };

    fetchCharacters();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesHomeworld = filters.homeworld
      ? character.homeworld
          .toLowerCase()
          .includes(filters.homeworld.toLowerCase())
      : true;
    const matchesFilm = filters.film
      ? character.films.some((film) =>
          film.toLowerCase().includes(filters.film.toLowerCase())
        )
      : true;
    const matchesSpecies = filters.species
      ? character.species.some((species) =>
          species.toLowerCase().includes(filters.species.toLowerCase())
        )
      : true;

    return matchesSearch && matchesHomeworld && matchesFilm && matchesSpecies;
  });

  return (
    <div className="App">
      <h1>Star Wars Characters</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
      />
      <div className="filter-container">
        <input
          type="text"
          name="homeworld"
          placeholder="Filter by homeworld"
          value={filters.homeworld}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="film"
          placeholder="Filter by film"
          value={filters.film}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="species"
          placeholder="Filter by species"
          value={filters.species}
          onChange={handleFilterChange}
        />
      </div>
      {loading && <Loading />}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <>
          <CharacterList characters={filteredCharacters} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default App;
