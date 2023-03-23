const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    profile_image: { type: String, sparse: true },
    phone_number: { type: String },
    email: { type: String },
    house_address: { type: String, sparse: true, required: true },
    city: { type: String, sparse: true },
    state: { type: String, sparse: true },
    country: { type: String, default: 'Nigeria' },
    password: { type: String, },
    access_token: { type: String, },
    regCompleted: {type: Boolean, default: false}
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("Inspector", schema);

