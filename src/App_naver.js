import { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";
import { toiletApi } from "./api";

const { naver } = window;

const Map = styled.div`
  width: 80%;
  height: 100vh;
  float: right;
`;
const InfoList = styled.div`
  width: 20%;
  height: 100vh;
`;

const ToiletInfo = styled.div``;

const MarkerInfo = styled.div`
  color: "red";
`;
const Btn = styled.button``;

function App() {
  const [map, setMap] = useState(null);
  const [toiletlist, setList] = useState([]);
  const [location, setLoc] = useState(null);

  //지도 초기화
  useEffect(() => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };
      navigator.geolocation.getCurrentPosition(
        async (current) => {
          const nowLocation = {
            latitude: current.coords.latitude,
            longitude: current.coords.longitude,
          };
          setLoc(nowLocation);

          //네이버 지도 초기 설정
          const container = document.querySelector("#map");
          let mapOptions;
          mapOptions = {
            center: new naver.maps.LatLng(
              nowLocation.latitude,
              nowLocation.longitude
            ),
            zoomControl: true,
            zoomControlOptions: {
              style: naver.maps.ZoomControlStyle.SMALL,
              position: naver.maps.Position.RIGHT_TOP,
            },
            scaleControl: false,
            logoControl: true,
            logoControlOptions: {
              position: naver.maps.Position.LEFT_BOTTOM,
            },
            mapDataControl: false,

            zoom: 10,
          };

          //화장실 위치 표시
          const map = new naver.maps.Map(container, mapOptions);
          const currentPositionButton = `<div class="currentPositionStyle"><img class="currentPosition" src="position.png"/></div>`;
          const currentPosition = new naver.maps.CustomControl(
            currentPositionButton,
            {
              position: naver.maps.Position.BOTTOM_RIGHT,
            }
          );
          naver.maps.Event.once(map, "init", function () {
            currentPosition.setMap(map);
          });
          const myMarker = new naver.maps.Marker({
            position: new naver.maps.LatLng(
              nowLocation.latitude,
              nowLocation.longitude
            ),
            map,
          });

          let markers = [];
          const totalObj = await toiletApi(1, 10);
          const total = Math.round(totalObj.response.body.totalCount);

          for (let i = 0; i < Math.round(total / 400); i++) {
            toiletApi(i, 400).then((data) =>
              data.response.body.items.map((item) => {
                const toiletMarker = new naver.maps.Marker({
                  position: new naver.maps.LatLng(
                    item.latitude,
                    item.longitude
                  ),
                  icon: {
                    url: `../img/toilet.png`,
                  },
                  title: item.toiletNm,
                });
                markers.push(toiletMarker);
              })
            );
          }

          naver.maps.Event.addListener(map, "dragend", function () {
            updateMarker(map, markers);
          });
          naver.maps.Event.addListener(map, "zoom_changed", () => {
            updateMarker(map, markers);
          });

          setMap(map);
        },
        null,
        options
      );
    } else {
      console.log("위치를 찾을수 없습니다.");
    }
  }, []);

  const updateMarker = (map, markers) => {
    const bounds = map.getBounds();
    let markerCount = 0;

    markers.map((marker, i) => {
      const position = marker.getPosition();

      if (bounds.hasLatLng(position) && markerCount < 50) {
        showMarker(map, marker);
        markerCount++;
      } else {
        hideMarker(map, marker);
      }
    });
  };

  const markerVisible = (info, marker, map) => {
    if (!info.getMap()) {
      info.open(map, marker);
    }
  };

  const markerInvisible = (info) => {
    info.close();
  };

  const showMarker = (map, marker) => {
    if (marker.setMap()) return;
    marker.setMap(map);
  };

  const hideMarker = (map, marker) => {
    if (!marker.setMap()) return;
    marker.setMap(null);
  };

  const returnCurrent = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentMap = new naver.maps.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
        map.setCenter(currentMap);
      },
      (error) => console.log(error.message)
    );
  };

  return (
    <>
      <Map id="map" />
      <InfoList>
        <Btn onClick={returnCurrent}>현재위치로</Btn>
        <Btn>지도리스트</Btn>
      </InfoList>
    </>
  );
}

export default App;
