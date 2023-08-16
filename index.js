const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => console.log(`connected to port: ${process.env.PORT}`));
const options = {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false};
mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log("connected to db"))
    .catch(err => console.log(err))

app.use("/api",          require("./routes/usr_route"));
app.use("/api/category", require("./routes/cat_route"));
app.use("/api/blog",     require("./routes/blg_route"));
app.use("/api/comment",  require("./routes/cmt_route"));

// get tokens to test google auth
app.use("/api/auth/google", require("./test/google_tokens"));
