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
    const container = document.getElementById("map"); //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };

    const map = new kakao.maps.Map(container, options);
    const imageSrc = `${process.env.PUBLIC_URL}/img/scrImg.png`;
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
