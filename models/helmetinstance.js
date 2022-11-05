const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HelmetInstanceSchema = new Schema({
  helmet: { type: Schema.Types.ObjectId, ref: "helmet", required: true },
  size: { type: String, required: true, minLength: 1, maxLength: 20 },
  color: { type: String, required: true, minLength: 1, maxLength: 40 },
  amount: { type: Number, required: true },
  photo: { type: String },
});

HelmetInstanceSchema.virtual("url").get(function () {
  return `/catalog/bookinstance/${this.id}`;
});

module.exports = mongoose.model("helmetinstance", HelmetInstanceSchema);
