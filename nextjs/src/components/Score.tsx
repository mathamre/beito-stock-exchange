"use client";

import React, { useState, FormEvent, ChangeEvent } from "react";

interface Player {
  id: number;
  name: string;
  drinks: number;
}

export default function Score() {
  // Hardcoded players
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Alice", drinks: 0 },
    { id: 2, name: "Bob", drinks: 0 },
    { id: 3, name: "Charlie", drinks: 0 },
    { id: 4, name: "Diana", drinks: 0 },
    { id: 5, name: "Eve", drinks: 0 },
    { id: 6, name: "Frank", drinks: 0 },
  ]);

  // Store the selected player as an ID (number)
  const [selectedPlayer, setSelectedPlayer] = useState<number>(players[0].id);

  // The "drinksToAdd" is a string in the input; we'll parse it to a number.
  const [drinksToAdd, setDrinksToAdd] = useState<string>("");

  // Handle the form submission
  const handleAddDrinks = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!drinksToAdd) return;

    const addedDrinks = parseInt(drinksToAdd, 10);
    if (isNaN(addedDrinks)) return;

    // Update the relevant player's drink count
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === selectedPlayer
          ? { ...player, drinks: player.drinks + addedDrinks }
          : player
      )
    );

    // Reset the input field
    setDrinksToAdd("");
  };

  // Handle changes to the Select (convert string to number for player ID)
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPlayer(parseInt(e.target.value, 10));
  };

  // Handle changes to the drinks input
  const handleDrinksChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDrinksToAdd(e.target.value);
  };

  return (
    <main style={{ padding: "1rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Drink Tracker</h1>

      <form onSubmit={handleAddDrinks} style={{ marginBottom: "1rem" }}>
        <label htmlFor="playerSelect" style={{ marginRight: "0.5rem" }}>
          Choose Player:
        </label>
        <select
          id="playerSelect"
          value={selectedPlayer}
          onChange={handleSelectChange}
          style={{ marginRight: "1rem" }}
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <label htmlFor="drinksInput" style={{ marginRight: "0.5rem" }}>
          Drinks to Add:
        </label>
        <input
          id="drinksInput"
          type="number"
          value={drinksToAdd}
          onChange={handleDrinksChange}
          style={{ marginRight: "1rem", width: "60px" }}
        />

        <button type="submit">Add</button>
      </form>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ padding: "0.5rem 0" }}>Player</th>
            <th style={{ padding: "0.5rem 0" }}>Drinks</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={{ padding: "0.5rem 0" }}>{player.name}</td>
              <td style={{ padding: "0.5rem 0" }}>{player.drinks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
