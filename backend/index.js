import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { SocksProxyAgent } from "socks-proxy-agent";
import connectDB from "./database/db.js";
import User from "./models/userModel.js";
import isAuthnticated from "./middlewares/authMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://google-login-test-client.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// session
app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // secure: true, // set to true if your using https
      // sameSite: "none", // set to none if your using https
      // httpOnly: true, // set to true if your using https
    },
  })
);

app.use(cookieParser());

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// configure passport to use Google strategy
const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:7777/api/auth/google/callback",
    // callbackURL:
    //   "https://google-login-test-sysc.onrender.com/api/auth/google/callback",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    scope: ["profile", "email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    try {
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          avatar: profile.photos[0].value,
        });

        await user.save();
      }

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

passport.use(googleStrategy);

// serialize user session
passport.serializeUser((user, done) => {
  done(null, user.id);
  // console.log("serialize ok");
});

// deserialize user session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
    // console.log("deserialize ok");
  } catch (error) {
    done(error, null);
  }
});

// google login route
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google oauth 2.0 callback route
// const CLIENT_URL = "http://localhost:5173/profile";
const CLIENT_HOME_PAGE_URL = "/profile";
app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "/api/auth/failure",
  })
);

// success redirect route.
app.get("/api/auth/success", isAuthnticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Login successful",
    user: req.user,
  });
});

// get user info route.
app.get("/api/profile", isAuthnticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User info",
    user: req.user,
  });
});

// logout route.
app.get("/api/auth/logout", isAuthnticated, (req, res) => {
  req.logout();
  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// failure redirect route.
app.get("/api/auth/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Login failed",
  });
});

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Hello World!",
//   });
// });

//serve static assets in production frontend build
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on  http://localhost:${port}`);
});
