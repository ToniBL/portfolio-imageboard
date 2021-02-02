const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images`;
    // const params = [url, title];
    return db.query(q);
};

module.exports.imgToDb = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description)
    VALUES ($1, $2, $3, $4)`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getModal = (id) => {
    const q = `SELECT * FROM images
    WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};
