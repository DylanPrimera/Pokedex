<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Steps to excecute

1. Clone the repository
2. You must have Nest CLI installed
```
pnpm i -g @nestjs/cli
```
3. Run 
``` 
pnpm install
```
4. Setup the DB
```
docker-compose up -d
```
5. Clone the file ```.env.template``` and rename the copy for ```.env```

6. Run the API with
```
pnpm start:dev
```
7. To charge the DB with data run in Postman
```
localhost:3000/api/v1/seed
```

## Stack
* MongoDB
* Nest
* Docker