// exports.fetchData = async function() {
//     try {
//         return await Promise.resolve('an apple')
//     } catch (err) {
//         throw new Error('error')
//     }
// }

// exports.fetchCar = function(callback) {
//     setTimeout(() => {
//         callback(null, 'Mazda');
//     }, 100)
// }


// exports.bubbleSort = function(a) {
//     const b = [...a];
//     const n = b.length;
   
//     for(let i = n - 2; i >= 0; i--) {
//         for(let j = 0; j <= i; j++) {
//             if(b[j] > b[j+1]) {
//                 [b[j], b[j+1]] = [b[j+1], b[j]]
//             }
//         }
//     }
//     return b;
// }

// const selectionSort = function(a) {

//     const n = a.length;
//     const b = [...a];
//     let minVal, minIndex;

//     for(let i = 0; i <= n - 2; i++) {

//         let minVal = b[i];
//         let minIndex = i;

//         for (let j = i + 1; j <= n - 1; j++) {
//             if(b[j] < minVal) {
//                 minVal = b[j];
//                 minIndex = j;
//             }
//         }

//         [b[i], b[minIndex]] = [b[minIndex], b[i]];
//     }

//     return b;
// }

// const insertionSort = function(a) {

//     const n = a.length;
//     const b = [...a];

//     for (let i = 1; i <= n - 1; i++) {

//         let currentVal = b[i];
//         let j = i - 1;

//         while(j >= 0 && currentVal < b[j]) {
//             b[j+1] = b[j];
//             j--;
//         }
//         b[j+1] = currentVal;
//     }
//     return b;
// }

// // console.log(bubbleSort(a1));
// // console.log(bubbleSort(a2));

// // console.log(selectionSort(a1));
// // console.log(selectionSort(a2));

// // console.log(insertionSort(a1));
// // console.log(insertionSort(a2));

// let users = [];

// const initializeUserDB = function() {
//     users = ['shiro', 'kuro'];
// }

// const clearUserDB = function() {
//     users = [];
// }

// const addUser = function(name) {
//     users.push(name);
// }

// const getUsers = function() {
//     return users;
// }

// module.exports = {
//     initializeUserDB,
//     clearUserDB,
//     addUser,
//     getUsers,
// }

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const secret = 'mySecret';
const token = jwt.sign({id: '123'}, secret, {expiresIn: '1h'});
const wrongToken = 'saf234sadf';


// jwt.verify(token, sercret, (err, decoded) => {
//     if(err) {
//         console.log('Token is invalid: ', err.message)
//     } else {
//         console.log('Token is valid ', decoded)
//     }
// });

// jwt.verify(wrongToken, sercret, (err, decoded) => {
//     if(err) {
//         console.log('Token is invalid: ', err.message)
//     } else {
//         console.log('Token is valid ', decoded)
//     }
// });

// (async () => {
//   try {
//     const decode1 = await promisify(jwt.verify)(token, secret);
//     console.log('Valid token decoded:', decode1);
//   } catch (err) {
//     console.log('Token 1 is invalid:', err.message);
//   }

//   try {
//     const decode2 = await promisify(jwt.verify)(wrongToken, secret);
//     console.log('Wrong token decoded:', decode2);
//   } catch (err) {
//     console.log('Token 2 is invalid:', err.message);
//   }
// })();


exports.getLatLong = async function (placeName) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data && data.length > 0) {
    const { lat, lon } = data[0];
    return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
  } else {
    throw new Error('Location not found');
  }
};