import { Category } from "../models/category";

export const getAllCategories = async () => {
    const categories = Category.find();
    return categories;
};

export const createCategory = async (categoryData: any) => {
    const newCategory = Category.create(categoryData);
    await Category.save(newCategory);
    return newCategory;
};