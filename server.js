const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            console.log("result:", result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
