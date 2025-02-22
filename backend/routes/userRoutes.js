const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../db");

const router = express.Router();

// Регистрация пользователя
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await db.collection("users").findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email уже используется" });

        const result = await db.collection("users").insertOne({ name, email, password });
        res.status(201).json({ message: "Пользователь зарегистрирован", userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при регистрации", error: error.message });
    }
});

// Логин
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await db.collection("users").findOne({ email, password });
        if (!user) return res.status(401).json({ message: "Неверный email или пароль" });

        res.json({ message: "Успешный вход", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при входе", error: error.message });
    }
});

module.exports = router;