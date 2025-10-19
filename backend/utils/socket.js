import { onlineUsers } from "./onlineUsers.js";
import { verifyToken } from "./token.js";


// socketInstance.js
let ioInstance = null;
export const setIO = (io) => { ioInstance = io };
export const getIO = () => ioInstance;

export const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🆕 Client connected:", socket.id);

    // Lắng nghe sự kiện 'access' từ client để lấy token
    socket.on("access", (usertoken) => {
      try {
        const token = usertoken;
        const decoded = verifyToken(token);

        socket.userId = decoded.accountId;
        onlineUsers[socket.userId] = socket.id;

        console.log("✅ User authenticated:", socket.userId);
        console.log("🟢 Online users:", onlineUsers);

 socket.on('chat', (data) => {

      console.log(data,12)
      if (onlineUsers[data.to]) { io.to(onlineUsers[data.to]).emit('chat', {senderId: socket.userId, message: data.text}) }

    })



      } catch (err) {
        console.log("❌ Token không hợp lệ");
        socket.disconnect(); // Ngắt kết nối nếu token sai
      }
    });

   

    // Khi client ngắt kết nối
    socket.on("disconnect", () => {
      if (socket.userId) {
        delete onlineUsers[socket.userId];
        console.log("🔌 User disconnected:", socket.userId, socket.id);
      } else {
        console.log("🔌 Guest disconnected:", socket.id);
      }
    });
  });
};


