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

export const quizStatus ={
  QUIZ_INACTIVE_STATUS: 0,
  QUIZ_ACTIVE_STATUS: 1,
}

export const achievementType = {
  ACHIEVEMENT_COMMON : 1,
  ACHIEVEMENT_MULTIPLE : 2,
}
export const achievementStatus = {
  ACHIEVEMENT_INACTIVE_STATUS : false,
  ACHIEVEMENT_ACTIVE_STATUS : true
}
export const achievementMenu = {
  ACHIEVEMENT_LESSON_MENU : 1,
}

export const lessonHelpType = {
  LESSON_HELP_START_TYPE:1,
  LESSON_HELP_BOOST_TYPE:2,
  LESSON_HELP_END_TYPE:3
}

export const userAchievementType = {
  USER_ACHIEVEMENT_LESSON_TYPE:1
}
export const userAchievementDifficulty = {
  START:1,
  BOOST:2,
  END:3
}

export const achievementId = {
  BRONZE_EGG_ACHIEVEMENT_ID: "67f0c707941a785c8faaa0ba",
  SILVER_EGG_ACHIEVEMENT_ID: "67f0c713941a785c8faaa0bc",
  GOLD_EGG_ACHIEVEMENT_ID: "67f0c71e941a785c8faaa0be",
}
