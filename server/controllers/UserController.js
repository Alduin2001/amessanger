const { Car, User } = require("../models/index");
const cookie = require('cookie-parser');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


exports.insertCar = async (req, res) => {
  try {
    const car = await Car.create({
      model: "Toyota",
      price: 10000,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return res.send({ message: "Success added" });
  } catch (err) {
    console.log(err);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["user_id", "first_name", "last_name"],
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.Register = async (req, res) => {
  const { first_name, last_name, login, password } = req.body;
  const existingUser = await User.findOne({ where: { login: login } });
  if (existingUser) {
    return res
      .status(400)
      .json({ error: "Пользователь с таким логином уже существует" });
  }

  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    await User.create({
      first_name: first_name,
      last_name: last_name,
      login: login,
      password: hashPassword,
    });

    res.json({ msg: "Регистрация прошла успешно" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.Login = async (req, res) => {
  const { login, password } = req.body;

  try {
    // Находим пользователя по логину
    const user = await User.findOne({ where: { login } });

    if (!user) {
      return res.status(404).json({ msg: "Login not found" });
    }

    // Сравнием пароль с хешем в базе данных
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // Создаем токен доступа и обновите refresh token в базе данных
    const accessToken = jwt.sign(
      { userId: user.id, first_name: user.first_name, last_name: user.last_name, login: user.login },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s",
      }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, first_name: user.first_name, last_name: user.last_name, login: user.login },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1d",
      }
    );
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );

    // Устанавливаем refresh token в куки
    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ refreshToken });            
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.UpdateProfile = async (req, res) => {
  const { userId, first_name, last_name } = req.body;
  console.log(req.body);

  try {
    // Update the user's profile
    const update = await User.update(
      {
        first_name: first_name,
        last_name: last_name
      },
      {
        where: {
          id: userId
        },
      }
    );

    // Find the user by their ID
    const user = await User.findOne({ where: { id: userId } });

    // If the user exists, update their refresh token and clear the cookie
    if (user) {
      const refreshToken = req.cookies.refreshToken;
      // Update the refresh token in the database
      await User.update({ refresh_token: null }, { where: { id: user.id } });
      // Clear the refresh token from the cookies
      res.clearCookie("refreshToken");

      // Generate a new refresh token
      const newRefreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });

      // Set the new refresh token in the cookies
      res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    }

    res.send({ msg: 'Success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

exports.Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    // Находим пользователя по refresh token
    const user = await User.findOne({ where: { refresh_token: refreshToken } });

    if (!user) return res.sendStatus(204);

    // Обновляем refresh token в базе данных
    await User.update({ refresh_token: null }, { where: { id: user.id } });

    // Удаляем refresh token из куки
    res.clearCookie("refreshToken");

    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};
