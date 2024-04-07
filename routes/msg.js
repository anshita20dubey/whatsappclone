const mongoose = require('mongoose');

const msgSchema = mongoose.Schema({
    msg: {
        type:String,
        required: [true, 'msg is required for creating an msg document']
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    //group
},
  { 
    timestamps : true,
  }
)


module.exports = mongoose.model('msg',msgSchema);