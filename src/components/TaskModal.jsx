import React, { useState, useEffect } from "react";
import { useTask } from "../context/TaskContext";

export default function TaskModal({ board }) {
  const {
    modalOpen,
    setModalOpen,
    addTask,
    editingTask,
    setEditingTask,
    updateTask,
  } = useTask();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
      setAssignedTo(editingTask.assignedTo || "");
      setPriority(editingTask.priority || "low");
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setPriority("low");
      setDueDate("");
    }
  }, [editingTask]);

  const close = () => {
    setModalOpen(false);
    setEditingTask(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { title, description, assignedTo, priority, dueDate };
    if (editingTask) {
      await updateTask(editingTask._id, payload);
    } else {
      await addTask(board._id, { ...payload, status: "pending" });
    }
    close();
  };

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{editingTask ? "Edit Task" : `Create Task on "${board.boardName}"`}</h3>
        <form onSubmit={submit} className="modal-form">
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Assigned To
            <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
          </label>
          <label className="row">
            Priority
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            Due
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>

          <div className="modal-actions">
            <button className="btn" type="submit">
              {editingTask ? "Update" : "Create"}
            </button>
            <button type="button" className="btn ghost" onClick={close}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}