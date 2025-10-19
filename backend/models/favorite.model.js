import mongoose, {Schema} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const FavoriteSchema = new mongoose.Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null},
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', default: null },
 
  
}, {
  timestamps: true
});

FavoriteSchema.plugin(mongoosePaginate);
const Favorite = mongoose.model('Favorite', FavoriteSchema);

export default Favorite;
