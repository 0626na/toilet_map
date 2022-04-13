export const toiletApi = async (pageNumber, rows) => {
  const BASE_URL = "http://api.data.go.kr/openapi/tn_pubr_public_toilet_api";
  const key = `%2F1wtW%2B7gGkadBPCLIOEHyd8Zl9k7kkypDM1goWeVJ0lx9hBtTc93sMeud2%2FoEeBqgZpxoalUdYBNL0%2FBYxggPQ%3D%3D`;

  const dataType = "json";

  const URL = `${BASE_URL}?serviceKey=${key}&numOfRows=${rows}&type=${dataType}&pageNo=${pageNumber}`;

  return fetch(URL).then((res) => res.json());
};
