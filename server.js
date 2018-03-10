'use strict';

require('dotenv').config();

const express = require('express'),
	passport = require('passport'),
	session = require('express-session');

const config = require('./lib/config'),
	connect = require('./lib/db');

const GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = express();

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const MongoStore = require('connect-mongo')(session);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((obj, done) => {
	done(null, obj);
});

connect.then(db => {
	app.use(require('body-parser').json());
	app.use(require('cookie-parser')());

	app.use(session({
		secret: 'keyboard cat',
		resave: true,
		saveUninitialized: true,
		store: new MongoStore({ mongooseConnection: db.connection }),
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new GoogleStrategy({
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		callbackURL: `${ config.host }/auth/google/callback`,
		passReqToCallback: true,
	}, async (request, accessToken, refreshToken, profile, done) => {
		const user = await db.model('User').findByIdAndUpdate(profile.id, profile, { new: true, upsert: true });
		done(null, user);
	}));

	app.get('/login',
		passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/userinfo.email',
				'https://www.googleapis.com/auth/user.phonenumbers.read',
				'https://www.googleapis.com/auth/userinfo.profile',
			],
		})
	);

	app.get('/auth/google/callback',
		passport.authenticate('google', { successRedirect: '/', failureRedirect: '/' })
	);

	require('./lib/esendex')(app, db);

	require('./lib/app')(app, db);
});

const port = process.env.PORT || 3000;

app.listen(port);
console.log(`App is listening on ${ config.host }`); // eslint-disable-line no-console
