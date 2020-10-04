module.exports = {
    port: 8887,
    initialData: {
        security: [
            __dirname + '/data/securities_1.xml',
            __dirname + '/data/securities_2.xml'
        ],
        history: [
            __dirname + '/data/history_1.xml',
            __dirname + '/data/history_2.xml',
            __dirname + '/data/history_3.xml',
            __dirname + '/data/history_4.xml'
        ]
    }
}