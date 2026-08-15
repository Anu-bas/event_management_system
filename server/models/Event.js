const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // ISO date string YYYY-MM-DD
    time: { type: String, required: true }, // HH:MM
    venue: { type: String, required: true },
    capacity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ["draft", "open", "closed"], default: "draft" },
    price: { type: Number, default: 0, min: 0 },
    color: { type: String, default: "blue" },
    desc: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});
eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
