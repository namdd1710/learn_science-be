import gradeModel from "../models/grade.model.js";


export const AddNewGrade = async (req, res) => {
  const {name} = req.body;
  try {
    const existingGrade = await findGradeByName(name);
    if (existingGrade) {
      return res.status(400).json(errorResponse(400, "Grade already exists", null));
    }
    const newGrade = await gradeModel.create(req.body);
    res.status(201).json(successResponse(newGrade._id));
  } catch (error) {
    res.status(500).json(errorResponse(500, error.message, null));
  }
}

export const findGradeByName = async (name) => {
  try {
    const grade = await gradeModel.findOne({name});
    return grade;
  } catch (error) {
    throw new Error(`Error finding grade by name: ${error.message}`);
  }
}