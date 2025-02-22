const express = require("express");
const { ObjectId } = require("mongodb");
const db = require("../db");

const router = express.Router();

// Создать заказ
router.post("/", async (req, res) => {
    try {
        const { userId, items } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: "Некорректные данные" });
        }

        let totalAmount = 0;

        for (let item of items) {
            const product = await db.collection("products").findOne({ _id: new ObjectId(item.productId) });
            if (!product) {
                return res.status(404).json({ message: 'Товар ${item.productId} не найден' });
            }
            totalAmount += product.price * item.quantity;
        }

        const order = {
            userId: new ObjectId(userId),
            items,
            totalAmount,
            status: "pending",
            created_at: new Date(),
        };

        const result = await db.collection("orders").insertOne(order);

        res.status(201).json({ message: "Заказ создан", orderId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: "Ошибка при создании заказа", error: error.message });
    }
});

// Получить заказы пользователя
router.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await db.collection("orders")
            .find({ userId: new ObjectId(userId) })
            .toArray();

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении заказов", error: error.message });
    }
});

module.exports = router;