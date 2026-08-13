import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { chatContainer } from "../container/container";

const chatController = chatContainer();
// We actually need the service directly to save messages, let's just get it.
// To avoid rewriting container, let's instantiate the repositories and service here or import the container.
import { ChatService } from "../services/implements/chatService";
import { MongoChatConversationRepository } from "../repositories/implements/chatConversationRepository";
import { MongoChatMessageRepository } from "../repositories/implements/chatMessageRepository";

const conversationRepo = new MongoChatConversationRepository();
const messageRepo = new MongoChatMessageRepository();
const chatService = new ChatService(conversationRepo, messageRepo);

interface ConnectedUsers {
  [userId: string]: string; // userId -> socketId
}

const connectedUsers: ConnectedUsers = {};

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.use((socket, next) => {
    try {
      // The token can be passed in auth or headers
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as any;
      (socket as any).userId = decoded.id;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`User connected to socket: ${userId} with socketId: ${socket.id}`);
    
    connectedUsers[userId] = socket.id;

    socket.on("join_chat", (conversationId: string) => {
      socket.join(conversationId);
      console.log(`User ${userId} joined chat room: ${conversationId}`);
    });

    socket.on("leave_chat", (conversationId: string) => {
      socket.leave(conversationId);
      console.log(`User ${userId} left chat room: ${conversationId}`);
    });

    socket.on("send_message", async (data: { conversationId: string; receiverId: string; content: string }) => {
      try {
        const { conversationId, receiverId, content } = data;
        
        // Save to DB
        const savedMessage = await chatService.saveMessage(conversationId, userId, content);
        
        // Populate sender details manually if needed, or send as is
        const messageToSend = {
          _id: savedMessage._id,
          conversationId,
          senderId: userId, // client already knows senderId
          content,
          createdAt: savedMessage.createdAt
        };

        // Emit to everyone in the room
        io.to(conversationId).emit("receive_message", messageToSend);

        // Optional: If the receiver is not in the room but is connected, we might want to send a notification
        // if (connectedUsers[receiverId]) {
        //   io.to(connectedUsers[receiverId]).emit("new_message_notification", messageToSend);
        // }
      } catch (error) {
        console.error("Error saving message via socket:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
      delete connectedUsers[userId];
    });
  });

  return io;
};
