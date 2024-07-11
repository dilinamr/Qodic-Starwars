import React, { useState, useEffect } from "react";
import axios from "axios";

import Modal from "react-modal";
import { format } from "date-fns";

Modal.setAppElement("#root");

const CharacterList = ({ characters }) => {
  const [speciesColors, setSpeciesColors] = useState({});
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [homeworld, setHomeworld] = useState(null);

  useEffect(() => {
    const fetchSpeciesColors = async () => {
      const colors = {};
      for (const character of characters) {
        const speciesUrls = character.species;
        if (speciesUrls.length > 0) {
          try {
            const response = await axios.get(speciesUrls[0]);
            colors[character.name] = getColor(response.data.name);
          } catch (error) {
            console.error(`Error fetching species for ${character.name}`);
          }
        } else {
          colors[character.name] = "#ccc";
        }
      }
      setSpeciesColors(colors);
      console.log(colors);
    };

    fetchSpeciesColors();
  }, [characters]);

  const getColor = (species) => {
    switch (species.toLowerCase()) {
      case "human":
        return "#FFD700";
      case "droid":
        return "#00CED1";
      default:
        return "#ccc";
    }
  };

  const openModal = async (character) => {
    setSelectedCharacter(character);
    setIsOpen(true);

    try {
      const response = await axios.get(character.homeworld);
      setHomeworld(response.data);
    } catch (error) {
      console.error("Error fetching homeworld data");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCharacter(null);
    setHomeworld(null);
  };

  return (
    <div className="character-list">
      {characters.map((character) => (
        <div
          key={character.name}
          className="character-card"
          style={{ backgroundColor: speciesColors[character.name] || "#ccc" }}
          onClick={() => openModal(character)}
        >
          <img
            src={`https://picsum.photos/200?random=${character.name}`}
            alt={character.name}
          />
          <h3>{character.name}</h3>
        </div>
      ))}
      {selectedCharacter && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Character Details"
        >
          <div className="modal-header">
            <h2>{selectedCharacter.name}</h2>
          </div>
          <div className="modal-body">
            <p>Height: {(selectedCharacter.height / 100).toFixed(2)} meters</p>
            <p>Mass: {selectedCharacter.mass} kg</p>
            <p>
              Date Added:{" "}
              {format(new Date(selectedCharacter.created), "dd-MM-yyyy")}
            </p>
            <p>Number of Films: {selectedCharacter.films.length}</p>
            <p>Birth Year: {selectedCharacter.birth_year}</p>
            {homeworld && (
              <>
                <h3>Homeworld</h3>
                <p>Name: {homeworld.name}</p>
                <p>Terrain: {homeworld.terrain}</p>
                <p>Climate: {homeworld.climate}</p>
                <p>Population: {homeworld.population}</p>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button onClick={closeModal}>Close</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CharacterList;
