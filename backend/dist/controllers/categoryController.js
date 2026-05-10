"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const Category_1 = require("../models/Category");
class CategoryController {
    static async getAll(req, res) {
        try {
            const type = req.query.type;
            const categories = await Category_1.CategoryModel.findAll(type);
            res.json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
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
    static async getOne(req, res) {
        try {
            const id = Number(req.params.id);
            const category = await Category_1.CategoryModel.findById(id);
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
        }
        catch (error) {
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
    static async create(req, res) {
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
            const categories = await Category_1.CategoryModel.findAll();
            const exists = categories.some((cat) => cat.name.toLowerCase() === name.toLowerCase());
            if (exists) {
                return res.status(409).json({
                    success: false,
                    error: {
                        message: 'Category name already exists',
                        code: 'CATEGORY_EXISTS',
                    },
                });
            }
            const category = await Category_1.CategoryModel.create({
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
        }
        catch (error) {
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
exports.CategoryController = CategoryController;
//# sourceMappingURL=categoryController.js.map