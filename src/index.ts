import express, { Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { Data, UserMessage } from "./dto"; // Data transfer object
import cors from "cors"; // cross origin resourse sharing
const prisma = new PrismaClient();
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", async (req: Request, res: Response) => {
  const connections = await prisma.connection.findMany();
  res.statusCode = 200;
  res.send(connections);
});


app.get("/message", async (req: Request, res: Response) => {
  const connectionChat = await prisma.messages.findMany({
    where: {
      mob: req.body.mobile,
    },
  });
  res.statusCode = 200;
  res.send(connectionChat);
});


io.on("connection", (socket: Socket) => {
  console.log("connection start " + socket.id);

  socket.on("new connection", async (data: Data) => {
    const user = await prisma.connection.findUnique({
      where: {
        id: socket.id,
      },
    });
    if (!user) {
      await prisma.connection
        .create({
          data: {
            id: socket.id,
            name: data.name,
          },
        })
        .then((res) => {
          socket.emit("user", { name: res.name, id: res.id });
        })
        .catch((error: Error) => console.log(error.message));
    }
  });
  socket.on("incoming", async (data: UserMessage) => {
    await prisma.messages.create({
      data: {
        connectionId: data.id,
        data: data.message,
        mob: data.mobile,
      },
    });
    await socket.emit("send", data);
  });

  socket.on("join", (data) => {
    socket.to(data.id).emit("private", data.message);
  });
  socket.on("disconnect", async () => {
    const user = await prisma.connection.findUnique({
      where: {
        id: socket.id,
      },
    });
    if (user) {
      await prisma.connection.delete({
        where: {
          id: socket.id,
        },
      });
    }
    console.log("connection lost " + socket.id);
  });
});

server.listen(3001, () => {
  console.log("server start");
});
