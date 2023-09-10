import { Schema, model,models } from "mongoose";
 
interface IProduct {
    name: String,
    price: Number,
    images: String[],
    category: String,
    stock: Number,
    description: String,
}

const productSchema = new Schema<IProduct>({
    name: String,
    price: Number,
    images: Array,
    category: String,
    stock: Number,
    description: String,
});
const Product = models.Product || model('Product', productSchema)
export default Product;