import { useEffect } from "react";
import styled from "styled-components";

const { kakao } = window;

const Map = styled.div`
  width: 80%;
  height: 100vh;
  float: right;
`;

const App = () => {
  useEffect(() => {
    //const mapContainer = document.getElementById("map"); // 지도를 표시할 div
    /* const mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    }; */

    //const map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

    // 마커가 표시될 위치입니다
    //const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);

    // 마커를 생성합니다
    /* const marker = new kakao.maps.Marker({
      position: markerPosition,
    }); */

    // 마커가 지도 위에 표시되도록 설정합니다
    //marker.setMap(map);

    const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options);
    const imageSrc = `../img/scrImg.png`;
    const imageSize = new kakao.maps.Size(64, 69);

    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
    const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);

    const marker = new kakao.maps.Marker({
      position: markerPosition,

      image: markerImage, // 마커이미지 설정
    });

    marker.setMap(map);
  }, []);
  return (
    <>
      <Map id="map" />
    </>
  );
};
export default App;
