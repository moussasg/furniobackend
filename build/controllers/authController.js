const User = require('../models/User');//on l'utilise en createToken
const jwt = require('jsonwebtoken');//jsonwebtoken structure de données dans les échange de données entre 2 entité ou ya ادعاءات/ pour structuré / library used in Node.js to generate and verify JWTs for implementing authentication and authorization mechanisms.
  const checkUser = (req, res, next) => {
    const token = req.cookies.jwt; // cannot read jwt
    if (token) {
      jwt.verify(token, 'net ninja secret', async (err, decodedToken) => {
        if (err) {
          res.locals.user = null;
          next();
        } else {
          let user = await User.findById(decodedToken.id);
          res.locals.user = user;
          next();
        }
      });
    } else {
      res.locals.user = null;
      next();
    }
  };
  const requireAuth = (req, res, next) => { // spéciale pour node pas pour react
    const token = req.cookies.jwt;
    if (token) {
      jwt.verify(token, 'net ninja secret' , (err, decodedToken) => { // jwtsecret is inside .env
        if (err) {
          console.log(err.message);
          // Si une erreur se produit, redirigez l'utilisateur vers la page de connexion
          res.redirect('/Loginpage');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } else {
      // Si aucun token n'est présent, redirigez l'utilisateur vers la page de connexion
      res.redirect('/Loginpage');
    }
  };
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };
  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }
  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }
  // duplicate email error
  if (err.code === 10.00001) {
    errors.email = 'that email is already registered';
    return errors;
  }
  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
  return errors;
}
//fin du handle error/ token =  value of the cookie = cockie data envoyé du serveur web vers le clients
// create json web token
const maxAge = 3 * 24 * 60 * 60;// age a intérieur du jwt / jour/heure/minute/sec
const createToken = (id) => {// on introduit a intérieur des posts dans const token
  return jwt.sign({ id }, 'net ninja secret' , {// net ninja secret = secret key or passphrase used for signing JSON Web Tokens (JWT) 
    expiresIn: maxAge
  });
};
const signup_post = async (req, res) => {
    const { email, password , urname} = req.body;
    try {
      const user = await User.create({ email, password , urname});
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 0.00001 });
      res.status(200).json({ success: true, user: user._id , token });
      console.log(`name : ${urname} , email : ${email} , password : ${password}`)
    }
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ success: false, errors });
    }
  }
  const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 0.00001 });
      res.status(200).json({ success: true, user: user._id , token })// TR2S TR2S IMPortantT défini token fel back aprés signup
      // Après une connexion réussie
    }
    catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ success: false, errors });
    }
  }
  module.exports = {
    signup_post,
    login_post,
    checkUser,
  }