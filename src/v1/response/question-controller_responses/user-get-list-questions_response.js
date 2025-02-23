import { questionPromptType, questionTemplateType, questionType } from "../question-controller_responses/index_response.js";

const questionResponse = {
  _id: "",
  question: questionType,
  template: questionTemplateType,
  prompt: questionPromptType,
}

export const userGetListQuestionsResponse = (questions) => {
  var result = []

  for (let i = 0; i < questions.length; i++) {
    result.push({
      _id: questions[i]._id,
      template: questions[i].template,
      prompt: questions[i].prompt,
      question: questions[i].question,
      explanation: questions[i].explanation
    });
  }
  return result
}