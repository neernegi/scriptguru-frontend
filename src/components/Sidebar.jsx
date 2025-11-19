import React, { useState } from "react";
import { useTask } from "../context/TaskContext";

export default function Sidebar() {
  const { boards, addBoard, selectedBoard, setSelectedBoard } = useTask();
  const [name, setName] = useState("");
  const [openCreate, setOpenCreate] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addBoard(name.trim());
    setName("");
    setOpenCreate(false);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="brand">Frontend Task</div>

        <div className="boards-header">
          <strong>Boards</strong>
          <button
            className="btn small"
            onClick={() => setOpenCreate((s) => !s)}
            aria-expanded={openCreate}
            aria-controls="create-board"
          >
            + New
          </button>
        </div>
      </div>

      <div className="boards-list">
        {openCreate && (
          <form id="create-board" onSubmit={submit} className="create-board">
            <input
              placeholder="Board name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <div>
              <button className="btn" type="submit">
                Create
              </button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setOpenCreate(false);
                  setName("");
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <ul>
          {boards.map((b) => (
            <li
              key={b._id}
              className={selectedBoard?._id === b._id ? "active" : ""}
              onClick={() => setSelectedBoard(b)}
            >
              {b.boardName}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
