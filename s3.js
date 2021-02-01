const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// this whole block uploads to aws
exports.upload = (req, res, next) => {
    if (!req.file) {
        // req.file = result of multer
        return res.sendStatus(500);
    }

    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read", // access control list
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype, //Header AWS is looking for
            ContentLength: size,
        })
        .promise(); // this is a sdk method that makes sure we get a promise from AWS

    promise
        .then(() => {
            // it worked!!!
            console.log("AWS upload done");

            fs.unlink(path, () => {}); // optional!! delete image from local storage after upload to AWS
            next();
        })
        .catch((err) => {
            // uh oh
            console.log("err in aws upload:", err);
        });
};
