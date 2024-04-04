module.exports = {
    encode: (ssss) => {
        let buff = new Buffer(ssss);
        return buff.toString('base64');
    },
    decode: ( b64string ) => {
        if (typeof Buffer.from === "function") {
            // Node 5.10+
            return Buffer.from(b64string, 'base64'); // Ta-da
        }

        // older Node versions, now deprecated
        return new Buffer(b64string, 'base64'); // Ta-da
    }
};
