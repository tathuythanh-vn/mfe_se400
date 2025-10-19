import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account', default:null}],
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', default:null },
  text: { type: String, required: true }
}, { timestamps: true });

const Message = mongoose.model('Message', MessageSchema);

export default Message
