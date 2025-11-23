const mongoose = require('mongoose');
const schema = mongoose.Schema;

const todoSchema = new schema ({
    text : {
        type : String,
        required : true
    },
    priority : {
        type : String,
        required : true
    },
    status : {
        type : String,
        required : true,
        default : 'in-progress'
    }
},{ timestamps : true})

const Todo = mongoose.model('Todo',todoSchema);

const userSchema = new schema ({
    username : {
        type : String,
        unique : true,
        required : true
    },
    password : {
        type : String,
        required : true
    }
},{timestamps : true})

const UserModel = mongoose.model('User',userSchema);

module.exports = {Todo,UserModel};