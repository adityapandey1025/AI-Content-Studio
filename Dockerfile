FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

COPY . .

ENV PORT=80
EXPOSE 80

CMD ["node", "backend/server.js"]

