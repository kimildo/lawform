let documents = require('../models/documents');

try {
    documents.likeDocument(1, 2).then((msg) => {
        console.log(msg);
    });
    documents.getAllOrderByCategory().then((msg) => {
        console.log(msg);
    });
    documents.getLikedDocument(1).then((msg) => {
        console.log(msg);
    });
}
catch (err) {
    console.log(err);
}
