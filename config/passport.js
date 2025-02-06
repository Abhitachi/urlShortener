const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, emails } = profile;
        // console.log(id, emails, "profile");
        const email = emails[0].value;

        let user = await User.findUser(id);

        if (!user) {
          user = await User.createUser(id, email);
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
// console.log(passport, "passport");

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findUser(id);
  done(null, user);
});
