require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app); 
const io = require('socket.io')(http, { cors: { origin: `${process.env.Client_Url}`, methods: ["GET", "POST"] } });
const cookieParser = require('cookie-parser');
const cors = require('cors');



//  Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));



// Socket.io
io.on("connection", socket => {
    socket.on('joinRoom', id => {
        socket.join(id);
        // console.log({ joinRoom: socket.adapter.rooms });
    })

    socket.on('outRoom', id => {
        socket.leave(id);
        // console.log({ outRoom: socket.adapter.rooms });
    })

    socket.on("disconnect", () => {
        console.log("socket disconnect : " + socket.id);
    });

});
module.exports = { io };

//  Server
const Port = process.env.Port || 5001;
http.listen( Port, () => console.log(`connected to Port : ${Port}`) );


//  Routes 
const authRoute = require('./Routes/authRoute');
const userRoute = require('./Routes/userRoute');
const categoryRoute = require('./Routes/categoryRoute');
const blogRoute = require('./Routes/blogRoute');
const commentRoute = require('./Routes/commentRoute');

app.use('/api', authRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/blog', blogRoute);
app.use('/api/comment', commentRoute);



//  Database
const mongoose = require('mongoose');
mongoose.connect( process.env.MONGO_URL , {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then( () => console.log('connected to db') )
    .catch( err => console.log(err)  )

/********************* Deploy **************************/
if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '/client/build')));  
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build' , 'index.html'));
    })
}
