const lessonResponse = {
  _id: "",
  title: "",
  unitId: "",
  unitName: "",
  gradeId: "",
  gradeName: "",
  helps:[],
}
export const getALessonResponse = (lesson) => {
  var result = lessonResponse
  result._id = lesson._id
  result.title = lesson.title
  result.unitId = lesson.unit.id
  result.unitName = lesson.unit.name
  result.gradeId = lesson.grade.id
  result.gradeName = lesson.grade.name
  result.helps = lesson.helps
  return result
};