import CategoriesModel from "../models/categories.model.js";
import { calculatePageCount, errorResponse, successPaginationResponse, successResponse } from "../utils/response.js";


export const AddNewCategory = async (req, res) => {
  const { name,restaurantId } = req.body;
  try {
    const existingCategory = await findCategoryByName(name,restaurantId);
    if (existingCategory) {
      return res.status(400).json(errorResponse(400, "Category already exists", null));
    }
    const newCategory = await CategoriesModel.create(req.body);
    res.status(201).json(successResponse(newCategory._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};


export const AdminGetAllCategories = async (req, res) => {
  try {
    let { page = 1, size = 10, status, createdAt, updatedAt, name, sort, restaurantId } = req.body; 

    // Sử dụng giá trị của người dùng nếu có
    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const filter = {};

    if (status !== undefined) {
      filter.status = parseInt(status);
    }
    if (restaurantId !== undefined) {
      filter.restaurantId = restaurantId; 
    }

    if (name !== undefined) {
      filter.name = { $regex: name, $options: 'i' };
    }

    const skip = (page - 1) * size;

    let query = CategoriesModel.find(filter).skip(skip).limit(size);

    if (sort !== undefined && sort.nameField) {
      const sortOrder = sort.order === 'asc' ? 1 : -1;
      const sortObject = {};
      sortObject[sort.nameField] = sortOrder;
      query = query.sort(sortObject);
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const count = await CategoriesModel.countDocuments(filter);

    const categories = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);

    // Trả về phản hồi có thông tin phân trang
    const response = successPaginationResponse(categories, recordCount, page, size, pageCount);
    res.status(200).json(response); 
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};




export const AdminGetAllCategoriesByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    let { page = 1, size = 10 } = req.body; 

    // Sử dụng giá trị của người dùng nếu có
    if (req.body.page !== undefined) {
      page = parseInt(req.body.page);
    }
    if (req.body.size !== undefined) {
      size = parseInt(req.body.size);
    }

    const skip = (page - 1) * size;

    let query = CategoriesModel.find({restaurantId}).skip(skip).limit(size);

    const count = await CategoriesModel.countDocuments({restaurantId});

    const categories = await query;

    const recordCount = count;
    const pageCount = calculatePageCount(count, size);
    const response = successPaginationResponse(categories, recordCount, page, size, pageCount);
    res.status(200).json(successResponse(response));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};



export const UpdateCategory = async (req, res) => {
  const { _id } = req.params;
  const { name, restaurantId } = req.body;

  try {
    const existingCategory = await findCategoryByName(name, restaurantId);
    if (existingCategory && existingCategory._id.toString() !== _id) {
      return res.status(400).json(errorResponse(400, "Another category with the same name already exists", null));
    }

    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      _id,
      req.body,
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse(updatedCategory._id)); 
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};


export const DeleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const inactiveCategory = await CategoriesModel.findByIdAndUpdate(
      id,
      { status: process.env.DELETE },
      { new: true }
    );
    if (!inactiveCategory) {
      return res.status(404).json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse("Category inactive successfully")); 
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};

export const FindCategoryByName = async (name, restaurantId) => {
  try {
    const category = await CategoriesModel.findOne({ name, restaurantId });
    return category;
  } catch (error) {
    throw new Error(`Error finding category by name and restaurantId: ${error.message}`);
  }
};

export const AdminGetCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoriesModel.findById(id);
    if (!category) {
      return res.status(404).json(errorResponse(404, "Category not found", null));
    }
    res.status(200).json(successResponse(category)); 
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};


export const UserGetAllCategoryByRestaurantId = async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const categories = await CategoriesModel.find({restaurantId, status: process.env.ACTIVE });

    res.status(200).json(successResponse(categories));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
};
