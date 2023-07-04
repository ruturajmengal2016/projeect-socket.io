"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const client_1 = require("@prisma/client");
const cors_1 = __importDefault(require("cors")); // cross origin resourse sharing
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
}));
app.use(express_1.default.json());
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connections = yield prisma.connection.findMany();
    res.statusCode = 200;
    res.send(connections);
}));
app.get("/message", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const connectionChat = yield prisma.messages.findMany({
        where: {
            mob: req.body.mobile,
        },
    });
    res.statusCode = 200;
    res.send(connectionChat);
}));
io.on("connection", (socket) => {
    console.log("connection start " + socket.id);
    socket.on("new connection", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.connection.findUnique({
            where: {
                id: socket.id,
            },
        });
        if (!user) {
            yield prisma.connection
                .create({
                data: {
                    id: socket.id,
                    name: data.name,
                },
            })
                .then((res) => {
                socket.emit("user", { name: res.name, id: res.id });
            })
                .catch((error) => console.log(error.message));
        }
    }));
    socket.on("incoming", (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.messages.create({
            data: {
                connectionId: data.id,
                data: data.message,
                mob: data.mobile,
            },
        });
        yield socket.emit("send", data);
    }));
    socket.on("join", (data) => {
        socket.to(data.id).emit("private", data.message);
    });
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.connection.findUnique({
            where: {
                id: socket.id,
            },
        });
        if (user) {
            yield prisma.connection.delete({
                where: {
                    id: socket.id,
                },
            });
        }
        console.log("connection lost " + socket.id);
    }));
});
server.listen(3001, () => {
    console.log("server start");
});
