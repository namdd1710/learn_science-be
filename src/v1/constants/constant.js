export const createRecordInfo = (userId, userName) => {
  return {
    createdAt: Date.now(),
    updatedAt: null,
    createdBy: { id: userId, name: userName, refModel: "users" },
    updatedBy: {
      id: null,
      name: null,
      refModel: "users",
    },
  };
};

export const updateRecordInfo = (recordInfo, updaterId, updaterName) => {
  return {
    createdAt: recordInfo.createdAt,
    updatedAt: Date.now(),
    createdBy: recordInfo.createdBy,
    updatedBy: { id: updaterId, name: updaterName, refModel: "users" },
  };
};

export const createForeignKey = (id, name, refModel) => {
  return {
    id: id,
    name: name,
    refModel: refModel,
  };
};

export const foreignKeyType = {
  id: "",
  name: "",
  refModel: "",
};

export const questionStatus = {
  QUESTION_ACTIVE_STATUS: 1,
  QUESTION_INACTIVE_STATUS: 0,
  QUESTION_DELETE_STATUS: 2,
};

export const lessonStatus = {
  LESSON_INACTIVE_STATUS: 0,
  LESSON_ACTIVE_STATUS: 1,
  LESSON_DELETE_STATUS: 2,
};

export const unitStatus = {
  UNIT_INACTIVE_STATUS: 0,
  UNIT_ACTIVE_STATUS: 1,
  UNIT_DELETE_STATUS: 2,
};
