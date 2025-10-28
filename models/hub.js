const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, sparse: true, required: true },
    city: { type: String, sparse: true },
    state: { type: String, sparse: true },
    country: { type: String, default: "Nigeria" },
    phone_number: { type: String },
    hub_images: { type: [String] },
    inspector: {
      type: mongoose.Types.ObjectId,
      ref: "Inspector",
    },
    cars_processed: { type: Number, default: 0 },
    cars_approved: { type: Number, default: 0 },
    cars_declined: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    opening_hours: {
      type: [{ day: String, open: String, close: String }],
      default: [
        { day: "MONDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "TUESDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "WEDNESDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "THURSDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "FRIDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "SATURDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
        { day: "SUNDAY", opensAt: "09:00 AM", closesAt: "06:00 PM" },
      ],
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Hub", schema);
