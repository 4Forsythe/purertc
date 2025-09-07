import { Server } from 'socket.io';
import { createServer } from 'http';

import 'dotenv/config';

const port = Number(process.env.PORT) || 3001;

const server = createServer();

const io = new Server(server, {
  cors: { origin: '*' },
});

const rooms: Record<string, string> = {};

io.on('connection', (socket) => {
  console.log('Socket connect', socket.id);

  socket.on('room:join', async (roomId: string) => {
    console.log('Connected to the room', roomId);

    socket.join(`room:${roomId}`);
    rooms[socket.id] = roomId;

    io.in(`room:${roomId}`).emit(
      'room:joined',
      Object.keys(rooms)
        .filter((key) => rooms[key] === roomId)
        .map((socketId) => socketId)
    );
  });

  socket.on(
    'room:message',
    ({ roomId, text }: { roomId: string; text: string }) => {
      const message = {
        userId: socket.id,
        text,
        timestamp: Date.now(),
      };

      io.in(`room:${roomId}`).emit('room:message', message);
    }
  );

  socket.on('disconnecting', () => {
    console.log('Socket disconnect');

    if (rooms[socket.id]) {
      const roomId = rooms[socket.id];
      socket.to(`room:${roomId}`).emit('room:leave', socket.id);
      delete rooms[socket.id];
    }
  });
});

server.listen(port, () => {
  console.log('Server is running on', port);
});
