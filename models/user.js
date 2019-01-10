const mongoose = require('mongoose'),
    bcrypt = require('bcryptjs');

//User Schema
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    name: {
        type: String
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = (username,callback)=>{
    const query = {username: username};
    User.findOne(query,callback);
}

module.exports.getUserById = (id,callback)=>{
    User.findById(id,callback);
}

module.exports.comparePassword = (userPassword, hash, callback)=>{
    bcrypt.compare(userPassword, hash, (err, isMatch)=>{
        if(err)
            throw err;
        callback(null, isMatch);
    });
}