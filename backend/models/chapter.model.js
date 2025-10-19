import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ChapterSchema = new mongoose.Schema({
  status: { type: String, enum: ['active', 'locked'], default: null },
  name: { type: String, default: null },
  affiliated: { type: String, default: null },
  address: { type: String, default: null },
  establishedAt: { type: Date, default: null }
}, { timestamps: true });


ChapterSchema.plugin(mongoosePaginate);
const Chapter = mongoose.model('Chapter', ChapterSchema);

export default Chapter;
