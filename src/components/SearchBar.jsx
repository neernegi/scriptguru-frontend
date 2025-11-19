import React, { useEffect, useState, useRef } from "react";
import { useTask } from "../context/TaskContext";

export default function SearchBar() {
  const {
    search,
    setSearch,
    priorityFilter,
    setPriorityFilter,
    searchTasks,
    searchBoards,
    selectedBoard,
  } = useTask();

  const [localQ, setLocalQ] = useState(search || "");
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalQ(search);
  }, [search]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearch(localQ);
      if (localQ.trim() === "") {
        if (selectedBoard?._id) {
          await searchTasks({
            q: "",
            priority: priorityFilter,
            boardId: selectedBoard._id,
          });
        } else {
          await searchBoards("");
        }
      } else {
        if (selectedBoard?._id) {
          await searchTasks({
            q: localQ,
            priority: priorityFilter,
            boardId: selectedBoard._id,
          });
        } else {
          await searchBoards(localQ);
        }
      }
    }, 350);

    return () => clearTimeout(debounceRef.current);
  }, [localQ, priorityFilter, selectedBoard]);

  return (
    <div className="searchbar">
      <input
        placeholder="Search tasks or boards..."
        value={localQ}
        onChange={(e) => setLocalQ(e.target.value)}
      />
      <select
      className="selectPriority"
        value={priorityFilter}
        onChange={(e) => {
          setPriorityFilter(e.target.value);
        }}
      >
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
}
