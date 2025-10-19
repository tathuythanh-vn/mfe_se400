import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const DocumentTypeSchema = new Schema({
  name: { type: String, default: null }
}, {
  timestamps: true
});



const DocumentType = model('DocumentType', DocumentTypeSchema);
export default DocumentType;
