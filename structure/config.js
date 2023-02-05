
module.exports = () => {   
    if(!process.env.JWT_PRIVATE_KEY){
        console.log("FATAL ERROR: no jwtPrivateKey provided.");
        process.exit(1);
    }
}