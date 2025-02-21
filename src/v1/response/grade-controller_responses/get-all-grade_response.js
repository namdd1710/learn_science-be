const gradeResponse = {
  _id : "",
  name: "",
};

export const getAllGradesResponse = (grades) => {
  var result = [];
  for (let i = 0; i < grades.length; i++) {
    result.push({
      _id: grades[i]._id,
      name: grades[i].name,
    });
  }
  return result;
}