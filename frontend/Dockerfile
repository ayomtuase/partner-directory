FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

ENV NODE_ENV=development

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
