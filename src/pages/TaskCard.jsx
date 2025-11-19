import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { useTask } from "../context/TaskContext";

const priorityClass = (p) =>
  p === "high" ? "badge high" : p === "medium" ? "badge medium" : "badge low";

export default function TaskCard({ task, index }) {
  const { setEditingTask, setModalOpen, deleteTask } = useTask();

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-top">
            <h4>{task.title}</h4>
            <span className={priorityClass(task.priority)}>{task.priority}</span>
          </div>
          <p className="task-desc">{task.description}</p>
          <div className="task-meta">
            <small>Assigned: {task.assignedTo || "—"}</small>
            <small>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ""}</small>
          </div>
          <div className="task-actions">
            <button
              className="btn small ghost"
              onClick={() => {
                setEditingTask(task);
                setModalOpen(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn small danger"
              onClick={() => {
                if (confirm("Delete task?")) deleteTask(task._id);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}