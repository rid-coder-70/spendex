import { Request, Response } from 'express';
import { CategoryModel } from '../models/Category';

export class CategoryController {

  static async getAll(req: Request, res: Response) {
    try {
      const type = req.query.type as 'expense' | 'income' | undefined;

      const categories = await CategoryModel.findAll(type);

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      console.error('Get categories error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch categories',
          code: 'FETCH_ERROR',
        },
      });
    }
  }


  static async getOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const category = await CategoryModel.findById(id);

      if (!category) {
        return res.status(404).json({
          success: false,
          error: {
            message: 'Category not found',
            code: 'NOT_FOUND',
          },
        });
      }

      res.json({
        success: true,
        data: category,
      });
    } catch (error: any) {
      console.error('Get category error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch category',
          code: 'FETCH_ERROR',
        },
      });
    }
  }


  static async create(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'NOT_AUTHENTICATED',
          },
        });
      }

      const { name, type, icon, color, keywords } = req.body;

      const categories = await CategoryModel.findAll();
      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );

      if (exists) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Category name already exists',
            code: 'CATEGORY_EXISTS',
          },
        });
      }

      const category = await CategoryModel.create({
        name,
        type,
        icon,
        color,
        keywords,
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error: any) {
      console.error('Create category error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create category',
          code: 'CREATE_ERROR',
        },
      });
    }
  }
}