const express = require("express");
const app = express();
const db = require("./db");

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config.json");

// midleware to bring file in aws format
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
// creates file in uploads folder
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then((result) => {
            //  console.log("result:", result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("req.body: ", req.body);
    //  console.log("req.file: ", req.file);
    if (req.file) {
        // here sql insert
        req.body.url = s3Url + req.file.filename;
        db.imgToDb(
            req.body.url,
            req.body.username,
            req.body.title,
            req.body.description
        ).then(() => {
            res.json(req.body);
        });
    } else {
        res.json({ success: false });
    }
});

app.get("/modal/:id", (req, res) => {
    console.log("req.params.id:", req.params.id);
    db.getModal(req.params.id)
        .then((result) => {
            console.log("result modal:", result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in getModal:", err);
        });
});

app.get("/more/:latestId", (req, res) => {
    db.moreImages(req.params.latestId)
        .then((result) => {
            // console.log("result in more:", result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("err in /more:", err);
        });
});

app.listen(8080, () => console.log("IB server is listening..."));
