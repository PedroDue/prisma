import jwt from "jsonwebtoken"

function genereteAccessToken(user) {
    return jwt.sign({userId: user.id},process.env.SECRET,{
        expiresIn: '5m',
    });
}

function generateRefrashToken(user, jti) {
    return jwt.sing({userId: user.id, jti}, process.env.SECRET,{
        expiresIn: '8h',
    })
}

function generateTokens(user, jti) {
    const accessToken = genereteAccessToken(user);
    const refrashToken = generateRefrashToken(user,jti);

    return {accessToken, refrashToken}
}

module.export = {
    genereteAccessToken,
    generateRefrashToken,
    generateTokens
};