const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, sparse: true, required: true },
    city: { type: String, sparse: true },
    state: { type: String, sparse: true },
    country: { type: String, default: 'Nigeria' },
    hub_images: { type: [String], },
    inspector: {
      type: mongoose.Types.ObjectId,
      ref: "Inspector",
    },
    cars_processed: { type: Number, default: 0 },
    cars_approved: { type: Number, default: 0 },
    cars_declined: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Hub", schema);
