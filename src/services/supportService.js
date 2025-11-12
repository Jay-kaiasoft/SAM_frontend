import { setLoader } from "../actions/loaderActions";
import store from "../store";

const baseURL = process.env.REACT_APP_SUPPORT_BASE_URL;

const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT",
  "Content-Type": "application/json",
};

export const getSubmitRequestList = async (data) => {
  const options = {
    method: "GET",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  };
  try {
    store.dispatch(
      setLoader({
        load: true,
        text: "Please wait !!!",
      })
    );
    const requestUrl = baseURL + "/submitRequest/getSubmitRequestList?" + data;
    const responseStream = await fetch(requestUrl, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
    store.dispatch(
      setLoader({
        load: false,
      })
    );
  }
};

export const sendSubmitRequest = async (body) => {
  const options = {
    method: "POST",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(body),
  };
  try {
    store.dispatch(
      setLoader({
        load: true,
        text: "Please wait !!!",
      })
    );
    const requestUrl = baseURL + "/submitRequest/sendSubmitRequest";
    const responseStream = await fetch(requestUrl, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
    store.dispatch(
      setLoader({
        load: false,
      })
    );
  }
};

export const uploadFile = async (url, body) => {
  const options = {
    method: "POST",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify(body),
  };
  try {
    store.dispatch(
      setLoader({
        load: true,
        text: "Please wait !!!",
      })
    );
    const responseStream = await fetch(url, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
    store.dispatch(
      setLoader({
        load: false,
      })
    );
  }
};

export const deleteFile = async (url) => {
  const options = {
    method: "DELETE",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  };
  try {
    store.dispatch(
      setLoader({
        load: true,
        text: "Please wait !!!",
      })
    );
    const responseStream = await fetch(url, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
    store.dispatch(
      setLoader({
        load: false,
      })
    );
  }
};

export const getSubmitRequestDetails = async (data) => {
  const options = {
    method: "GET",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  };
  try {
    const requestUrl =
      baseURL + "/submitRequest/getSubmitRequestDetails?" + data;
    const responseStream = await fetch(requestUrl, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
  }
};

export const getSubmitRequestCount = async () => {
  const options = {
    method: "GET",
    headers: {
      ...headers,
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
  };
  try {
    store.dispatch(
      setLoader({
        load: true,
        text: "Please wait !!!",
      })
    );
    const requestUrl = baseURL + "/submitRequest/getSubmitRequestCount";
    const responseStream = await fetch(requestUrl, {
      ...options,
    });
    const response = await responseStream.json();
    return response;
  } catch (error) {
    console.log(`error while fetching`, error);
  } finally {
    store.dispatch(
      setLoader({
        load: false,
      })
    );
  }
};