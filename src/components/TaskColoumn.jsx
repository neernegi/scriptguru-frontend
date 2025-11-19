import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "../pages/TaskCard";

export default function TaskColumn({ title, id, tasks }) {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="count">{tasks.length}</span>
      </div>
      <Droppable droppableId={id}>
        {(provided) => (
          <div className="task-list" ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((t, index) => (
              <TaskCard key={t._id} task={t} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}