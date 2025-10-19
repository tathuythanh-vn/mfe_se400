import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


const EventSchema = new Schema({
  chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', default: null },
  name: { type: String, default: null},
  startedAt: { type: Date, default: null },
  location: { type: String, default: null },
  description: { type: String, default: null },
  tags: [{ type: String, default: null }],
  scope: {
    type: String,
    enum: ['public', 'chapter'],
    default: null
  },
  images: [{ type: Object, default: null }],
  likes: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['completed', 'happening', 'pending', 'canceled'],
    default: null
  }
}, {
  timestamps: true
});

EventSchema.plugin(mongoosePaginate);
const Event = mongoose.model('Event', EventSchema);

export default Event;
