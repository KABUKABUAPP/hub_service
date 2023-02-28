const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    full_name: { type: String, required: true },
    phone_number: { type: String, sparse: true, required: true },
    email: { type: String, sparse: true },
    profile_image: String,
    type: {
      type: String,
      enum: ["user", "driver", "rider"],
      default: "rider",
    },
    isBlocked: { type: Boolean, default: false },
    accessTokens: { type: String },
    next_of_kin: {
      full_name: { type: String },
      relationship: { type: String },
      phone_number: { type: String },
    },
    onboarding_step: Number,
    is_onboarding_complete: {type: Boolean, default: false},
    driver: {
      type: mongoose.Types.ObjectId,
      ref: "Driver",
    },
    accessory: {
      type: mongoose.Types.ObjectId,
      ref: "Accessory",
    },
    total_trips: {type: Number, default: 0},
    guarantor: {
      name: String,
      address: String,
      phone_number: String,
      image: String,
    },
    location: {
      type: String,
    },
    coordinate: {
      type: [Number], // <lng, lat>
      index: { type: "2dsphere", sparse: false },
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("User", schema);
