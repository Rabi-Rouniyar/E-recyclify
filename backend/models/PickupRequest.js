import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recycler: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Recycler',
      default: null, // Null until a recycler accepts it
    },
    productName: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    brandModel: {
      type: String,
      required: [true, 'Please add a brand/model'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    estimatedPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Please provide a pickup date'],
    },
    pickupTime: {
      type: String,
      required: [true, 'Please provide a pickup time slot'],
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
    phoneNumber: {
      type: String,
      required: [true, 'Please provide a contact phone number'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Completed', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

// Create a 2dsphere index for location based queries
pickupRequestSchema.index({ location: '2dsphere' });

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
