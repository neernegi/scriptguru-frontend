import React from "react";
import SearchBar from "./components/SearchBar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useTask } from "./context/TaskContext.jsx";
import BoardView from "./pages/BoardView.jsx";

export default function App() {
  const { selectedBoard, setSelectedBoard } = useTask();

  return (
    <div className="app">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <SearchBar />
        </header>
        {selectedBoard ? (
          <BoardView board={selectedBoard} />
        ) : (
          <div className="empty">
            <h2>Select a board or create a new one</h2>
          </div>
        )}
      </main>
    </div>
  );
}
