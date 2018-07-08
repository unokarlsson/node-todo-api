const mongoose = require('mongoose');

var User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 3
    }
});

module.export = {User};