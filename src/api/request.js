import axios from "axios";

export const baseURL = "http://hh-rke-wp-webadmin-44-worker-5.caas.ebi.ac.uk:31434";
export const resourceURL = "http://hh-rke-wp-webadmin-44-worker-5.caas.ebi.ac.uk:31434";
const server = axios.create({
    baseURL: baseURL,
    timeout: 120000,
});

export const get = (url, params, config = {}) => {
    return server.get(url, {params, ...config});
};
export const post = (url, data, config = {}) => {
    return server.post(url, JSON.stringify(data), {
        headers: {"Content-Type": "application/json"}, ...config
    });
};

export const chatStream = async (url,  data,item, callBack) => {
    const response = await fetch(resourceURL + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Network response was not ok");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulatedText = '';
    let isFinalJson = false;

    while (true) {
        const {done, value} = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, {stream: true});
        accumulatedText += chunk;

        if (chunk.includes('}')) {
            isFinalJson = true;
            break;
        }

      callBack(accumulatedText)

    }

    item.time_ms = 0;

    if (isFinalJson) {
        const jsonStartIndex = accumulatedText.lastIndexOf("{");
        const finalJson = accumulatedText.slice(jsonStartIndex);
        const res = JSON.parse(finalJson);

        item.query = data.query
        item.result = res.result;
        item.time_ms = res.elapsed_time * 1000,
        item.relevant = res.relevant_doc;
    }
    return item;
};