const express = require('express');
const SocketServer = require('ws').Server;
const uuid = require('node-uuid');


// Set the port to 4000
const PORT = 5000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data)
  })
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  let loggedUsers = {
    type: 'loggedUsers',
    quantity: wss.clients.length
  }
  // console.log(`Client(s) connected: ${loggedUsers.quantity}`);
  wss.broadcast(JSON.stringify(loggedUsers))

  ws.on('message', function incoming(message) {
    const received = JSON.parse(message)
    received['id'] = uuid.v1()          // time based random UUID


    wss.broadcast(JSON.stringify(received))
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    console.log(`Client(s) connected: ${loggedUsers.quantity}`)
    wss.broadcast(JSON.stringify(loggedUsers))
  })
})



