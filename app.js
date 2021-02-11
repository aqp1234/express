const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');
const nunjucks = require('nunjucks');

dotenv.config();
const indexRouter = require('./routes');
const userRouter = require('./routes/user');
const app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname + 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

app.use('/', indexRouter);
app.use('/user', userRouter);

/*app.use((req, res, next) => {
    console.log('모든 요청에 다 실행');
    next();
});

app.get('/', (req, res, next) => {
    //res.send('Hello world');
    res.sendFile(path.join(__dirname, '/index.html'));
    console.log('get요청에서만 실행됨');
    //next();
}, (req, res) =>{
    throw new Error('에러는 에러 처리 미들웨어로 감.');
});*/

app.use((req, res, next) => {
    res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
    console.log('http://localhost:'+app.get('port'));
})