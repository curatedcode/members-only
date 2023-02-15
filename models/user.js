const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  full_name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  membership: { type: String, required: true },
});

userSchema.virtual("name").get(function () {
  return `${this.full_name.first} ${this.full_name.last}`;
});

module.exports = mongoose.model("User", userSchema);
