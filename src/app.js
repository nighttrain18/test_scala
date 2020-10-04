const express = require('express')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)
const Database = require('./database')
const MOEXService = require('./moex-service')
const { isSecurityNameValid } = require('./is-security-name-valid')
const config = require('./config')
const { 
    getSetDifference,
    parsers: {
        parseSecuritiesFromXmlObj,
        parseHistoriesFromXmlObj,
        parseSecuritiesFromDataSource,
        parseHistoriesFromDataSource
    },
    dataSources: {
        FileDataSource,
        AsyncFuncDataSource
    },
    funcTools: {
        kI,
        reduceAsync
    }
 } = require('./lib')

const app = express()
const db = new Database()
const jsonParser = bodyParser.json()
const xmlParser = bodyParser.xml()

app.use("/", express.static(__dirname + '/static'))

app.get('/securities', async (req, res) => {
    const securities = await db.GetSecurities()
    res.send(securities)
})
            
app.get('/histories', async (req, res) => {
    const histories = await db.GetHistories()
    res.send(histories)
})

app.put('/security/:secid', jsonParser, async (req, res) => {  
    const secid = req.params.secid
    const name = req.body.name
    await db.UpdateSecurity({secid, name})
    res.send()
})
      
app.post('/securities/file', xmlParser, async (req, res) => {
    const securities = parseSecuritiesFromXmlObj(req.body)
    await db.SaveSecurities(securities)
    res.send()
})

app.post('/securities', jsonParser, async (req, res) => {
    if(!isSecurityNameValid(req.body.name)) {
        res.send({errorName: 'Invalid name'})
        return
    } 

    await db.SaveSecurities([req.body])
    res.send({errorName: ''})
})

app.post('/histories/file', xmlParser, async (req, res) => {
    const histories = parseHistoriesFromXmlObj(req.body)
    const secidsInDatabase = new Set((await db.GetSecurities(['id'])).map(s => s.id))
    const secidsInHistories = histories.reduce((acc, h) => acc.add(h.secid), new Set())
    const newSecids = getSetDifference(secidsInHistories, secidsInDatabase)
    const moexService = new MOEXService()
    const reduceSecids = reduceAsync(newSecids)
    const securitiesToSave = await reduceSecids(async (acc, secid) => {
        const dataSource = new AsyncFuncDataSource(async () => { 
            const response = await moexService.FetchSecurities(secid)
            return response.data
        })
        const securities = await parseSecuritiesFromDataSource(dataSource)
        const index = securities.findIndex(s => s.secid == secid)
        acc.push(securities[index])
        return acc
    }, [])
    await db.SaveSecurities(securitiesToSave)
    await db.SaveHistories(histories)
    res.send()
})
            
app.delete('/security/:secid', async (req, res) => {
    await db.DeleteSecurities([req.params.secid])
    res.send()
})
            
app.delete('/history/:secid', async (req, res) => {
    await db.DeleteHistories([req.params.secid])
    res.send()
})

const {
    security: securityFilePaths, 
    history: historyFilePaths
} = config.initialData

const parsePromises = securityFilePaths.
        map(filePath => new FileDataSource(filePath)).
        map(parseSecuritiesFromDataSource).
        concat(historyFilePaths.
            map(filePath => new FileDataSource(filePath)).
            map(parseHistoriesFromDataSource))
Promise.all(parsePromises).then(results => {
    const securities = results.
        slice(0, securityFilePaths.length).
        flatMap(kI)
    const histories = results.
        slice(securityFilePaths.length).
        flatMap(kI)
    db.Initialize({securities, histories}).then(async () => {
        app.listen(config.port, () => {
            console.log(`Server started at ${config.port} port`)
        })
    })
})