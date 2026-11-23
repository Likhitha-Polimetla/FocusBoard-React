import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Settings,
  Search,
  Plus,
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Clock3,
  CircleCheck,
  ListTodo,
  Pencil,
  Trash2,
  X,
  Menu,
  Target,
  Sparkles,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Complete project proposal",
    description: "Finalize the proposal and share it with the team.",
    category: "Work",
    status: "In progress",
    priority: "High",
    dueDate: "2026-11-24",
  },
  {
    id: 2,
    title: "Review UI design",
    description: "Review the dashboard screens and provide feedback.",
    category: "Design",
    status: "To do",
    priority: "Medium",
    dueDate: "2026-11-25",
  },
  {
    id: 3,
    title: "Prepare presentation",
    description: "Create slides for the upcoming project meeting.",
    category: "Work",
    status: "Completed",
    priority: "High",
    dueDate: "2026-11-21",
  },
  {
    id: 4,
    title: "Read React documentation",
    description: "Learn more about hooks and state management.",
    category: "Learning",
    status: "In progress",
    priority: "Medium",
    dueDate: "2026-11-27",
  },
  {
    id: 5,
    title: "Update portfolio",
    description: "Add recent projects and improve the portfolio layout.",
    category: "Personal",
    status: "To do",
    priority: "Low",
    dueDate: "2026-11-29",
  },
  {
    id: 6,
    title: "Organize weekly schedule",
    description: "Plan priorities and tasks for the coming week.",
    category: "Personal",
    status: "Completed",
    priority: "Low",
    dueDate: "2026-11-22",
  },
];

const notes = [
  {
    title: "Focus on one thing at a time",
    description:
      "Give your full attention to the task in front of you. Small focused steps create meaningful progress.",
    tag: "PRODUCTIVITY",
    number: "01",
  },
  {
    title: "Make progress, not perfection",
    description:
      "Every completed task is a step forward. Keep moving, learn from mistakes, and celebrate progress.",
    tag: "MINDSET",
    number: "02",
  },
  {
    title: "Plan your day with intention",
    description:
      "Choose your most important priorities and make space for the work that matters most.",
    tag: "DAILY HABITS",
    number: "03",
  },
];

const emptyForm = {
  title: "",
  description: "",
  category: "Work",
  status: "To do",
  priority: "Medium",
  dueDate: "",
};

