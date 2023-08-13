import { Schema, model,models } from "mongoose";

interface IProduct {
    name: String,
    images: String[],
    category: String,
    descrption: String,
}

const productSchema = new Schema<IProduct>({
    name: String,
    images: String ,
    category: String,
    descrption: String,
});
const Product = models.Product || model('User', productSchema)
export default Product;