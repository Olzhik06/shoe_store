const db = require('./db');

async function addProduct(product) {
    try {
        const result = await db.collection('products').insertOne(product);
        console.log('Product added:', result.insertedId);
    } catch (error) {
        console.error('Error adding product:', error);
    }
}

// Пример товара
addProduct({
    name: 'Nike Air Max',
    brand: 'Nike',
    category: 'sneakers',
    size: [40, 41, 42, 43],
    price: 120,
    stock: 50,
    description: 'Comfortable sneakers',
    images: ['nike1.jpg', 'nike2.jpg']
});