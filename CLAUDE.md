# NatureX Frontend

## 로컬 실행 (Docker)
```bash
docker compose up
```

## 로컬 실행 (직접)
```bash
npm install
npm run dev
```
→ http://localhost:3000

## 새 PC 셋업 (처음 한 번)
1. `.env.naturex-frontend.local` 파일 생성:
```
NEXT_PUBLIC_NATUREX_BACKEND=http://localhost:3001
JWT_SECRET=invalabdev2023!
```
2. `docker compose up` 또는 `npm run dev`

## 브랜치 전략
- `testing` 브랜치에서 작업
- PR을 통해 `main`에 merge

## 관련 레포
- 백엔드: https://github.com/dnsuql/NatureX_Back
