import React from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useTask } from "../context/TaskContext.jsx";
import TaskModal from "../components/TaskModal.jsx";
import TaskColumn from "../components/TaskColoumn.jsx";

export default function BoardView({ board }) {
  const { moveTaskLocal, filteredColumns, setModalOpen, modalOpen, loading } =
    useTask();
  const cols = filteredColumns();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    moveTaskLocal(result.source, result.destination);
  };

  return (
    <div className="board-view">
      <div className="board-header">
        <h2>{board.boardName}</h2>
        <div>
          <button className="btn" onClick={() => setModalOpen(true)}>
            + Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="columns">
          <TaskColumn title="Pending" id="pending" tasks={cols.pending} />
          <TaskColumn
            title="In Progress"
            id="in-progress"
            tasks={cols["in-progress"]}
          />
          <TaskColumn title="Done" id="done" tasks={cols.done} />
        </div>
      </DragDropContext>

      {modalOpen && <TaskModal board={board} />}
      {loading && <div className="loading">Loading tasks...</div>}
    </div>
  );
}
