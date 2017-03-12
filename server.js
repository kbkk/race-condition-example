const express = require('express');
const bodyparser = require('body-parser');

const db = require('sqlite');
const app = express();

app.use(bodyparser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/register', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;

    db
        .get('SELECT * FROM users WHERE email = ?', email)
        .then((result) => {
            if (result)
                res.send('User with this email already exists!');
            else
                return db.run(`INSERT INTO users VALUES(?, ?)`, username, email)
                    .then(() => res.send(`You've registered successfully!`));
        })
        .catch(err => {
            res.status(500).send('Something went wrong');
            console.log(err);
        });
});

app.post('/register/unique', (req, res) => {
    let username = req.body.username;
    let email = req.body.email;

    db
        .run(`INSERT INTO users_unique VALUES(?, ?)`, username, email)
        .then(() => res.send(`You've registered successfully!`))
        .catch(err => {
            if(err.errno === 19 && err.code === 'SQLITE_CONSTRAINT')
                res.send('User with this email already exists!');
            else
                res.status(500).send('Something went wrong');
            console.log(err);
        });
});

app.get('/user/:email', (req, res) => {
    db
        .all('SELECT * FROM users WHERE email = ?', req.params.email)
        .then(users => {
            res.send(users || 'no users found');
        });
});

Promise.resolve()
    .then(() => db.open(':memory:'))
    .then(db => {
        return db.run(`CREATE TABLE users (name VARCHAR(255), email VARCHAR(255))`)
            .then(() => db.run(`INSERT INTO users VALUES('test', 'mail@example.com')`))
            .then(() => db.run(`CREATE TABLE users_unique (name VARCHAR(255), email VARCHAR(255))`))
            .then(() => db.run(`CREATE UNIQUE INDEX EmailUniqueIndex ON users_unique (email)`));

    })
    .then(() => app.listen(5002, () => {
        console.log('Race Condition Example running port 5002!')
    }))
    .catch(err => console.log(err));

