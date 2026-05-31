export default (user, statusCode, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + Number(process.env.COOKIE_EXPIRES_TIME) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PRODUCTION', 
    sameSite: process.env.NODE_ENV === 'PRODUCTION' ? 'none' : 'lax'
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ 
      token,
    });
};
