const request = require('request-promise-native');

let defReqOptions = {
    url: 'http://localhost:5002/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    form: {
        username: 'testUser',
        email: 'example@example.example'
    }
};


for (let i = 0; i < 5; i++)
    request(defReqOptions)
        .then(res => console.log(res));

// this executes two requests one after one
request(defReqOptions)
    .then(res => console.log(res))
    .then(() => request(defReqOptions))
    .then(res => console.log(res));
