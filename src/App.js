import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { toiletApi } from "./api";
import "./App.css";
import { InitStyle } from "./reset";

const { kakao } = window;

const Map = styled.div`
  width: 70%;
  height: 100vh;
  float: right;
  position: relative;
`;

const ListContainer = styled.div`
  width: 30%;
  height: 100vh;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
`;
const ToiletList = styled.div`
  width: 100%;
  height: 83%;
`;

const Headertitle = styled.div``;

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
  background-color: white;
  left: 40%;
  top: 90%;
  z-index: 10;
  cursor: pointer;
  padding: 10px;
  border-radius: 20px;
`;

const CurrentPosition = styled.div`
  position: absolute;

  top: 10%;
  left: 1%;
  width: 25px;
  height: 25px;
  border: transparent;
  border-radius: 2px;
  margin-top: 10px;
  margin-left: 10px;
  z-index: 10;
  cursor: pointer;
`;

const MapTitle = styled.h1`
  padding-top: 10px;
  padding-left: 5px;
  color: white;
  font-size: 30px;
`;
const MapDes = styled.span`
  padding-top: 10px;
  padding-left: 5px;
  color: white;
`;
const MapHeader = styled.div`
  background-color: #268fff;
  height: 15%;
  display: flex;
`;

// 화장실 세부정보 인포 커스텀오버레이
const infoOverlay = new kakao.maps.CustomOverlay({
  clickable: true,
  xAnchor: 0.5,
  yAnchor: 1.9,
});

const locationSuccess = async (currentPosition) => {
  // 지도의 초기설정
  const mapOption = {
    center: new kakao.maps.LatLng(
      currentPosition.coords.latitude,
      currentPosition.coords.longitude
    ),
    level: 2,
  };

  const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
  const totalToilet = document.querySelector("#totalToilet");
  const search = document.querySelector("#currentSearch");
  const toiletList = document.querySelector("#list");
  const currentBtn = document.querySelector("#currentPosition");
  const map = new kakao.maps.Map(container, mapOption); //지도 초기화

  const position = new kakao.maps.LatLng(
    currentPosition.coords.latitude,
    currentPosition.coords.longitude
  );
  // 현재 내위치
  const myMarker = new kakao.maps.Marker({
    position,
    map,
  });
  currentBtn.addEventListener("click", () => {
    map.setCenter(position);
  });

  //화장실 위치표시 코드
  let toiletMarkers = [];
  const toiletCount = await getToiletCount();

  const pageCount = Math.ceil(toiletCount / 200); // api 실행횟수

  //화장실 마커 이미지 변경
  const toiletImgSrc =
    "https://blog.kakaocdn.net/dn/QG4Wl/btqIPZexSQ1/YM7lxTCD1dCIsO5V3y51VK/img.png";
  const imageSize = new kakao.maps.Size(30, 30);
  const markerImg = new kakao.maps.MarkerImage(toiletImgSrc, imageSize);

  kakao.maps.event.addListener(map, "click", () => {
    infoOverlay.setMap(null);
  });
  //지도에 화장실 마커 표시
  for (let i = 0; i < pageCount; i++) {
    toiletApi(i, 200).then((toiletData) => {
      toiletData.response.body.items.map((toilet) => {
        const toiletMarker = {
          marker: new kakao.maps.Marker({
            position: new kakao.maps.LatLng(toilet.latitude, toilet.longitude),
            title: toilet.toiletNm,
            image: markerImg,
          }),
          title: toilet.toiletNm,
          position: new kakao.maps.LatLng(toilet.latitude, toilet.longitude),
          address: toilet.rdnmadr,
          addressLnNumber: toilet.lnmadr,
          insutitution: toilet.institutionNm,
          phoneNumber: toilet.phoneNumber,
          openTime: toilet.openTime,
          latitude: toilet.latitude,
          longitude: toilet.longitude,
        };

        // 화장실 마커 클릭시 나타나는 커스텀 오버레이 설정
        kakao.maps.event.addListener(toiletMarker.marker, "click", () => {
          const content = document.createElement("div");
          const roadViewBtn = document.createElement("button");
          roadViewBtn.className = "roadViewBtn";

          roadViewBtn.addEventListener("click", () => {
            window.open(
              `https://map.kakao.com/link/roadview/${toilet.latitude},${toilet.longitude}`
            );
          });

          content.innerHTML = `<span class="toiletOverlayTitle">${toilet.toiletNm}</span>`;
          content.className = "toiletInfo";
          content.appendChild(roadViewBtn);

          const markerPosition = toiletMarker.marker.getPosition();

          const samePosition =
            infoOverlay.getPosition().latitude === markerPosition.latitude &&
            infoOverlay.getPosition().longitude === markerPosition.longitude;

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
  const currentBtnImage = `<img width=25px height=25px class="currentBtnImg"
  src=https://w7.pngwing.com/pngs/392/88/png-transparent-computer-icons-location-google-maps-location-icon-map-symbol-material-design-thumbnail.png />`;

  totalToilet.innerHTML = toiletTotal;
  search.innerHTML = searchButton;
  currentBtn.innerHTML = currentBtnImage;

  search.addEventListener("click", () =>
    markerLimit(map, toiletMarkers, toiletList)
  );
};

