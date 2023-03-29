import io from 'socket.io-client';
const token = window.localStorage.getItem('token');
const socket = io.connect(process.env.SOCKET_HOST, {
  transports: ['websocket'],
  path: '/realtime',
  query: {
    'X-TenantID': process.env.AREA_ID,
    token: token ? token.replace('Bearer ', '') : '',
  },
});
socket.on('connect', () => {
  socket
    .emit('authenticate', { token: token ? token.replace('Bearer ', '') : '' })
    .on('authenticated', () => {
      // console.log('Authenticated');
      socket.on('disconnect', () => {
        // console.log(reason);
      });
    })
    .on('unauthorized', () => {
      // console.log(`unauthorized: ${JSON.stringify(msg.data)}`);
    });
});

export default socket;
