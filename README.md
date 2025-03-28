# ISO List
Minimal boilerplate nextjs project. Includes backend, client, dev-proxy, nginx & docker-compose pack. Powered by cookies with full SSR support.

![preview](https://raw.githubusercontent.com/friktor/next-light-list-boilerplate/main/media/screenshot.jpg)

**Stack**

NextJS 15, Fastify, PostgreSQL, Docker Compose, Jest, Nginx.

HTTPS support "out of box".

## Development
Install all common dependencies for backend & client.

``` bash
npm install --prefix ./backend
npm install --prefix ./client
```

Create core `.env` configs from `.env.sample` from backend & client folders.

``` bash
cp ./backend/.env.sample ./backend/.env
cp ./client/.env.sample ./client/.env
```

### Running

**Database**

``` bash
# Database
docker compose up database
```

**Backend**

``` bash
# Base
cd backend/
npm run build && npm start

# OR
# Container
docker compose up backend
```

Also you can run tests - for that:

``` bash
cd backend/

# setup test env
cp .env .env.test
# start e2e tests with jest
npm run test 
```

**Client**

``` bash
# Base (with http-proxy-middleware)
cd client/
npm run dev

# OR
# Container
docker compose up client
```

**Setup development proxy**
At now app requires domain for correct cookie work, install [localias](https://github.com/peterldowns/localias).

```
# its edit /etc/hosts
localias set frontend.test 3000
# running proxy later from 3000 port of nextjs client
localias run
```

**With local nginx proxy**
For local testing all with nginx container - you need configure certificates, for that use [mkcert](https://github.com/FiloSottile/mkcert).

By default nginx image configured for proxy certs from `/etc/ssl`. 

Make sure you have `127.0.0.1  frontend.test` in your `/etc/hosts`.

``` bash
# init mkcert root before
mkcert -install

# Generate & copy certs to /etc/ssl
mkdir nginx/certs && \
mkcert -key-file ./nginx/certs/frontend.test.key -cert-file ./nginx/certs/frontend.test.crt frontend.test && \
sudo cp ./nginx/certs/* /etc/ssl && rm -rf ./nginx/certs
```

Next we need build actual nginx image from config template.

``` bash
docker build -t nginx:latest -f nginx/Dockerfile nginx
```

And run it:

``` bash
docker compose up nginx
```

Now you can view app on `https://frontend.test/`.
