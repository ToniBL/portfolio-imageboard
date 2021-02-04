const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images
    ORDER BY id DESC
    LIMIT 3`;
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

module.exports.moreImages = (id) => {
    const q = `SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 1
 ) AS "lowestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 3`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getComments = (id) => {
    const q = `SELECT comment FROM comments WHERE id $1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.saveComment = () => {
    const q = `INSERT comments (username, comment, username_id)
    VALUES ($1, $2, $3)`;
    const params = [];
    return db.query(q, params);
};
