const dgram = require('dgram');
const dotenv = require('dotenv').config()
const server = dgram.createSocket('udp4');
let sequence = 0

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  try {
    let data = JSON.parse(msg);
    if (data.sequence) {
      server.send(msg, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(err);
        }
        console.log(`server sent: ${msg}`);
      });

    }
  } catch (error) {

  }

});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});


server.bind(process.env.SERVICE_PORT);

if (process.env.SEND_INTERVAL !== 1) {
  setInterval(() => {
    server.send("hola", process.env.DESTINATION_PORT, process.env.DESTINATION_IP, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }, process.env.SEND_INTERVAL);
}
