import React from "react";
import axios from "axios";
import UserContext from "./UserContext";
import { Navigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginError, setLoginError] = React.useState(false);
    const [redirect, setRedirect] = React.useState(false);

    const user = React.useContext(UserContext);

    function loginUser(e) {
        e.preventDefault();

        const data = {email, password};
        axios.post('http://localhost:4000/login', data, {withCredentials: true})
            .then(response => {
                user.setEmail(response.data.email);
                setEmail('');
                setPassword('');
                setLoginError(false);
                setRedirect(true);
            })
            .catch(() => {
                setLoginError(true);
            });
    }

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <React.Fragment>
            <form action="" onSubmit={e => loginUser(e)} className="flex flex-col my-4">
                {loginError && (
                    <div className="text-red-500 mb-3 text-sm">Mail not recognized or wrong password.</div>
                )}
                <input className="mb-2" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </React.Fragment>
    );
}