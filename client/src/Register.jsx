import React from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { Navigate } from "react-router-dom";

export default function Register() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [redirect, setRedirect] = React.useState(false);

    const user = React.useContext(UserContext);

    function registerUser(e) {
        e.preventDefault();

        const data = {email, password};
        axios.post('http://todo-app.local/backend/register', data, {withCredentials: true})
            .then(response => {
                user.setEmail(response.data.email);
                setEmail('');
                setPassword('');
                setRedirect(true);
            });
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <React.Fragment>
            <form action="" onSubmit={e => registerUser(e)} className="flex flex-col my-4">
                <input className="mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Register</button>
            </form>
        </React.Fragment>
    );
}