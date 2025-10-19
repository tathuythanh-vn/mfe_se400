import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const AccountSchema = new Schema({
  email: { type: String, default: null },
  phone: { type: String, default: null },
  avatar: { type: Object, default: null },
  fullname: { type: String, default: null },
  birthday: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female'], default: null },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'manager', 'member'], default: null },
  infoMember: { type: Schema.Types.ObjectId, ref: 'Member', default: null },
  managerOf: { type: Schema.Types.ObjectId, ref: 'Chapter', default: null },
  status: { type: String, enum: ['active', 'locked', 'pending'], default: null },
}, {
  timestamps: true
});
AccountSchema.plugin(mongoosePaginate);

const Account = mongoose.model('Account', AccountSchema);

export default Account;
