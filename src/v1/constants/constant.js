export const createRecordInfo = (userId, userName, isUpdate = false) => {
  return {
    createdAt: Date.now(),
    updatedAt: isUpdate ? Date.now() : null,
    createdBy: { id: userId, name: userName, refModel:"users" },
    updatedBy: { id: isUpdate ? userId : null, name: isUpdate ? userName : null , refModel:"users" },
  }
};