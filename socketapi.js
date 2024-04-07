const io = require("socket.io")();
const userModel = require('./routes/users');
const groupModel = require('./routes/group')
const socketapi = {
    io: io
};
const msgModel = require('./routes/msg')

// Add your socket.io logic here!
io.on("connection", function (socket) {

    socket.on('join-server', async username => {
        // console.log('hello')
        const currentUser = await userModel.findOne({
            username: username,
        });

        const onlineUsers = await userModel.find(
        {
            socketId:{ $nin:[''] },// nin mtlb notinclude jo ek array leta h kehne ka mtlb h jis socket id ki value empty na ho vo dedo
            username: {$nin: [currentUser.username]} // khud ko include na kre kyuki khudki socketid empty nhi h
        })

        onlineUsers.forEach(onlineUser=>{ // ek ek krke online users aayenge socket.emit isliye muje sbko ye bhjna 
            socket.emit('newUserJoined',{
                img: onlineUser.img,
                username: onlineUser.username,
                lastMessage : "Hello !",
                id: onlineUser._id,
            })
        })

        socket.broadcast.emit('newUserJoined',{ // sbke pass chle jaye ki koi naya user online aya h sirf khud ko chor ke
            img: currentUser.img,
            username: currentUser.username,
            lastMessage : "Hello !",
            id: currentUser._id,
        })

        currentUser.socketId = socket.id;
        await currentUser.save();
    })
    socket.on('disconnect',async ()=>{
        // console.log('socket disconnected');
        await userModel.findOneAndUpdate({
            socketId: socket.id,
        },
        {
            socketId: '',
        })
        // console.log(socket.id);
    })

    socket.on('privateMessage', async msgObject=>{
        
        
        await msgModel.create({
            msg: msgObject.msg,
            sender: msgObject.sender, // object id aayegi yaha pe
            receiver: msgObject.receiver, // object id aayegi yaha pe
        })
        
        const toUser = await userModel.findById(msgObject.receiver)
        io.to(toUser.socketId).emit('receivePrivateMessage', msgObject)
    })

    socket.on('getMessage', async msgObject=>{
        const allMessages = await msgModel.find({
         $or: [ // OR same hota h if-else jesa ye ni to vo sahi
            {
                sender : msgObject.receiver, // a 
                receiver : msgObject.sender, //  b
            },
            {
                receiver : msgObject.receiver, // b
                sender : msgObject.sender, // a
            }
        ]
        })
        socket.emit('chatMessages', allMessages)
    });
    socket.on('createGroup', async groupDetails=>{
        const newGroup = await groupModel.create({
            name: groupDetails.groupName,
        });
        console.log(newGroup);
        newGroup.users.push(groupDetails.senderId);
        await newGroup.save();
    })
    console.log("A user connected");
});
// end of socket.io logic

module.exports = socketapi;