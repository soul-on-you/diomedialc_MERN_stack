const Router = require("express");
const User = require("../models/User");
const router = new Router();
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

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

      const hashPassword = await bcrypt.hash(password, 15);

      const user = new User({ email, password: hashPassword });

      user.save();

      return res.json({ message: "User was created" });
    } catch (err) {
      console.error(err);
      res.send({ message: "Server error" });
    }
  }
);

module.exports = router;
