import "./css/App.css";
import { useState } from "react";
import type { person } from "./types/person";

function Contact() {
  const [people, setPeople] = useState<person[]>([]);
  const [loading, setLoading] = useState(false);

  const getPeople = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/items");

      if (!response.ok) {
        throw new Error("Błąd serwera: " + response.status);
      }
      const data = await response.json();
      setPeople(data);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
      alert("Nie udało się pobrać danych 😢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Lista ludzi</h1>
      <button
        onClick={getPeople}
        disabled={loading}
        className={`px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Ładowanie..." : "Pobierz ludzi"}
      </button>

      <ul>
        {people.map((person, index) => (
          <li key={index}>
            {person.name || "(brak imienia)"} – {person.age || "(brak wieku)"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contact;
