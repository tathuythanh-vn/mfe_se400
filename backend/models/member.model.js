import mongoose, {Schema} from 'mongoose';

const MemberSchema = new Schema({
  memberOf: { type: Schema.Types.ObjectId, ref: 'Chapter', default: null },
  position: {
    type: String,
    enum: ['secretary', 'deputy_secretary', 'committee_member', 'member'],
    default: null
  },
  cardCode: { type: String, default: null },
  joinedAt: { type: Date, default: null },
  address: { type: String, default: null },
  hometown: { type: String, default: null },
  ethnicity: { type: String, default: null },
  religion: { type: String, default: null },
  eduLevel: { type: String, default: null }
}, {
  timestamps: true 
});


const Member = mongoose.model('Member', MemberSchema);

export default Member;
