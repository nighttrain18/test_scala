const fs = require('fs')
const xml2js = require('xml2js')

var parseSecurityFromXmlRow = row => {
    return {
        secid: row['$'].secid, 
        regnumber: row['$'].regnumber,
        name: row['$'].name,
        emitent_title: row['$'].emitent_title,
        secid: row['$'].secid,
    }
}

var parseHistoryFromXmlRow = row => {
    return {
        secid: row['$'].SECID,
        boardid: row['$'].BOARDID,
        tradedate: row['$'].TRADEDATE,
        numtrades: row['$'].NUMTRADES,
        open: row['$'].OPEN,
        close: row['$'].CLOSE
    }
}

var parseEntitiesFromXmlObj = parseEntityFromXmlRow => xmlObj => {
    return xmlObj.document.data[0].rows[0].row.map(parseEntityFromXmlRow)
} 

const parseSecuritiesFromXmlObj = parseEntitiesFromXmlObj(parseSecurityFromXmlRow)
const parseHistoriesFromXmlObj = parseEntitiesFromXmlObj(parseHistoryFromXmlRow)

const parseEntitiesFromData = parseEntitiesFromXmlObj => async data => {
    const parser = new xml2js.Parser()
    const xmlObj = await parser.parseStringPromise(data)
    const entities = parseEntitiesFromXmlObj(xmlObj)
    return entities
}

const parseSecuritiesFromData = parseEntitiesFromData(parseSecuritiesFromXmlObj)
const parseHistoriesFromData = parseEntitiesFromData(parseHistoriesFromXmlObj)

const parseEntitiesFromDataSource = parseEntitiesFromData => async source => {
    const data = await source.produceData()
    const entities = await parseEntitiesFromData(data)
    return entities
}

const parseSecuritiesFromDataSource = parseEntitiesFromDataSource(
    parseSecuritiesFromData)

const parseHistoriesFromDataSource = parseEntitiesFromDataSource(
    parseHistoriesFromData)

class FileDataSource {
    constructor(fileName) {
        this.fileName = fileName
    }

    produceData = () => {
        return new Promise((resolve, _) => {
            fs.readFile(this.fileName, (_, data) => {
                resolve(data)
            })
        })
    }
}

class AsyncFuncDataSource {
    constructor(f, ...args) {
        this.f = f
        this.args = args
    }

    produceData = () => {
        return this.f(...this.args)
    }
}

const reduceAsync = iterableCollection => async (reducer, into) => {
    for (const element of iterableCollection) {
        into = await reducer(into, element)
    }
    return into
}

const kI = x => x

module.exports = {
    getSetDifference: (setA, setB) => {
        let _difference = new Set(setA)
        for (const el of setB) {
            _difference.delete(el)
        }
        return _difference
    },
    msInDay: 60 * 60 * 24 * 1000,
    parsers: {
        parseSecuritiesFromDataSource: parseSecuritiesFromDataSource,
        parseHistoriesFromDataSource: parseHistoriesFromDataSource,
        parseSecuritiesFromXmlObj: parseSecuritiesFromXmlObj,
        parseHistoriesFromXmlObj: parseHistoriesFromXmlObj
    },
    dataSources: {
        FileDataSource: FileDataSource,
        AsyncFuncDataSource: AsyncFuncDataSource
    },
    funcTools: {
        kI: kI,
        reduceAsync: reduceAsync
    }
}