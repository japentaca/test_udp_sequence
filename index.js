const dgram = require('dgram');
const { sep } = require('path');
const dotenv = require('dotenv').config()
const server = dgram.createSocket('udp4');
let sequence = 0

server.on('message', (msg, rinfo) => {
  // console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  try {
    let data = JSON.parse(msg);
    if (data.sequence) {
      let res = JSON.stringify({
        response: data.sequence
      })
      server.send(res, 0, msg.length, rinfo.port, rinfo.address, (err) => {
        if (err) {
          console.error(err);
        }
        //console.log(`server sent: ${msg}`);
      });

    }
    if (data.response) {
      //console.log("response", data.response)
      if (data.response !== sequence - 1) {
        console.log("DIFFERENCE", data.response, sequence)
      }
    }
  } catch (error) {
    console.error(error);

  }

});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});


server.bind(process.env.SERVICE_PORT);

if (process.env.SEND_INTERVAL !== 1) {
  setInterval(() => {
    let msg = JSON.stringify({ sequence: sequence++ })
    server.send(msg, 0, msg.length, process.env.DESTINATION_PORT, process.env.DESTINATION_IP, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }, process.env.SEND_INTERVAL);
}
