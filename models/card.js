const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const urlValidator = validate({
  validator: 'matches',
  arguments: /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/,
});

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: urlValidator,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
    validate: urlValidator,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
