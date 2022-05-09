# 화장실 맵
https://0626na.github.io/toilet_map/

정부에서 제공하는 open api를 이용하여 전국의 화장실의 위치를 표시해주는 지도 서비스입니다.

지도를 이용한 프론트엔드 프로젝트를 해보고싶다고 고민하던 차에 화장실 데이터를 제공하는 open api를 보고 시작하게 되었습니다.

## 기술스택

- react
- javascript
- HTML5/CSS3


## 구현한 기능

- 현재 내위치

![toilet_map_position](https://user-images.githubusercontent.com/20428574/167362851-99f30e74-9550-479e-b678-7961fb1c2a66.gif)

- 화장실 목록 클릭시 해당 위치로 이동

![toilet_map3](https://user-images.githubusercontent.com/20428574/167385208-06f31f5a-e61b-4848-a936-0f4797691f26.gif)


- 현재 보여지는 지도에서의 화장실 위치 표시 및 세부정보 표시

![toilet_map2](https://user-images.githubusercontent.com/20428574/167365957-72ff3a04-a2b1-4b00-87f2-ce6b050ee29f.gif)

- 화장실의 로드뷰 및 지도 도착지 설정

![toilet_map4](https://user-images.githubusercontent.com/20428574/167386962-e0c0f982-c56c-46b3-ac90-4ae536ad6bad.gif)


## 해결하지 못한 부분
- 화장실 위치 데이터의 로딩이 약 8분에서 10분 정도 걸립니다. 데이터들을 로딩하는 문제를 고민했지만, 빠르게 모든 데이터를 불러오는 방법을 찾지 못했습니다. 현재로써는 현재 보고있는 지도의 부분에만 화장실 데이터를 표시하고 그외에 부분은 로딩만 하고 불러오지 않는 식으로 하여, 해결 하였습니다. 약 3만여건의 데이터를 불러오기에 로딩이 오래걸린다는 문제가 있습니다. 
