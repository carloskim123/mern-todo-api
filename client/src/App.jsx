import { useState, useEffect } from "react";
import "./App.css";

const APIBASE = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    GetTodos();
  }, []);

  const GetTodos = async () => {
    const response = await fetch(APIBASE + "/todos");
    const data = await response.json();
    setTodos(data);
  };

  const completeTodo = async (id) => {
    const response = await fetch(APIBASE + "/todo/complete/" + id);
    const data = await response.json();

    setTodos((todos) =>
      todos.map((todo) => {
        if (todo._id === data._id) {
          todo.complete = data.complete;
        }

        return todo;
      })
    );
  };

  const deleteTodo = async (id) => {
    const response = await fetch(APIBASE + "/todo/delete/" + id, {
      method: "DELETE",
    });

    setTodos((todos) => todos.filter((todo) => todo?._id !== id));
  };

  const addTodo = async () => {
    const response = await fetch(APIBASE + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
      }),
    });

    const data = await response.json();

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  };

  return (
    <div className="App">
      <h2>Welcome Carlos</h2>
      <div className="todos">
        {todos.map((todo) => (
          <div
            className={"todo " + (todo?.complete ? "is-complete" : "")}
            key={todo?._id}
            onClick={() => completeTodo(todo?._id)}
          >
            <div className="checkbox"></div>
            <div className="text">{todo?.text}</div>
            <div className="delete-todo" onClick={() => deleteTodo(todo?._id)}>
              x
            </div>
          </div>
        ))}
      </div>

      <button className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </button>
      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            x
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
