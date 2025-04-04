const lessonItemInUnit =()=>( {
  id: "",
  title: "",
  image:""
});
const unitResponse =()=> ({
  _id: "",
  name: "",
  grade: {
    id: "",
    name: "",
  },
  image: "",
  lessons: [],
  videos: [],
  quizId:null
});
export { unitResponse, lessonItemInUnit };
