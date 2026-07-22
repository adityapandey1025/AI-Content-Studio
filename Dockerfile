FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
RUN npm --prefix backend install --omit=dev

COPY . .

EXPOSE 3000

CMD ["node", "backend/server.js"]

