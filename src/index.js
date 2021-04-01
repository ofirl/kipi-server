const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');

const createErrorfrom = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const session = require('express-session');
const { asyncMiddleware } = require('./utils/middlewares');
const { createNewTable, deleteTable, getAllTables, getTable, updateTable } = require('./utils/dbUtils');

const app = express();

const PORT = process.env.PORT || 3099;

app.use(cors(
    {
        credentials: true,
        origin: ['https://kipi.ofirl.com', /http:\/\/localhost:\d*/],
        // origin: /http:\/\/localhost:\d*/,
        // origin: '*',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecretgeneratedsessionkey_njdfdnqvhxzvsnlvchbsk',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        sameSite: 'none',
        secure: true,
    },
}));

app.use('/static', express.static(path.join(__dirname, '../public')))

app.get('/get/all', asyncMiddleware(async (req, res) => {
    const allTables = await getAllTables();
    res.json(allTables);
}));

app.get('/get/:tableId', asyncMiddleware(async (req, res) => {
    const table = await getTable(req.params.tableId);
    res.json(table);
}));

app.post('/create', asyncMiddleware(async (req, res) => {
    const result = await createNewTable(req.body.name, req.body.description, req.body.source);
    res.json(result);
}));

app.post('/update/:tableId', asyncMiddleware(async (req, res) => {
    const result = await updateTable(req.params.tableId, req.body);
    res.json(result);
}));

app.get('/delete/:tableId', asyncMiddleware(async (req, res) => {
    const result = await deleteTable(req.params.tableId);
    res.json(result);
}));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {

    // if (err.status != 404)
    // slackLogger.sendErrorLog(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.json('error')
});

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

module.exports = app;