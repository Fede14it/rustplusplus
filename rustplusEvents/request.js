module.exports = {
    name: 'request',
    async execute(rustplus, client, request) {
        if (rustplus.debug)
            rustplus.log(`REQUEST SENT:\n${JSON.stringify(request)}`);
    },
};