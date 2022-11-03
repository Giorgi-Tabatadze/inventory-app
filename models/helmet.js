const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HelmetSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
  description: {
    type: String,
    default: "No Description Available",
    required: true,
  },
  price: { type: Number, required: true },
  code: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "category", required: true }],
  photo: { type: String },
});

HelmetSchema.virtual("url").get(function () {
  return `/catalog/helmet/${this.id}`;
});

module.exports = mongoose.model("helmet", HelmetSchema);
