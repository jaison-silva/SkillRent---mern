import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import Category from "../models/categoryModel";

class CategoryController {
  
  createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, description } = req.body;
      const category = await Category.create({ name, description });
      ApiResponse.success(res, { category }, { message: "Category created successfully" }, StatusCodes.CREATED);
    } catch (err) {
      next(err);
    }
  };

  getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
        Category.countDocuments()
      ]);

      ApiResponse.success(res, { categories }, { message: API_RESPONSES.SUCCESS, total }, StatusCodes.OK);
    } catch (err) {
      next(err);
    }
  };

  getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await Category.find({ isActive: true }).sort({ name: 1 });
      ApiResponse.success(res, { categories }, { message: API_RESPONSES.SUCCESS }, StatusCodes.OK);
    } catch (err) {
      next(err);
    }
  };

  deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.params.id;
      await Category.findByIdAndDelete(id);
      ApiResponse.success(res, null, { message: "Category deleted successfully" }, StatusCodes.OK);
    } catch (err) {
      next(err);
    }
  };
}

export default new CategoryController();
