import React, { useState, useEffect } from "react";

function App() {
  const [dogs, setDogs] = useState([]);
  const [filterGoodDogs, setFilterGoodDogs] = useState(false);
  const [selectedDog, setSelectedDog] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, [])

  const fetchDogs = () => {
    fetch(" http://localhost:3001/pups")
      .then((response) => response.json())
      .then((data) => {
        setDogs(data);
      })
      .catch((error) => console.error("Error fetching dogs:", error));
  }

  const handleDogClick = (dog) => {
    setSelectedDog(dog);
  };

  const toggleGoodDogStatus = () => {
    if (selectedDog) {
      const updatedDogs = dogs.map((dog) => {
        if (dog.id === selectedDog.id) {
          // Toggle the isGoodDog status
          dog.isGoodDog = !dog.isGoodDog;
        }
        return dog;
      });

      // Update the state with the new isGoodDog status
      setDogs(updatedDogs);

      // Make a PATCH request to update the database
      fetch(`/pups/${selectedDog.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isGoodDog: selectedDog.isGoodDog }),
      });
    }
  };

  const filteredDogs = filterGoodDogs ? dogs.filter((dog) => dog.isGoodDog) : dogs;

  const toggleGoodDogFilter = () => {
    setFilterGoodDogs((prevFilterGoodDogs) => !prevFilterGoodDogs);
  };

  return (
    <div className="App">
      <div id="filter-div">
        <button id="good-dog-filter" onClick={toggleGoodDogFilter}>
          {filterGoodDogs ? "Filter good dogs: ON" : "Filter good dogs: OFF"}
        </button>
      </div>
      <div id="dog-bar">
        {filteredDogs.map((dog) => (
          <span
            key={dog.id}
            onClick={() => handleDogClick(dog)}
            style={{ cursor: "pointer" }}
          >
            {dog.name}
          </span>
        ))}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">
          {selectedDog && (
            <>
              <img src={selectedDog.image} alt={selectedDog.name} />
              <h2>{selectedDog.name}</h2>
              <button onClick={toggleGoodDogStatus}>
                {selectedDog.isGoodDog ? "Good Dog!" : "Bad Dog!"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
