const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const messageModel = new Schema(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

messageModel.virtual("created_at_formatted").get(function () {
  return DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("Message", messageModel);
