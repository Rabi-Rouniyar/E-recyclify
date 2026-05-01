import mongoose from 'mongoose';

const recyclerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please add a business name'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    acceptedMaterials: {
      type: [String],
      default: ['Electronics', 'Batteries', 'Appliances'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index on the location field for spatial queries
recyclerSchema.index({ location: '2dsphere' });

const Recycler = mongoose.model('Recycler', recyclerSchema);
export default Recycler;
