export type Memory = {
  place: string;
  title: string;
  text: string;
  images: string[];
  alt: string;
};

export const beginningImage = '/images/first-meeting.webp';

export const memories: Memory[] = [
  {
    place: 'ULJIN',
    title: '처음 함께 떠났던 여행',
    text: '처음 함께 떠났던 그날부터 우리의 평범한 하루에는 조금씩 새로운 장면들이 생겼어.',
    images: [
      '/images/uljin-first_01.webp',
      '/images/uljin-first_02.webp',
      '/images/uljin-first_03.webp',
      '/images/uljin-first_04.webp',
    ],
    alt: '함께 떠난 여행의 순간',
  },
  {
    place: 'NHA TRANG',
    title: '처음 함께 본 낯선 풍경',
    text: '새로운 곳에 갈 때마다 풍경보다 현이의 표정을 더 많이 보게 됐어. 그래서 여행은 늘 현이로 기억돼.',
    images: [
      '/images/nhatrang_01.webp',
      '/images/nhatrang_02.webp',
      '/images/nhatrang_03.webp',
      '/images/nhatrang_04.webp',
    ],
    alt: '바다와 여행 풍경',
  },
  {
    place: 'GUNSAN',
    title: '별것 없는 하루도 함께라 좋았고',
    text: '특별한 계획이 없어도 같이 걷고, 먹고, 웃는 것만으로 하루가 충분히 좋아졌어.',
    images: [
      '/images/gunsan_01.webp',
      '/images/gunsan_02.webp',
      '/images/gunsan_03.webp',
      '/images/gunsan_04.webp',
    ],
    alt: '함께 걷고 싶은 일상의 풍경',
  },
  {
    place: 'JEJU',
    title: '함께라서 더 선명했던 계절',
    text: '좋은 풍경을 보면 제일 먼저 현이가 생각나는 사람이 되었어. 좋은 건 같이 보고 싶으니까.',
    images: [
      '/images/jeju_01.webp',
      '/images/jeju_02.webp',
      '/images/jeju_03.webp',
      '/images/jeju_04.webp',
    ],
    alt: '제주에서 함께 바라본 풍경',
  },
  {
    place: 'FUKUOKA',
    title: '새로운 곳도 현이와 함께라면',
    text: '처음 보는 도시에서도 우리는 금방 우리만의 하루를 만들었지. 그래서 어디든 함께 가고 싶어졌어.',
    images: [
      '/images/fukuoka_01.webp',
      '/images/fukuoka_02.webp',
      '/images/fukuoka_03.webp',
      '/images/fukuoka_04.webp',
    ],
    alt: '함께 떠난 도시 여행',
  },
  {
    place: 'ULJIN AGAIN',
    title: '다시 찾은 곳, 달라진 우리',
    text: '같은 곳에 다시 왔는데 그 사이 우리는 훨씬 많은 이야기를 갖게 되었어. 앞으로도 그랬으면 좋겠어.',
    images: [
      '/images/uljin-again_01.webp',
      '/images/uljin-again_02.webp',
      '/images/uljin-again_03.webp',
      '/images/uljin-again_04.webp',
   ],
    alt: '다시 바라보는 여행의 풍경',
  },
];

export const futureCards = [
  { label: '다음 여행', text: '아직 가보지 못한 곳을 함께 찾아가기' },
  { label: '평범한 하루', text: '아무것도 하지 않아도 함께 웃을 수 있는 하루' },
  { label: '우리의 집', text: '하루의 끝에 서로를 기다리는 공간' },
  { label: '앞으로의 계절', text: '봄, 여름, 가을, 겨울을 계속 함께하기' },
];
