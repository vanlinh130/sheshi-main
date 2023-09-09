import {} from 'dotenv/config';
import passportJWT from 'passport-jwt';

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

export default passport => {
  passport.use(new JWTStrategy({
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    (jwtPayload, cb) => cb(null, jwtPayload)
  ));
}
