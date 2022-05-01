const Router = require("express");
const User = require("../models/User");
const router = new Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/registration",
  [
    check("email", "Uncorrect email").isEmail(),
    check(
      "password",
      "Invalid password length, must be between 8 and 32 characters"
    ).isLength({ min: 8, max: 32 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Uncorrect request", errors });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({ email });

      if (candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} is already exist` });
      }

      const hashPassword = await bcrypt.hash(password, 8);

      const user = new User({ email, password: hashPassword });

      user.save();

      return res.json({ message: "User was created" });
    } catch (err) {
      console.error(err);
      res.send({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Uncorrect email").isEmail(),
    check(
      "password",
      "Invalid password length, must be between 8 and 32 characters"
    ).isLength({ min: 8, max: 32 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Uncorrect request", errors });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ message: `User with email ${email} mot found` });
      }

      const isPassValid = await bcrypt.compare(password, user.password);

      if (!isPassValid) {
        return res.status(400).json({ message: `Invalid user password` });
      }

      const token = jwt.sign({ id: user.id }, config.get("private-jwt-key"), {
        expiresIn: "1h",
      });

      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          storageSpace: user.storageSpace,
          usedSpace: user.usedSpace,
          avatar: user.avatar,
        },
      });
    } catch (err) {
      console.error(err);
      res.send({ message: "Server error" });
    }
  }
);

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });

    const token = jwt.sign({ id: user.id }, config.get("private-jwt-key"), {
      expiresIn: "1h",
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        storageSpace: user.storageSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.send({ message: "Server error" });
  }
});

module.exports = router;
