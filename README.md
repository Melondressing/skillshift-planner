# SkillShift Planner v16

Cross-platform roster planner for small teams.

This repository now has two layers:

- the root web app is a PWA-ready planner that runs in browsers on MacBook, iPad, iPhone, and Android,
- `mobile/` is an Expo scaffold for a native-style iOS/Android app and Expo Web.

The live web app is here:

- [Cloudflare Pages](https://skillshift-planner.pages.dev/)
- [GitHub Pages](https://melondressing.github.io/skillshift-planner/)

## Main updates in v9

- Employee labor hours are split into weekday (Mon–Fri), Saturday, and Sunday.
- Members screen has a Part filter that stays linked to Parts added/removed in the Parts / Stations tab.
- Confirmed roster is simplified for PDF output:
  - days across the top,
  - phases/time blocks down the side,
  - work displayed as `Station : Employee`,
  - unassigned work keeps the station name and leaves the employee name blank,
  - each actual Part prints on its own A4 landscape page.

## Web App

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `icon.svg`

## Run locally

Because this is a static app, open it through a local web server rather than `file://` so the service worker can register.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Install on mobile

- On iPhone or iPad: open the site in Safari and use Share -> Add to Home Screen.
- On Android: open the site in Chrome and use Install app / Add to Home screen.

## Deployment

You can upload the folder as a static site to Netlify, Vercel, GitHub Pages, or any static host.

## Mobile App

The Expo starter lives in `mobile/`.

```bash
cd mobile
npm install
npm run web
```

You can also run `npm run ios` or `npm run android` from inside `mobile/` once the Expo toolchain is installed.

If you want the next step after this, the natural upgrade is to port the same data model into `Expo + React Native` so the same app can later become a native iOS/Android app.

## Live Site

- GitHub Pages: https://melondressing.github.io/skillshift-planner/

## v12 update
Members 화면에서 직원별 Skill 추가/갱신 UI를 분리했습니다. 이제 Skill을 먼저 선택하고, 해당 Skill 안에 정의된 Level과 Step을 각각 선택해서 직원에게 추가할 수 있습니다. 기존처럼 추가된 Skill은 badge와 제거 버튼으로 유지됩니다.

## v14 update
PWA 설정을 추가해서 브라우저에서 바로 열 수 있고, 지원되는 기기에서는 홈 화면 설치도 가능하게 정리했습니다.

## v15 update
Expo 기반 `mobile/` 앱 뼈대와 웹/모바일 공용 샘플 상태 추출 스크립트를 추가했습니다.

## v16 update
기업별 로그인, 직원용 모바일 페이지, 초대코드 구조, 그리고 미래 기능용 데이터 슬롯(training / attendance / invitations / portal requests)을 준비했습니다. 설정 화면에는 회사명에서 자동 생성되는 회사 코드와 직원 포털 활성화 스위치도 넣었습니다.
