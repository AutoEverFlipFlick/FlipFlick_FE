# 1) 빌드 스테이지: Vite + React 앱을 빌드
FROM node:20-alpine AS builder
WORKDIR /app

# 의존성 설치
COPY package*.json ./
RUN npm ci

# 소스 복사 및 프로덕션용 번들 생성
COPY . .
RUN npm run build

# 2) 프로덕션 스테이지: NGINX로 정적 파일 서빙
FROM nginx:stable-alpine

# 기본 default.conf 제거
RUN rm /etc/nginx/conf.d/default.conf

# SPA용 커스텀 Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/app.conf

# 빌드 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# HTTP 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
