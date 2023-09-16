import { get, post } from "./request";

const buildData = (data) => {
  return new Promise((resolve, reject) => {
    resolve(data);
  });
};

export const checkModel = () => {
  return get("/check", {});
};

export const modelChoice = (model) => {
  return post("/model_choice", { model_name: model });
};

export const modelChoiceTest = (model) => {
  return buildData({ data: { result: "success" } });
};

export const chat = (prompt, modelName) => {
  return post("/chat", { prompt: prompt, model_name: modelName });
};

export const chatTest = (prompt) => {
  return buildData({
    data: {
      result:
        "i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result,i am result。",
      "relevant-chunk": "## i am relevant-chunk",
    },
  });
};

export const listFile = () => {
  return get("/load", {});
};

export const listFileTest = () => {
  return buildData({
    data: [
      { source: "./abc/def/hij/content1.md" },
      { source: "./abc/def/hij/content2.md" },
    ],
  });
};

export const deleteFile = (file) => {
  return post("/delete", { filename: file });
};

export const deleteFileTest = (file) => {
  return buildData({ data: { result: "success" } });
};

export const donwloadFile = (file) => {
  return post("/download", { filename: file });
};
