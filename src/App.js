import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { toiletApi } from "./api";
import "./App.css";
const { kakao } = window;

const Map = styled.div`
  width: 80%;
  height: 100vh;
  float: right;
  position: relative;
`;
const ToiletList = styled.div`
  width: 20%;
  height: 100vh;
`;

const Totaltoilet = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 10;
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  box-shadow: 1px 1px 2px black;
  opacity: 0.7;
`;

const CurrentSearch = styled.div`
  position: absolute;
  background-color: #a5d1f2;
  left: 40%;
  top: 90%;
  z-index: 10;
  cursor: pointer;
  padding: 10px;
  border-radius: 20px;
`;

const locationSuccess = async (currentPosition) => {
  // 지도의 초기설정
  const mapOption = {
    center: new kakao.maps.LatLng(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude
    ),
    level: 3,
  };

  const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
  const totalToilet = document.querySelector("#totalToilet");
  const search = document.querySelector("#currentSearch");
  const map = new kakao.maps.Map(container, mapOption); //지도 초기화

  // 현재 내위치
  const myMarker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude
    ),
    map,
  });

  //화장실 위치표시 코드
  let toiletMarkers = [];
  const toiletCount = await getToiletCount();

  const pageCount = Math.ceil(toiletCount / 200); // api 실행횟수

  //화장실 마커 이미지 변경
  const toiletImgSrc =
    "https://blog.kakaocdn.net/dn/QG4Wl/btqIPZexSQ1/YM7lxTCD1dCIsO5V3y51VK/img.png";
  const imageSize = new kakao.maps.Size(20, 20);
  const markerImg = new kakao.maps.MarkerImage(toiletImgSrc, imageSize);

  const infoOverlay = new kakao.maps.CustomOverlay({
    xAnchor: 0.5,
    yAnchor: 1.5,
  });

  kakao.maps.event.addListener(map, "click", () => {
    infoOverlay.setMap(null);
  });
  //지도에 화장실 마커 표시
  for (let i = 0; i < pageCount; i++) {
    toiletApi(i, 200).then((toiletData) => {
      toiletData.response.body.items.map((toilet) => {
        const toiletMarker = new kakao.maps.Marker({
          position: new kakao.maps.LatLng(toilet.latitude, toilet.longitude),
          title: toilet.toiletNm,
          image: markerImg,
        });

        // 화장실 마커 클릭시 나타나는 인포윈도우 설정
        kakao.maps.event.addListener(toiletMarker, "click", () => {
          const content = `<div class="toiletInfo" style={background-color:green}>
             <span>${toilet.toiletNm}</span>
             <span>주소: ${toilet.rdnmadr}</span>
             <span>${toilet.phoneNumber}</span>
          </div>`;

          const markerPosition = toiletMarker.getPosition();

          const samePosition =
            infoOverlay.getPosition().latitude === markerPosition.latitude &&
            infoOverlay.getPosition().longitude === markerPosition.longitude;
          console.log(samePosition);
          if (infoOverlay.getMap() && samePosition) {
            infoOverlay.setMap(null);
          } else {
            infoOverlay.setMap(null);
            infoOverlay.setContent(content);
            infoOverlay.setPosition(markerPosition);
            infoOverlay.setMap(map);
          }
        });

        toiletMarkers.push(toiletMarker);
      });
    });
  }

  const toiletTotal = `
  <span>화장실 맵</span>
  <span>전국 화장실 갯수:${toiletCount} </span>
  `;
  const searchButton = `<span>현 위치에서 화장실 검색</span>`;

  totalToilet.innerHTML = toiletTotal;
  search.innerHTML = searchButton;

  search.addEventListener("click", () => markerLimit(map, toiletMarkers));
};

//현재 보이는 지도에만 마커 표시
const markerLimit = (map, toiletMarkers) => {
  let markerCountInMap = 0;
  const currentArea = map.getBounds();
  toiletMarkers.map((toilet) => {
    if (currentArea.contain(toilet.getPosition()) && markerCountInMap <= 100) {
      toilet.setMap(map);
      markerCountInMap++;
    } else {
      toilet.setMap(null);
    }
  });
};

const getToiletCount = async () => {
  const toiletObj = await toiletApi(1, 10);
  const count = toiletObj.response.body.totalCount;
  return count;
};

const App = () => {
  const [mapLoading, setLoading] = useState(false);

  useEffect(() => {
    const locationOption = {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000,
    };
    navigator.geolocation.getCurrentPosition(
      locationSuccess,
      () => console.log("지도 로딩에 실패했습니다."),
      locationOption
    );
  }, []);

  return (
    <>
      <Map id="map">
        <Totaltoilet id="totalToilet" />
        <CurrentSearch id="currentSearch" />
      </Map>
      <ToiletList>닐스</ToiletList>
    </>
  );
};

export default App;
