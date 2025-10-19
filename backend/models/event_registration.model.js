import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const { Schema, model } = mongoose;

const EventRegistrationSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', default: null },
  eventId: { type: Schema.Types.ObjectId, ref: 'Event', default: null },
  status: {
    type: String,
    enum: ['registered', 'attended'],
    default: 'registered'
  }
}, {
  timestamps: true
});

EventRegistrationSchema.plugin(mongoosePaginate);

const EventRegistration = model('EventRegistration', EventRegistrationSchema);
export default EventRegistration;
