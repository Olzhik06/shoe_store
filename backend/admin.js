import db from "./db";

async function getProducts() {
    const products = await db.collection('products').find().toArray();
    console.log(products);
}
getProducts();

async function updateProduct(productId, newStock) {
    await db.collection('products').updateOne(
        { _id: new ObjectId(productId) },
        { $set: { stock: newStock } }
    );
}

async function deleteProduct(productId) {
    await db.collection('products').deleteOne({ _id: new ObjectId(productId) });
}