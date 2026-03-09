const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const transporter = require("../config/mailer");

exports.forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    const resetLink =
      `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      html: `
      <p>Click the link below to reset your password</p>
      <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.json({ message: "Reset email sent successfully" });

  } catch (err) {

    res.status(500).json({ error: err.message });
  }

};

exports.resetPassword = async (req, res) => {

  try {

    const { token, newPassword } = req.body;

    const user = await User.findOne({
      where: { resetToken: token }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {

    res.status(500).json({ error: err.message });

  }

};