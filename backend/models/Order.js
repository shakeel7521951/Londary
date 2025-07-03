import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  washType: {
    type: String,
    enum: ['standard', 'express'],
    required: true,
  },
  garments: [
    {
      type: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  steamFinish: {
    type: Boolean,
    default: false,
  },
  fragrance: {
    type: String,
    required: true,
  },
  packaging: {
    type: String,
    required: true,
  },
  cardFrom: {
    type: String,
    default: '',
  },
  cardTo: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', OrderSchema);
export default Order;