const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require ('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Veuillez insérer un nom']
    },
    email: {
        type: String,
        required: [true, 'Veuillez insérer une adresse mail']
    },
    password: {
        type: String, 
        required: [true, 'Veuillez insérer un mot de passe']
    },
    created_at: {
        type: Date,
        default: new Date()
    },
    updated_at: {
        type: Date,
        default: new Date()
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
})

// Hash du mot de passe
userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Génération d'un token
userSchema.methods.generateAuthToken = async function() {
    const user = this
    const token = jwt.sign({  _id: user._id, nam: user.name, email: user.email}, "secret")
    if(user.tokens === undefined) {
        user.tokens = []
    }

    console.log('token :', token)
    user.tokens = ({ token })
    await user.save()
    return token;
}

// Recherche de l'utilisateur via email/password

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error ({ error : "Email ou mot de passe invalide" })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
        throw new Error({ error : "Email ou mot de passe invalide" })
    }
    return user
}

const User = mongoose.model('User', userSchema)
module.exports = User