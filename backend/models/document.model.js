import mongoose, { Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const DocumentSchema = new mongoose.Schema({
  chapterId: {
    type: Schema.Types.ObjectId,
    ref: 'Chapter',
    default: null
  },
  docCode: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: null
  },
  type: {
   type:String,
   enum:['VBHC', 'TLSH', 'other'],
    default: null
  },
  scope: {
    type: String,
    enum: ['chapter', 'private'],
    default: null
  },
  description: {
    type: String,
    default: null
  },
  file: {
    type: Object,
    default: null
  }
}, {
  timestamps: true
});

DocumentSchema.plugin(mongoosePaginate);

const Document = mongoose.model('Document', DocumentSchema);

export default Document;
