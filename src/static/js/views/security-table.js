(function() {
    const makeTableRow = ({
        secid, regnumber, name, emitent_title,
        boardid, tradedate, numtrades, open, close
    }) => {
        return `
        <tr>
            <td>${secid}</td>
            <td>${regnumber}</td>
            <td>${name}</td>
            <td>${emitent_title}</td>
            <td>${tradedate}</td>
            <td>${numtrades}</td>
            <td>${boardid}</td>
            <td>${open}</td>
            <td>${close}</td>
        </tr>`
    }

    const tableHeader = `
    <tr>
        <th>SECID</th>
        <th>REGNUMBER</th>
        <th>NAME</th>
        <th>EMITENT_TITLE</th>
        <th>TRADEDATE</th>
        <th>NUMTRADES</th>
        <th>BOARDID</th>
        <th>OPEN</th>
        <th>CLOSE</th>
    </tr>`

    const tableHtml = `
    <table id='security-table'>
        ${tableHeader}
    </table>`

    const compose = (f, g) => async x => f(await g(x)) 
    const kI = x => Promise.resolve(x)
    const composeMany = (...fs) => fs.reduce((acc, f) => compose(acc, f), kI)
    Array.prototype.fluentConsolelLog = function() {
        console.log(this)
        return this
    }

    const transformSecuritiesInto = securities => into => {
        return securities.reduce((acc, s) => {
            acc[s.id] = {}
            acc[s.id].description = {...s}
            delete acc[s.id].description.secid
            return acc
        }, into)
    }

    const transformHistoriesInto = histories => into => {
        return histories.reduce((acc, h) => {
            const tradeInfo = {...h}
            delete tradeInfo.secid
            if(!('tradeInfos' in acc[h.secid])) {
                acc[h.secid].tradeInfos = []
            } 

            acc[h.secid].tradeInfos.push(tradeInfo)
            return acc
        }, into)
    }

    const removeSecurityWithoutTradeInfo = reducedData => {
        return Object.
            keys(reducedData).
            reduce((acc, k) => {
                if('tradeInfos' in reducedData[k]) {
                    acc[k] = {...reducedData[k]}
                }

                return acc
            }, {})
    }

    const transformToRender = (securities, histories) => {
        // async algo for the ui not to be freezed
        const yieldThread = async x => {
            await document.lib.makeRerenderingPromise()
            return x
        }
        return new Promise(async (resolve, _) => {
            const reduce = composeMany(
                removeSecurityWithoutTradeInfo,
                yieldThread,
                transformHistoriesInto(histories),
                yieldThread,
                transformSecuritiesInto(securities)
            )
            const into = {}
            resolve(await reduce(into))
        })
    }

    function SecurityTable(controller) {
        this.tableId = 'security-table'
        this.controller = controller
        this.modelState = {}
    
        this.Mount = () => {
            const root = document.getElementById('root')
            root.innerHTML += tableHtml
        }
    
        this.UpdateWithModel = async (event, state) => {
            if(this.IsAlreadyMounted()) {
                this.modelState = state
                const Event = document.export.Event
                switch(event) {
                    case Event.InitialEvent:
                    case Event.StateUpdated:
                        const {securities, histories} = this.modelState
                        const transformedData = await transformToRender(securities, histories)
                        const tableRows = Object.
                            keys(transformedData).
                            reduce((acc, key) => {
                                return acc.concat(transformedData[key].tradeInfos.map(i => {
                                    return {
                                        secid: key,
                                        ...transformedData[key].description,
                                        ...i
                                    }
                                }))
                            }, []).
                            map(makeTableRow)
                        
                        this.ClearTable()
                        this.PopulateTable(tableRows)
                        break
                }
            }
        }

        this.IsAlreadyMounted = () => {
            return document.getElementById(this.tableId) != null
        }

        this.ClearTable = () => {
            const table = document.getElementById(this.tableId)
            table.innerHTML = tableHeader
        }

        this.PopulateTable = tableRows => {
            const table = document.getElementById(this.tableId)
            tableRows.forEach(tr => table.innerHTML += tr)
        }
    }

    document.export.SecurityTable = SecurityTable
})()