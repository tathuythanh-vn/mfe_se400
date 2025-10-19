import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const CommentSchema = new mongoose.Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null},
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', default: null },
  text: { type: String, default: null },
  reports: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['active', 'locked'],
    default: 'active'
  }
}, {
  timestamps: true
});

CommentSchema.plugin(mongoosePaginate);
const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;
