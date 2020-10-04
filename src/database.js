const sqlite = require('sqlite3').verbose()

const makeHistoryId = ({secid, tradedate, boardid}) => `${secid}${tradedate}${boardid}`

class Database {
    Initialize = async ({securities = [], histories = []}) => {
        this.db = new sqlite.Database(':memory:')
        const createSecurityTableSql = `
            CREATE TABLE security (
                id TEXT PRIMARY KEY,
                regnumber TEXT,
                name TEXT,
                emitent_title TEXT
            )
        `
        const createHistoryTableSql = `
            CREATE TABLE history (
                id TEXT PRIMARY KEY,
                secid TEXT,
                tradedate TEXT,
                boardid TEXT,
                numtrades INTEGER,
                open REAL,
                close REAL,
                CONSTRAINT secid_constraint FOREIGN KEY (secid) 
                    REFERENCES security(id) 
                    ON DELETE CASCADE
            )
        `
        return new Promise((resolve, reject) => {
            this.db.
                run('PRAGMA foreign_keys=ON').
                run(createSecurityTableSql).
                run(createHistoryTableSql, async (err, res) => {
                    await this.SaveSecurities(securities)
                    await this.SaveHistories(histories)
                    resolve()
                })
        })
    }

    _Get = async sql => {
        return new Promise((resolve, reject) => {
            this.db.all(sql, (err, res) => {
                resolve(res)
            })
        })
    }

    _Save = async (entities, sql, makeParams) => {
        return new Promise((resolve, _) => {
            entities.forEach(async entity => {
                const params = makeParams(entity)
                try {
                    await new Promise((resolve, reject) => {
                        this.db.run(sql, params, (err, _) => {
                            if (err) {
                                console.log('Error running sql ' + sql)
                                console.log(err)
                                reject(err)
                            } else {
                                resolve()
                            }
                        })
                    })
                } catch (err) {
                    if(err.code != 'SQLITE_CONSTRAINT') {
                        reject(err)
                    }
                }
            })
            resolve()
        })
    }

    _Delete = async (ids, sql, makeParams) => {
        return new Promise((resolve, reject) => {
            ids.forEach(async id => {
                try {
                    await new Promise((resolve, reject) => {
                        const params = makeParams(id)
                        this.db.run(sql, params, (err, _) => {
                            if (err) {
                                console.log('Error running sql ' + sql)
                                console.log(err)
                                reject(err)
                            } else {
                                resolve()
                            }
                        })
                    })
                } catch(err) {
                    console.log('Error: ', err)
                }
            })
            resolve()
        })
    }

    GetSecurities = async (properties = []) => {
        const sql = `SELECT ${(properties.length ? properties.join(', ') : '*')} FROM security`
        return this._Get(sql)
    }

    GetHistories = async () => {
        const sql = 'SELECT * FROM history'
        return this._Get(sql)
    }

    SaveSecurities = async securities => {
        const makeParams = security => {
            const {secid, regnumber = "", name, emitent_title = ""} = security
            return [secid, regnumber, name, emitent_title]
        }
        const sql = `
            INSERT INTO security (
                id, 
                regnumber, 
                name, 
                emitent_title
            ) VALUES (?,?,?,?)
        `
        return this._Save(securities, sql, makeParams)
    }

    SaveHistories = async histories => {
        const makeParams = history => {
            const {secid, tradedate, boardid, numtrades, open, close} = history
            return [makeHistoryId(history), secid, tradedate, boardid, numtrades, open, close]
        }
        const sql = `
                INSERT INTO history (
                    id,
                    secid, 
                    tradedate, 
                    boardid, 
                    numtrades, 
                    open, 
                    close 
                ) VALUES (?,?,?,?,?,?,?)
            `
        return this._Save(histories, sql, makeParams)
    }

    DeleteSecurities = async ids => {
        const sql = `DELETE FROM security WHERE id = ?`
        const makeParams = id => [id]
        return this._Delete(ids, sql, makeParams)
    }

    DeleteHistories = async ids => {
        const sql = `DELETE FROM security WHERE id = ?`
        const makeParams = id => [id]
        return this._Delete(ids, sql, makeParams)
    }

    UpdateSecurity = async security => {
        const {secid, name} = security
        const sql = `UPDATE security SET name = ? WHERE id = ?`
        return new Promise((resolve, reject) => {
            this.db.run(sql, [name, secid], (rr, err) => {
                console.log(rr)
                console.log(err)
                resolve()
            })
        })
    }
}

module.exports = Database