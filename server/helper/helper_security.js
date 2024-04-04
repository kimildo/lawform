module.exports = {
    encode: (string) => {
        // console.log(string);
        // let buff = new Buffer(string);
        // return buff.toString('base64');
        return string;
    },
    decode: ( b64string ) => {
        // if (typeof Buffer.from === "function") {
        //     // Node 5.10+
        //     return Buffer.from(b64string, 'base64'); // Ta-da
        // }
        //
        // // older Node versions, now deprecated
        // return new Buffer(b64string, 'base64'); // Ta-da
        return b64string;
    }
};
