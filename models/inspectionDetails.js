const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    driver: { type: String, required: true },
    status: {
      type: String,
      enum: ["approved", "declined", "pending"],
      default: "pending",
    },
    inpector: {
      type: mongoose.Types.ObjectId,
      ref: "Inspector",
    },
    hub: {
      type: mongoose.Types.ObjectId,
      ref: "Hub",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

module.exports = mongoose.model("InspectionDetails", schema);

