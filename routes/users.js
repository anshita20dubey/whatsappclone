const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://anshita20dubey:ruHKZ1IWBLZ6miZ3@cluster0.pojqw4s.mongodb.net/whatsappclone").then(function(){
  console.log("connect to db");
}).catch(function(err){
  console.log(err);
});

const userSchema = mongoose.Schema({
  username:{
    type: String,
    required: [true, "username is required for creating a user"],
    unique: [true, "username field must be unique"],
  },
  contact: {
    type: String,
  },
  img: {
    type: String,
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi9jO1ey8-tvqc5C5dHVNX2D4aAkoKipwjqg&usqp=CAU',
  },
  socketId: {
    type: String
  }
});
userSchema.plugin(plm);
module.exports = mongoose.model('user',userSchema);