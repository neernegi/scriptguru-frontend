import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const TaskContext = createContext();

const API_BASE = "http://localhost:3000";

export const TaskProvider = ({ children }) => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [columns, setColumns] = useState({
    pending: [],
    "in-progress": [],
    done: [],
  });
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(`${API_BASE}/boards`);
      setBoards(res.data.boards ?? res.data.board ?? []);
      if (!selectedBoard && (res.data.boards ?? res.data.board ?? []).length) {
        setSelectedBoard((res.data.boards ?? res.data.board ?? [])[0]);
      }
    } catch (e) {
      console.error("fetchBoards", e);
    }
  };

  const fetchBoardTasks = async (boardId) => {
    if (!boardId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/boards/${boardId}/tasks`);
      const tasks = res.data.tasks ?? res.data.task ?? [];
      const grouped = { pending: [], "in-progress": [], done: [] };
      tasks.forEach((t) => {
        if (grouped[t.status]) grouped[t.status].push(t);
        else grouped.pending.push(t);
      });
      setColumns(grouped);
    } catch (e) {
      console.error("fetchBoardTasks", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard && selectedBoard._id) fetchBoardTasks(selectedBoard._id);
    else setColumns({ pending: [], "in-progress": [], done: [] });
  }, [selectedBoard]);

  const addBoard = async (boardName) => {
    try {
      const res = await axios.post(`${API_BASE}/boards`, { boardName });
      await fetchBoards();
      const newBoard = res.data.board;
      if (newBoard) setSelectedBoard(newBoard);
    } catch (e) {
      console.error("addBoard", e);
    }
  };

  const addTask = async (boardId, payload) => {
    try {
      const res = await axios.post(
        `${API_BASE}/boards/${boardId}/tasks`,
        payload
      );
      await fetchBoardTasks(boardId);
      return res.data.task;
    } catch (e) {
      console.error("addTask", e);
    }
  };

  const updateTask = async (taskId, payload) => {
    try {
      const res = await axios.put(`${API_BASE}/tasks/${taskId}`, payload);
      await fetchBoardTasks(selectedBoard._id);
      return res.data.task;
    } catch (e) {
      console.error("updateTask", e);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_BASE}/tasks/${taskId}`);
      await fetchBoardTasks(selectedBoard._id);
    } catch (e) {
      console.error("deleteTask", e);
    }
  };

  const moveTaskLocal = async (source, destination) => {
    if (!destination) return;
    const sourceCol = Array.from(columns[source.droppableId]);
    const destCol = Array.from(columns[destination.droppableId]);
    const [moved] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, moved);

    const newCols = {
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    };
    setColumns(newCols);

    try {
      await updateTask(moved._id, { status: destination.droppableId });
    } catch (e) {
      console.error("moveTaskLocal persist fail", e);
      fetchBoardTasks(selectedBoard._id);
    }
  };

  const filteredColumns = () => {
    const f = {};
    Object.keys(columns).forEach((k) => {
      f[k] = columns[k].filter((t) => {
        if (search) {
          const s = search.toLowerCase();
          if (
            !(
              t.title?.toLowerCase().includes(s) ||
              t.description?.toLowerCase().includes(s)
            )
          )
            return false;
        }
        if (priorityFilter && t.priority !== priorityFilter) return false;
        return true;
      });
    });
    return f;
  };
  const searchTasks = async ({
    q = "",
    priority = "",
    status = "",
    boardId = "",
  } = {}) => {
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (priority) params.append("priority", priority);
      if (status) params.append("status", status);
      if (boardId) params.append("boardId", boardId);
      const res = await axios.get(
        `${API_BASE}/searchTask?${params.toString()}`
      );
      const tasks = res.data.tasks ?? [];
      const grouped = { pending: [], "in-progress": [], done: [] };
      tasks.forEach((t) => {
        const statusKey = t.status || "pending";
        if (grouped[statusKey]) grouped[statusKey].push(t);
        else grouped.pending.push(t);
      });
      setColumns(grouped);
      return { tasks, total: res.data.total ?? tasks.length };
    } catch (e) {
      console.error("searchTasksBackend", e);
      return { tasks: [], total: 0 };
    }
  };

  const searchBoards = async (q = "") => {
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      const res = await axios.get(`${API_BASE}/searchBoard?${params.toString()}`);
      const found = res.data.boards ?? [];
      setBoards(found);
      if (found.length) setSelectedBoard(found[0]);
      return found;
    } catch (e) {
      console.error("searchBoardsBackend", e);
      return [];
    }
  };
  return (
    <TaskContext.Provider
      value={{
        boards,
        addBoard,
        selectedBoard,
        setSelectedBoard,
        columns,
        setColumns,
        fetchBoardTasks,
        addTask,
        updateTask,
        deleteTask,
        moveTaskLocal,
        filteredColumns,
        search,
        setSearch,
        priorityFilter,
        setPriorityFilter,
        modalOpen,
        setModalOpen,
        editingTask,
        setEditingTask,
        loading,
        searchBoards,
        searchTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => useContext(TaskContext);
