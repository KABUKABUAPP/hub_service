const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    otp: { type: Number, required: true },
    email: { type: String, sparse: true },
    phone_number:{ type: String, sparse: true },
    token: { type: String, },
    user_id: { type: mongoose.Types.ObjectId, ref: "Inspector" },

  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("OneTimePassword", schema);
