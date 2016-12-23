let request = jest.genMockFromModule('superagent');
const mock = require('superagent-mocker')(request);
request = mock
// request.get = mock.get;
// request.post = mock.post;
// request.del = mock.del;
// request.patch = mock.patch;

module.exports = request;

// function get (url) {
//   return new Promise((resolve, reject) => {
//     const userID = parseInt(url.substr('/users/'.length), 10);
//     process.nextTick(
//       () => {console.log("hi")
//         users[userID] ? resolve(users[userID]) : reject({
//         error: 'User with ' + userID + ' not found.',
//       })}
//     );
//   });
// }
//
// function set(object){
//   return true;
// }
//
// function end(){
//   console.log("end");
// }

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
// let mockFiles = Object.create(null);
// function __setMockFiles(newMockFiles) {
//   mockFiles = Object.create(null);
//   for (const file in newMockFiles) {
//     const dir = path.dirname(file);
//
//     if (!mockFiles[dir]) {
//       mockFiles[dir] = [];
//     }
//     mockFiles[dir].push(path.basename(file));
//   }
// }

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
// function readdirSync(directoryPath) {
//   return mockFiles[directoryPath] || [];
// }
//
// request.get = get;
// request.set = set;
// request.end = end;
