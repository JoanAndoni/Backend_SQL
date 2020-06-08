import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import User from '../models/user';

export default function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
    opts.secretOrKey = process.env.SECRET;

    passport.use(new Strategy(opts, (jwt_payload, done) => {
        User.findByPk(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
            .catch(err => { return done(err, false); })
    }));
}
