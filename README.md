# React + TypeScript + Vite Template

## to run locally

1. install nodejs, but in case you want to hold multiple versions of nodejs:
  Option-1. install nvm [from git for example](https://github.com/nvm-sh/nvm), and then install nodejs from nvm. Then activate nodejs (installed version) through nvm
  Option-2. install bun [from official site for example](https://bun.sh/docs/installation). Then run `bun run <scriptname>`, where scriptname - use one of the commands from package.json in this project, "scripts" section. Use `key` not value. For example `bun run lint` for linting or `bun run dev`
2. OPTIONAL! to run project using chrome as main browser, you will need first install certificates for local https. 
  2.1. For mac its easy - install [mkcert](https://github.com/FiloSottile/mkcert) and then run `npm run cert`
  2.2. For windows its a little bit tricky. You will need install same tool `mkcert`, but look for binaries. Then, you will need to create folder `.cert` in this project's root. And then run `mkcert -key-file ./.cert/key.pem -cert-file ./.cert/cert.pem 'localhost'`. Basically its same that we have in `2.1.` instruction set, but its optimized for windows
  2.3. For windows with edge browser - it must work without configuration of SSL
3. Install packages
  3.1. for Bun, you can skip this part
  3.2. for nodejs - use `npm install` command in shell
4. Use `dev` command for you package manager to run locally this repo. `npm run dev` or `bun run dev` - both of them by default will run on `localhost:3000`
5. To use maps - register on mapbox and copy private key token to the `.env`
6. To use feedback form - fill in `.env` your email

## Whats inside project

### Data

1. All of the data for displayed venues is placed inside `./public/data.json`. Basically its main data storage for the App.
2. All of the data for venues is placed inside `./public/new-data.json`. It is kind of junk or mega-storage of everything, that is not parsed yet for `data.json`.
3. All of the modes for the App is in `./public/mode.json`. Data from here will be used to enable switcher between different map-modes. But in reality, each mode is basically tag, that will be used to filter out all other venues from visible area.
4. All of the search filters are placed in the `./public/filters.json`
5. Roadmap for the project is in the `./public/roadmap.json`. Maybe outdated from time to time

### Static files

For now, there are only favicon in the `./public/PortoIconTiny.png` and some backgrounds for light/dark theme in the `./src/assets`

### Frontend

in `./src` folder is main react application, that will render the app

### Backend

none for now

### Tooling

1. Scrapper in `./services/playwright-scrape`, `test` script work with bing maps
2. Scrapper in `./services/playwright-scrape`, `scrape` script work with gmaps - input url, output formatted json for `./public.data.json`
3. Scrapper in `./services/gmaps-scrapper-hono`, wip, must scrape from gmaps, but for now its not implemented
4. AI-agent prompt `./public/prompt.sample` to convert any data / freeform data to structured JSON for `./public/data.json`. Use it as system-prompt, and then send message with your scrapped data to convert it to correct format.