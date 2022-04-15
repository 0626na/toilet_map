const BASE_URL = "http://api.data.go.kr/openapi/tn_pubr_public_toilet_api";
const key = `%2F1wtW%2B7gGkadBPCLIOEHyd8Zl9k7kkypDM1goWeVJ0lx9hBtTc93sMeud2%2FoEeBqgZpxoalUdYBNL0%2FBYxggPQ%3D%3D`;
const dataType = "json";

export const toiletApi = (pageNumber, rows) => {
  const URL = `${BASE_URL}?serviceKey=${key}&numOfRows=${rows}&type=${dataType}&pageNo=${pageNumber}`;

  return fetch(URL).then((res) => res.json());
};

export const toiletCount = () => {
  const URL = `${BASE_URL}?serviceKey=${key}&numOfRows=1&type=${dataType}&pageNo=1`;
  return fetch(URL).then((res) => res.json());
};
