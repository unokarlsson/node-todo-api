const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};
var token = jwt.sign(data,'123abc');
console.log(token);
// The hash consists of three parts separated with dot. Header, payload, signature - jwt.io

var decoded = jwt.verify(token,'123abc')
console.log('decoded',decoded);

// var message = 'I am user number 3';
// var hash    = SHA256(message).toString();

// console.log(`message: ${message}`);
// console.log(`hash:    ${hash}`);

// // NOTE: Salting: value should be changed very request!!!
// var salt = 'somesecret';

// checkHash = (token,salt) => {
// var resultHash = SHA256(JSON.stringify(token.data) + salt).toString();
// if(resultHash===token.hash) {
//     console.log('Data was not changed');
// } else {
//     console.log('Data was changed. Do not trust it!');
// }
// }


// var data = {
// id:  4
// };
// var token = {
// data: data,
// hash: SHA256(JSON.stringify(data) + salt).toString()
// }
// checkHash(token,salt);


// // User try to manipulate
// token.data.id = 5;
// token.data.hash = SHA256(JSON.stringify(token.data) + salt).toString();
// checkHash(token,salt);
