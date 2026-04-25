# SkillShift Planner v14

Lightweight roster planner for small teams.

This version is set up as a PWA-ready web app:

- opens in desktop browsers on MacBook,
- works on iPad, iPhone, and Android browsers,
- can be installed to the home screen on supported devices,
- keeps data in `localStorage`,
- caches core files for offline reuse after the first load.

## Main updates in v9

- Employee labor hours are split into weekday (Mon–Fri), Saturday, and Sunday.
- Members screen has a Part filter that stays linked to Parts added/removed in the Parts / Stations tab.
- Confirmed roster is simplified for PDF output:
  - days across the top,
  - phases/time blocks down the side,
  - work displayed as `Station : Employee`,
  - unassigned work keeps the station name and leaves the employee name blank,
  - each actual Part prints on its own A4 landscape page.

## Files

- `index.html`
- `styles.css`
- `app.js`

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

If you want the next step after this, the natural upgrade is to port the same data model into `Expo + React Native` so the same app can later become a native iOS/Android app.

## Live Site

- GitHub Pages: https://melondressing.github.io/skillshift-planner/

## v12 update
Members 화면에서 직원별 Skill 추가/갱신 UI를 분리했습니다. 이제 Skill을 먼저 선택하고, 해당 Skill 안에 정의된 Level과 Step을 각각 선택해서 직원에게 추가할 수 있습니다. 기존처럼 추가된 Skill은 badge와 제거 버튼으로 유지됩니다.

## v14 update
PWA 설정을 추가해서 브라우저에서 바로 열 수 있고, 지원되는 기기에서는 홈 화면 설치도 가능하게 정리했습니다.
