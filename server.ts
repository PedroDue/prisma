import express from "express";
import { router } from "./router/routes";
import cors from 'cors';

const corsOptions = {
    origin: 'http://localhost:64594',
    optionsSuccessStatus: 200
};

const app = express()

app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

app.listen(3000, () => console.log("Server is " +
    "running on PORT 3000"));