//현재 보이는 지도에만 마커 표시
const markerLimit = (map, toiletMarkers, list) => {
  let currentToilets = [];
  let markerCountInMap = 0;
  const currentArea = map.getBounds();
  toiletMarkers.map((toilet) => {
    if (
      currentArea.contain(toilet.marker.getPosition()) &&
      markerCountInMap <= 100
    ) {
      toilet.marker.setMap(map);
      currentToilets.push(toilet);
      markerCountInMap++;
    } else {
      toilet.marker.setMap(null);
    }
  });

  list.innerHTML = "";
  currentToilets.map((toilet) => {
    if (toilet) {
      const element = `
      <div class="toiletlistInfo">
      <span class="toiletTitle">${toilet.title}</span>
      <span>${toilet.address} </span>
      ${
        toilet.addressLnNumber
          ? `<span>(지번:${toilet.addressLnNumber} )</span>`
          : ""
      }
      <div class="toiletManager">
        <span>관리: ${toilet.insutitution}</span>
        <span class="phoneNumber">${toilet.phoneNumber}</span>
      </div>
      </div>
      
    `;

      const divInlist = document.createElement("div");
      const buttonContainer = document.createElement("div");
      const roadButton = document.createElement("button");
      const roadViewBtnInlist = document.createElement("button");

      divInlist.className = "toiletListCointainer";
      roadViewBtnInlist.className = "roadViewBtn";
      roadButton.className = "roadBtn";
      divInlist.innerHTML = element;
      buttonContainer.className = "routeBtn";
      buttonContainer.appendChild(roadButton);
      buttonContainer.appendChild(roadViewBtnInlist);
      divInlist.appendChild(buttonContainer);

      roadViewBtnInlist.addEventListener("click", () => {
        window.open(
          `https://map.kakao.com/link/roadview/${toilet.latitude},${toilet.longitude}`
        );
      });

      divInlist.addEventListener("mouseover", () => {
        const content = document.createElement("div");
        const roadViewBtn = document.createElement("button");
        roadViewBtn.className = "roadViewBtn";

        roadViewBtn.addEventListener("click", () => {
          window.open(
            `https://map.kakao.com/link/roadview/${toilet.latitude},${toilet.longitude}`
          );
        });

        content.innerHTML = `<span class="toiletOverlayTitle">${toilet.title}</span>`;
        content.className = "toiletInfo";
        content.appendChild(roadViewBtn);
        infoOverlay.setMap(null);
        infoOverlay.setContent(content);
        infoOverlay.setPosition(toilet.marker.getPosition());
        infoOverlay.setMap(map);
      });
      divInlist.addEventListener("mouseout", () => {
        infoOverlay.setMap(null);
      });
      divInlist.addEventListener("click", () => {
        map.setCenter(toilet.position);
        map.setLevel(2);
      });
      roadButton.addEventListener("click", () => {
        window.open(
          `	https://map.kakao.com/link/to/${toilet.title},${toilet.latitude},${toilet.longitude}`
        );
      });

      list.appendChild(divInlist);
    }
  });
};

const getToiletCount = async () => {
  const toiletObj = await toiletApi(1, 10);
  const count = toiletObj.response.body.totalCount;
  return count;
};

const App = () => {
  const [mapLoading, setLoading] = useState(true);

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
    setLoading(false);
  }, []);

  return (
    <>
      <Helmet title="🚽 Toilet Map" />
      {mapLoading ? null : (
        <>
          <InitStyle />
          <Map id="map">
            <Totaltoilet id="totalToilet" />
            <CurrentPosition id="currentPosition"></CurrentPosition>
            <CurrentSearch id="currentSearch" />
          </Map>

          <ListContainer>
            <MapHeader>
              <Headertitle>
                <MapTitle>Toilet Map</MapTitle>{" "}
                <MapDes>화장실 위치 로드하는데 시간이 조금 필요합니다.</MapDes>
              </Headertitle>
            </MapHeader>

            <ToiletList id="list" className="toiletList"></ToiletList>
          </ListContainer>
        </>
      )}
    </>
  );
};

export default App;
