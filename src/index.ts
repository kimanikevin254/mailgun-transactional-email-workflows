import 'dotenv/config';
import { AppDataSource } from "./database/data-source";
import express from 'express';
import router from "./router/order.router";
import path from 'path';

AppDataSource.initialize().then(async () => {
    const app = express();

    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(express.json());

    app.use('/', router);

    app.listen(3000)

    console.log("Express server is running on port 3000.");

}).catch(error => console.log(error))
