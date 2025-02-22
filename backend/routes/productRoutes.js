const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../db");

const router = express.Router();

// Добавить товар
router.post("/", async (req, res) => {
    try {
        const { name, brand, category, size, price, stock, description } = req.body;

        if (!name || !brand || !price || !stock) {
            return res.status(400).json({ message: "Некорректные данные" });
        }

        const result = await db.collection("products").insertOne({
            name,
            brand,
            category,
            size,
            price,
            stock,
            description,
        });

        res.status(201).json({ message: "Товар добавлен", productId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при добавлении товара", error: error.message });
    }
});

// Получить все товары
router.get("/", async (req, res) => {
    try {
        const products = await db.collection("products").find().toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении товаров", error: error.message });
    }
});

// Получить один товар
router.get("/:id", async (req, res) => {
    try {
        const product = await db.collection("products").findOne({ _id: new ObjectId(req.params.id) });

        if (!product) return res.status(404).json({ message: "Товар не найден" });

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Ошибка", error: error.message });
    }
});

module.exports = router;