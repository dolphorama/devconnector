import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<App />, document.getElementById("root"));

serviceWorker.unregister();

// johns-Air:devconnector JohnDusseau$ npm run dev

// > devconnector@1.0.0 dev /Users/JohnDusseau/Desktop/devconnector
// > concurrently "npm run server" "npm run client"

// [1]
// [1] > devconnector@1.0.0 client /Users/JohnDusseau/Desktop/devconnector
// [1] > npm start --prefix client
// [1]
// [0]
// [0] > devconnector@1.0.0 server /Users/JohnDusseau/Desktop/devconnector
// [0] > nodemon server.js
// [0]
// [1]
// [1] > client@0.1.0 start /Users/JohnDusseau/Desktop/devconnector/client
// [1] > react-scripts start
// [1]
// [0] [nodemon] 1.18.10
// [0] [nodemon] to restart at any time, enter `rs`
// [0] [nodemon] watching: *.*
// [0] [nodemon] starting `node server.js`
// [0] events.js:183
// [0]       throw er; // Unhandled 'error' event
// [0]       ^
// [0]
// [0] Error: listen EADDRINUSE :::5000
// [0]     at Object._errnoException (util.js:992:11)
// [0]     at _exceptionWithHostPort (util.js:1014:20)
// [0]     at Server.setupListenHandle [as _listen2] (net.js:1355:14)
// [0]     at listenInCluster (net.js:1396:12)
// [0]     at Server.listen (net.js:1480:7)
// [0]     at Function.listen (/Users/JohnDusseau/Desktop/devconnector/node_modules/express/lib/application.js:618:24)
// [0]     at Object.<anonymous> (/Users/JohnDusseau/Desktop/devconnector/server.js:35:5)
// [0]     at Module._compile (module.js:652:30)
// [0]     at Object.Module._extensions..js (module.js:663:10)
// [0]     at Module.load (module.js:565:32)
// [0]     at tryModuleLoad (module.js:505:12)
// [0]     at Function.Module._load (module.js:497:3)
// [0]     at Function.Module.runMain (module.js:693:10)
// [0]     at startup (bootstrap_node.js:191:16)
// [0]     at bootstrap_node.js:612:3
// [0] [nodemon] app crashed - waiting for file changes before starting...
// [1] Starting the development server...
// [1]
// [1] Compiled successfully!
// [1]
// [1] You can now view client in the browser.
// [1]
// [1]   Local:            http://localhost:3000/
// [1]   On Your Network:  http://192.168.1.66:3000/
// [1]
// [1] Note that the development build is not optimized.
// [1] To create a production build, use npm run build.
// [1]
// ^C[1] npm run client exited with code 0
// [0] npm run server exited with code 0
// johns-Air:devconnector JohnDusseau$ git status
// On branch master
// nothing to commit, working tree clean
// johns-Air:devconnector JohnDusseau$ git status
// On branch master
// nothing to commit, working tree clean
// johns-Air:devconnector JohnDusseau$ git add .
// johns-Air:devconnector JohnDusseau$ git commit -m"test"
// On branch master
// nothing to commit, working tree clean
