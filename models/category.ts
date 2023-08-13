import { Schema, model, models } from "mongoose";

interface ICategory {
    name: String,

}

const categorySchema = new Schema<ICategory>({
    name: String,

});
const Category = models.Category || model('Category', categorySchema)
export default Category;