# scatter-login-service

> scatter를 이용한 login sample

## tech stack

- scatterjs-core
- vue.js

#### test 화면

- http://localhost:8090/ 를 호출하면 브라우저에 스캐터 extension이 설치되었는지 먼저 체크합니다.
- 설치가 되어있으면 true 알람창이 뜬뒤 login page로 이동하고, 미설치시 'You need to install..' 창으로 이동합니다.

#### TODO

- scatter를 설치하지 않은 경우 login컴포넌트에 접근 못하도록 라우터 처리.
- getPublicKey api의 not function issue
- eos.updateauth : permission 변경 이슈 체크
- 기타 api test.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
