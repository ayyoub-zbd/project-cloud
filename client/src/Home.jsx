import React from "react";
import UserContext from "./UserContext";
import axios from "axios";

export default function Home() {
    const userInfo = React.useContext(UserContext);
    const [inputVal, setInputVal] = React.useState('');
    const [todos, setTodos] = React.useState([]);

    React.useEffect(() => {
        axios.get('http://localhost:4000/todos', {withCredentials: true})
            .then(response => {
                setTodos(response.data);
            });
    }, []);

    if (!userInfo.email) {
        return (
            <React.Fragment>
                You need to be logged to see this page.
            </React.Fragment>
        )
    }

    function addTodo(e) {
        e.preventDefault();

        axios.put('http://localhost:4000/todos', {text: inputVal}, {withCredentials: true})
            .then(response => {
                setTodos([...todos, response.data]);
                setInputVal('');
            });

    }

    function updateTodo(todo) {
        const data = { id: todo._id, done: !todo.done };
        axios.post('http://localhost:4000/todos', data, {withCredentials: true})
            .then(() => {
                const newTodos = todos.map(t => {
                    if (t._id === todo._id) {
                        t.done = !t.done;
                    }
                    return t;
                })
                setTodos([...newTodos]);
            });
        
    }

    return (
        <React.Fragment>
            <form onSubmit={e => {addTodo(e)}}>
                <input placeholder="Add a new task" value={inputVal} onChange={e => setInputVal(e.target.value)} />
            </form>

            <ul className="text-left w-1/2 mx-auto mt-4">
                {todos.map(todo => (
                    <li>
                        <input className="mr-2" type="checkbox" checked={todo.done} onClick={() => updateTodo(todo)} />
                        {todo.done ? <del>{todo.text}</del> : todo.text}
                    </li>
                ))}
            </ul>
        </React.Fragment>
    )
}