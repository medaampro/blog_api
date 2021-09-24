//  UserValidation

function validatePhone(phone) {
    const re = /^[+]/g;
    return re.test(phone);
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const userValidator = (req, res, next) => {

    let { name, account, password } = req.body;
    let errors = [];

    if(!name){
        errors.push('Please enter a name !!');
    }else if(name.length > 20){
        errors.push('Name should be less than 20 chars !!');
    }

    if(!account){
        errors.push('Please enter a email or phone !!');
    }else if( !validateEmail(account) && !validatePhone(account) ){
        errors.push('Invalid email or phone !!');
    }

    if(!password){
        errors.push('Please enter a password !!');
    }else if(password.length < 6){
        errors.push('Password should not be less than 6 chars !!');
    }

    if(errors.length > 0) return res.status(400).json({errors})

    next();

}

module.exports = { validatePhone, validateEmail, userValidator };