import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import User from "./models/User.js";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import Todo from "./models/Todo.js";

const secret = 'supersecret'

mongoose.set('strictQuery', false)

await mongoose.connect('mongodb://mongodb:27017/auth-todo');
const db = mongoose.connection;
db.on('error', console.log);

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(cors({
    credentials: true,
    origin: 'http://todo-app.local:8080'
}));

// ~~~~ Connection Test
app.get('/', (req, res) => {
    res.send('Server is connected!');
});

app.get('/user', (req, res) => {
    if (req.cookies.token) {
        const payload = jwt.verify(req.cookies.token, secret);
        User.findById(payload.id)
            .then(userInfo => {
                res.json({id: userInfo._id, email: userInfo.email});
            });
    }
});

app.post('/register', (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({ email, password: hashedPassword });
    
    user.save().then(userInfo => {
        jwt.sign(
            { id: userInfo._id, email: userInfo.email },
            secret,
            (err, token) => {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                }
                else {
                    res.cookie('token', token).json({ id: userInfo._id, email: userInfo.email });
                }
            }
        );
    });
});

app.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email})
        .then(userInfo => {
            const passwordIsOk = bcrypt.compareSync(password, userInfo.password);
            if (passwordIsOk) {
                jwt.sign(
                    { id: userInfo._id, email },
                    secret,
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        }
                        else {
                            res.cookie('token', token).json({ id: userInfo._id, email: userInfo.email });
                        }
                    }
                );
            }
            else {
                res.sendStatus(401);
            }
        });
});

app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
});

app.get('/todos', (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    Todo.where({ user: new mongoose.Types.ObjectId(payload.id) })
        .find((err, todos) => {
            res.json(todos);
        });
});

app.put('/todos', (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    const todo = new Todo({
        text: req.body.text,
        done: false,
        user: new mongoose.Types.ObjectId(payload.id)
    });
    todo.save().then(todo => {
        res.json(todo);
    });
});

app.post('/todos', (req, res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    Todo.updateOne({
        _id: new mongoose.Types.ObjectId(req.body.id),
        user: new mongoose.Types.ObjectId(payload.id)
    }, {
        done: req.body.done,
    }).then(() => {
        res.sendStatus(200);
    });
});

app.listen(4000);