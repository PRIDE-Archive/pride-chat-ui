import { get, post, resourceURL } from "./request";

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
  return post("/chat", { Chat: { prompt: prompt, model_name: modelName } });
};

export const saveProjectsQueryFeedback = (prompt, result, feedback) => {
  return post("/saveProjectsQueryFeedback",{Feedback: { query: prompt, answer: result, feedback: feedback  }});
};

export const chatPx = (prompt, modelName) => {
  return post("/chat_px", { Chat: { prompt: prompt, model_name: modelName } });
};

export const similarProjects = (data) => {
  return get("/similarProjects",{accessions: data});
};

export const saveBenchmark = (data) => {
  return post("/saveBenchmark", { Benchmark: data });
};

export const getBenchmark = (page_num = 0, items_per_page = 100) => {
  return get("/getBenchmark", { page_num, items_per_page });
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
  return get("/load", {}, { baseURL: resourceURL });
};

export const clearFiles = () => {
  return get("/delete_all", {}, { baseURL: resourceURL });
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
  return post("/delete", { filename: file }, { baseURL: resourceURL });
};

export const deleteFileTest = (file) => {
  return buildData({ data: { result: "success" } });
};

export const donwloadFile = (file) => {
  return get("/download", { filename: file }, { baseURL: resourceURL });
};

export const getTree = () => {
  return get("/get_tree", {}, { baseURL: resourceURL });
};
