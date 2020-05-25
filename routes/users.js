// 1xx informational response – the request was received, continuing process
// 2xx successful – the request was successfully received, understood, and accepted
// 3xx redirection – further action needs to be taken in order to complete the request
// 4xx client error – the request contains bad syntax or cannot be fulfilled
// 5xx server error – the server failed to fulfil an apparently valid request

import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import * as config from '../config/variables';
import User from '../models/user';
const JWT_duration = 0.5; // Minutes
const saltRounds = 10;

const router = Router();

router.post('/getById', async (req, res, next) => {
    let userId = req.body.id;
    User.findByPk(userId)
        .then(user => {
            if (user) {
                res.status(201).json({
                    success: true,
                    user: user
                })
            } else {
                res.status(403).json({
                    success: false,
                    msg: `The user with id '${userId}' could not be found`
                });
            }
        })
        .catch(() => {
            res.status(403).json({
                success: false,
                msg: `The user with id '${userId}' could not be found`
            });
        });
});

router.post('/register', async (req, res, next) => {
    let newUser = { ...req.body };

    User.findOne({
        where: {
            username: newUser.username
        }
    }).then(userExist => {
        if (userExist === null) {
            bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                User.create(newUser)
                    .then(user => {
                        res.status(201).json({
                            success: true,
                            msg: `User registered`,
                            user: {
                                id: user.id
                            }
                        });
                    })
                    .catch(() => {
                        res.status(500).json({
                            success: false,
                            msg: `The user could not be registered`
                        });
                    });
            });
        } else {
            res.status(403).json({
                success: false,
                msg: `The user with username '${newUser.username}' already exist`
            });
        }
    }).catch(() => {
        res.status(500).json({
            success: false,
            msg: `The user could not be registered`
        });
    });
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({
        where: {
            username: username
        }
    }).then(userExist => {
        if (userExist) {
            User.comparePassword(password, userExist.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    const token = jwt.sign(userExist.toJSON(), config.secret, {
                        expiresIn: JWT_duration * 60
                    });
                    res.status(202).json({
                        success: true,
                        access_token: 'JWT ' + token,
                        user: {
                            id: userExist.id,
                            username: userExist.username
                        }
                    });
                } else {
                    return res.status(401).json({
                        success: false,
                        msg: 'Wrong Password'
                    });
                }
            });
        } else {
            return res.status(404).json({
                success: false,
                msg: `There is no user with username '${username}'`
            });
        }
    }).catch(() => {
        res.status(500).json({
            success: false,
            msg: `The user could not be registered`
        });
    });
});

router.get('/profile', passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        res.status(202).json({
            id: req.user.id,
            username: req.user.username
        });
    });

module.exports = router;
