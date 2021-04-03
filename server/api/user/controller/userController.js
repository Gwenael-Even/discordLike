const { count } = require('../model/user')
const User = require('../model/user')

/**
 * Crée un nouvelle utililisateur
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
exports.registerNewUser = async (req, res) => {
    try {
        let emailExist = await User.find({ email: req.body.email }).countDocuments()
        if(emailExist >= 1) {
            return res.status(409).json({
                message: 'Email déjà existant'
            })
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        let data = await user.save()
        // Méthode dans model/user
        const token = await user.generateAuthToken()
        res.status(201).json({ data, token })
    } catch (err) {
        res.status(400).json({ err: err })
    }
}

/**
 * Log un utilisateur
 * @param {object} req 
 * @param {object} res 
 * @returns 
 */
exports.loginUser = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const user = await User.findByCredentials(email, password)
        if(!user) {
            return res.status(401).json({ error : "Email ou mot de passe incorrect" })
        }
        const token = await user.generateAuthToken()
        res.status(201).json({ user, token })
    } catch (err) {
        res.status(400).json({ err, err })
    }
}

exports.getUserDetails = async (req, res) => {
    await res.json(req.userData)
}