function formatDate(date) {
  if (!date) return "No date";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("focusboard-tasks");
      return saved ? JSON.parse(saved) : initialTasks;
    } catch {
      return initialTasks;
    }
  });

  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [noteIndex, setNoteIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("focusboard-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const total = tasks.length;
  const completed = tasks.filter((task) => task.status === "Completed").length;
  const inProgress = tasks.filter(
    (task) => task.status === "In progress"
  ).length;
  const completion = total ? Math.round((completed / total) * 100) : 0;

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        activeStatus === "All" || task.status === activeStatus;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, activeStatus, priorityFilter]);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEditModal(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      category: task.category,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
    });
    setModalOpen(true);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) return;

    if (editingId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? { ...task, ...form, title: form.title.trim() }
            : task
        )
      );
    } else {
      setTasks((current) => [
        {
          id: Date.now(),
          ...form,
          title: form.title.trim(),
        },
        ...current,
      ]);
    }

    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function deleteTask(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmed) {
      setTasks((current) => current.filter((task) => task.id !== id));
    }
  }

  function updateStatus(id, status) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  const currentNote = notes[noteIndex];

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Target size={22} />
          </div>
          <span>FocusBoard</span>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={19} />
          </button>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="nav-list">
          <a className="nav-link active" href="#dashboard">
            <LayoutDashboard size={19} />
            <span>Dashboard</span>
          </a>
          <a className="nav-link" href="#tasks">
            <CheckSquare size={19} />
            <span>My Tasks</span>
            <span className="nav-count">{total}</span>
          </a>
          <a className="nav-link" href="#tasks">
            <CalendarDays size={19} />
            <span>Calendar</span>
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="workspace-label">PREFERENCES</div>
          <a className="nav-link" href="#settings">
            <Settings size={19} />
            <span>Settings</span>
          </a>

          <div className="upgrade-card">
            <div className="upgrade-icon">
              <Sparkles size={18} />
            </div>
            <strong>Stay focused!</strong>
            <p>Small steps lead to big achievements.</p>
            <div className="upgrade-progress">
              <span style={{ width: `${completion}%` }} />
            </div>
            <small>{completion}% of tasks completed</small>
          </div>

          <div className="profile">
            <div className="avatar">LP</div>
            <div className="profile-info">
              <strong>My Workspace</strong>
              <span>Personal account</span>
            </div>
            <MoreHorizontal size={20} />
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>
            <div>
              <div className="breadcrumb">Workspace / Dashboard</div>
              <h1>My Dashboard</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <label className="search-box">
              <Search size={18} />
              <input
                aria-label="Search tasks by title"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <kbd>⌘ K</kbd>
            </label>
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="top-avatar">LP</div>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <div className="eyebrow">YOUR PRODUCTIVITY SPACE</div>
            <h2>Good morning! <span>☀️</span></h2>
            <p>Stay organized, stay focused, and make today count.</p>
          </div>
          <button className="primary-button" onClick={openCreateModal}>
            <Plus size={18} />
            Create new task
          </button>
        </section>

        <section className="stats-grid" aria-label="Task statistics">
          <StatCard
            label="Total Tasks"
            value={total}
            icon={<ListTodo size={20} />}
            color="purple"
            note="Tasks in your workspace"
          />
          <StatCard
            label="In Progress"
            value={inProgress}
            icon={<Clock3 size={20} />}
            color="orange"
            note="Currently being worked on"
          />
          <StatCard
            label="Completed"
            value={completed}
            icon={<CircleCheck size={20} />}
            color="green"
            note="Successfully finished"
          />
          <div className="stat-card completion-card">
            <div className="stat-top">
              <span>Completion Rate</span>
              <div className="stat-icon blue">
                <Target size={20} />
              </div>
            </div>
            <div className="stat-value">{completion}%</div>
            <div className="progress-track">
              <span style={{ width: `${completion}%` }} />
            </div>
            <div className="stat-note">Overall task progress</div>
          </div>
        </section>

        <section className="content-grid">
          <div className="tasks-panel panel" id="tasks">
            <div className="panel-heading">
              <div>
                <div className="section-kicker">STAY ON TRACK</div>
                <h3>My Tasks</h3>
                <p>Manage your tasks and keep moving forward.</p>
              </div>
              <button className="text-button" onClick={openCreateModal}>
                <Plus size={16} /> Add task
              </button>
            </div>

            <div className="task-toolbar">
              <div className="tabs" role="tablist" aria-label="Filter by status">
                {["All", "To do", "In progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    role="tab"
                    aria-selected={activeStatus === status}
                    className={activeStatus === status ? "tab active-tab" : "tab"}
                    onClick={() => setActiveStatus(status)}
                  >
                    {status}
                    {status === "All" && <span>{total}</span>}
                  </button>
                ))}
              </div>

              <select
                className="filter-select"
                aria-label="Filter by priority"
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All priorities</option>
                <option value="High">High priority</option>
                <option value="Medium">Medium priority</option>
                <option value="Low">Low priority</option>
              </select>
            </div>

            <div className="task-list">
              {filteredTasks.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <CheckSquare size={25} />
                  </div>
                  <strong>No tasks found</strong>
                  <p>Try changing your search or filters, or create a task.</p>
                  <button className="primary-button" onClick={openCreateModal}>
                    <Plus size={17} /> Create task
                  </button>
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <article className="task-row" key={task.id}>
                    <div className={`task-check ${task.status === "Completed" ? "checked" : ""}`}>
                      {task.status === "Completed" && <CircleCheck size={17} />}
                    </div>

                    <div className="task-main">
                      <h4 className={task.status === "Completed" ? "task-done" : ""}>
                        {task.title}
                      </h4>
                      <p>{task.description}</p>
                      <div className="task-meta">
                        <span className="category-tag">{task.category}</span>
                        <span className="due-date">
                          <CalendarDays size={13} />
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="task-controls">
                      <span className={`priority priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                      <select
                        className={`status-select status-${task.status.toLowerCase().replace(" ", "-")}`}
                        aria-label={`Change status for ${task.title}`}
                        value={task.status}
                        onChange={(event) => updateStatus(task.id, event.target.value)}
                      >
                        <option>To do</option>
                        <option>In progress</option>
                        <option>Completed</option>
                      </select>
                      <div className="task-actions">
                        <button
                          aria-label={`Edit ${task.title}`}
                          title="Edit task"
                          onClick={() => openEditModal(task)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          aria-label={`Delete ${task.title}`}
                          title="Delete task"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="task-footer">
              Showing {filteredTasks.length} of {total} tasks
            </div>
          </div>

          <aside className="right-column">
            <div className="notes-panel panel">
              <div className="panel-heading compact-heading">
                <div>
                  <div className="section-kicker">A LITTLE INSPIRATION</div>
                  <h3>Focus Notes</h3>
                </div>
                <div className="note-arrows">
                  <button
                    aria-label="Previous note"
                    onClick={() =>
                      setNoteIndex((index) => (index - 1 + notes.length) % notes.length)
                    }
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    aria-label="Next note"
                    onClick={() =>
                      setNoteIndex((index) => (index + 1) % notes.length)
                    }
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="note-card">
                <div className="note-decoration">✳</div>
                <div className="note-tag">{currentNote.tag}</div>
                <div className="note-number">{currentNote.number}</div>
                <h4>{currentNote.title}</h4>
                <p>{currentNote.description}</p>
                <div className="note-indicators">
                  {notes.map((note, index) => (
                    <button
                      key={note.number}
                      aria-label={`Show note ${index + 1}`}
                      aria-current={noteIndex === index}
                      className={noteIndex === index ? "indicator active-indicator" : "indicator"}
                      onClick={() => setNoteIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="progress-panel panel">
              <div className="section-kicker">YOUR OVERVIEW</div>
              <h3>Task Progress</h3>
              <div className="progress-circle-wrap">
                <div
                  className="progress-circle"
                  style={{
                    background: `conic-gradient(#7564e8 ${completion * 3.6}deg, #eeeef5 0deg)`,
                  }}
                >
                  <div className="progress-circle-inner">
                    <strong>{completion}%</strong>
                    <span>Completed</span>
                  </div>
                </div>
              </div>
              <div className="progress-legend">
                <span><i className="legend-dot purple-dot" /> Completed</span>
                <strong>{completed}</strong>
              </div>
              <div className="progress-legend">
                <span><i className="legend-dot orange-dot" /> In progress</span>
                <strong>{inProgress}</strong>
              </div>
              <div className="progress-legend">
                <span><i className="legend-dot grey-dot" /> To do</span>
                <strong>{tasks.filter((task) => task.status === "To do").length}</strong>
              </div>
            </div>
          </aside>
        </section>

        <footer className="footer">
          <span>© 2026 FocusBoard. Make every day count.</span>
          <span>Designed for focus <span className="heart">♥</span></span>
        </footer>
      </main>

      {modalOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModalOpen(false);
          }}
        >
          <section
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-heading">
              <div>
                <div className="section-kicker">
                  {editingId ? "UPDATE YOUR TASK" : "MAKE IT HAPPEN"}
                </div>
                <h2 id="modal-title">
                  {editingId ? "Edit task" : "Create a new task"}
                </h2>
                <p>Fill in the details below to organize your work.</p>
              </div>
              <button
                className="modal-close"
                aria-label="Close dialog"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="form-field">
                Task title <span>*</span>
                <input
                  autoFocus
                  required
                  maxLength={100}
                  placeholder="e.g. Complete project proposal"
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                />
              </label>

              <label className="form-field">
                Description
                <textarea
                  rows="3"
                  maxLength={300}
                  placeholder="Add a few details about this task..."
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                />
              </label>

              <div className="form-row">
                <label className="form-field">
                  Category
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm({ ...form, category: event.target.value })
                    }
                  >
                    <option>Work</option>
                    <option>Design</option>
                    <option>Learning</option>
                    <option>Personal</option>
                    <option>Health</option>
                  </select>
                </label>

                <label className="form-field">
                  Priority
                  <select
                    value={form.priority}
                    onChange={(event) =>
                      setForm({ ...form, priority: event.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="form-row">
                <label className="form-field">
                  Status
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm({ ...form, status: event.target.value })
                    }
                  >
                    <option>To do</option>
                    <option>In progress</option>
                    <option>Completed</option>
                  </select>
                </label>

                <label className="form-field">
                  Due date
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) =>
                      setForm({ ...form, dueDate: event.target.value })
                    }
                  />
                </label>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  <Plus size={17} />
                  {editingId ? "Save changes" : "Create task"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color, note }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <div className={`stat-icon ${color}`}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </div>
  );
}

export default App;