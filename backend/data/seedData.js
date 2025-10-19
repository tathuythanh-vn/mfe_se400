import mongoose from "mongoose";
import Account from "../models/account.model.js";
import {configDotenv} from 'dotenv'
configDotenv()
const seedAccounts = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECT_STRING);

    const accounts = [
      {
        email: "admin1@example.com",
        phone: "0909123456",
        avatar: null,
        fullname: "Nguyễn Văn A",
        birthday: new Date("1990-01-01"),
        gender: "male",
        password: "hashedpassword1", // Đảm bảo đã hash nếu dùng auth
        role: "admin",
        status: "active",
      },
      {
        email: "manager1@example.com",
        phone: "0909234567",
        fullname: "Trần Thị B",
        birthday: new Date("1992-05-15"),
        gender: "female",
        password: "hashedpassword2",
        role: "manager",
        status: "active",
      },
      {
        email: "member1@example.com",
        phone: "0909345678",
        fullname: "Lê Văn C",
        birthday: new Date("1995-07-20"),
        gender: "male",
        password: "hashedpassword3",
        role: "member",
        status: "pending",
      },
      {
        email: "admin2@example.com",
        phone: "0909456789",
        fullname: "Phạm Thị D",
        birthday: new Date("1988-10-12"),
        gender: "female",
        password: "hashedpassword4",
        role: "admin",
        status: "locked",
      },
      {
        email: "manager2@example.com",
        phone: "0909567890",
        fullname: "Đỗ Văn E",
        birthday: new Date("1991-03-08"),
        gender: "male",
        password: "hashedpassword5",
        role: "manager",
        status: "pending",
      },
      {
        email: "member2@example.com",
        phone: "0909678901",
        fullname: "Nguyễn Thị F",
        birthday: new Date("1996-11-01"),
        gender: "female",
        password: "hashedpassword6",
        role: "member",
        status: "active",
      },
      {
        email: "admin3@example.com",
        phone: "0909789012",
        fullname: "Võ Văn G",
        birthday: new Date("1985-09-22"),
        gender: "male",
        password: "hashedpassword7",
        role: "admin",
        status: "active",
      },
      {
        email: "manager3@example.com",
        phone: "0909890123",
        fullname: "Bùi Thị H",
        birthday: new Date("1993-04-18"),
        gender: "female",
        password: "hashedpassword8",
        role: "manager",
        status: "locked",
      },
      {
        email: "member3@example.com",
        phone: "0909901234",
        fullname: "Cao Văn I",
        birthday: new Date("1998-06-05"),
        gender: "male",
        password: "hashedpassword9",
        role: "member",
        status: "pending",
      },
      {
        email: "member4@example.com",
        phone: "0909012345",
        fullname: "Lý Thị J",
        birthday: new Date("2000-12-25"),
        gender: "female",
        password: "hashedpassword10",
        role: "member",
        status: "active",
      },
    ];

    await Account.insertMany(accounts);

    console.log("🌱 Seeding tài khoản thành công!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi khi seed tài khoản:", err);
    process.exit(1);
  }
};

seedAccounts();