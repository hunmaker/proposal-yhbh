# Proposal Web

프로포즈를 위한 cinematic one-page website.

## Stack
- React + TypeScript + Vite
- Framer Motion
- CSS
- Cloudinary-ready image data
- Vercel-ready

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## 사진 교체
`src/data/story.ts`의 `image` URL을 실제 사진 또는 Cloudinary delivery URL로 교체하세요.

예:
`https://res.cloudinary.com/YOUR_CLOUD/image/upload/f_auto,q_auto,w_1800/v1/proposal/01.jpg`

## 음악
샘플 BGM은 `public/music/proposal-bgm.mp3`에 포함되어 있습니다. 브라우저 자동재생 제한 때문에 사이트 진입 시 음악은 꺼져 있고 우측 상단 Music 버튼으로 켤 수 있습니다.

## BGM

- BGM 01: 기존 따뜻한 피아노 샘플
- BGM 02: 감동적인 피아노 데모 샘플
- 참고 후보: Pixabay의 `Romantic Emotional Piano` by PaulYudin. Pixabay Content License에서 무료 사용으로 표시된 곡이며, 실제 배포 전 라이선스 조건을 다시 확인하세요.
