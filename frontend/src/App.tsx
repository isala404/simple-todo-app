import { useEffect, useState, type FormEvent } from "react"
import "./App.css"

interface Todo {
  id: number
  title: string
  completed: boolean
}

const API = "/api/todos"

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState("")

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setTodos(data ?? []))
      .catch(console.error)
  }, [])

  async function addTodo(e: FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    })
    const todo = await res.json()
    setTodos((prev) => [...prev, todo])
    setTitle("")
  }

  async function toggleTodo(todo: Todo) {
    const res = await fetch(`${API}/${todo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...todo, completed: !todo.completed }),
    })
    const updated = await res.json()
    setTodos((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
  }

  async function deleteTodo(id: number) {
    await fetch(`${API}/${id}`, { method: "DELETE" })
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="app">
      <h1>Todos</h1>

      <form className="add-form" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            <label>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.title}</span>
            </label>
            <button className="delete" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="empty">No todos yet. Add one above.</p>}
    </div>
  )
}

export default App
