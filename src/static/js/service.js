(function(){
    function Service() {
        this.url = 'http//localhost:8887/'

        this._Fetch = url => {
            return new Promise(async (resolve, reject) => {
                const response = await fetch(url)
                resolve(await response.json())
            })
        }

        this._Upload = (file, url) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsText(file)
                reader.onload = async evt => {
                    xml = evt.target.result
                    await fetch(url, {
                        headers: {
                            "Content-Type": "text/xml"
                        },
                        method: 'POST',
                        body: xml
                    })
                    resolve()
                }
            })
        }

        this.FetchSecurities = () => {
            return this._Fetch('/securities')
        }

        this.FetchHistories = () => {
            return this._Fetch('/histories')
        }

        this.AddSecurity = async security => {
            const response = await fetch(`/securities`, {
                headers: {"Content-Type": "application/json"}, 
                method: 'POST', 
                body: JSON.stringify(security)
            })
            return await response.json()
        }

        this.UploadSecuritiesFile = async file => {
            return this._Upload(file, '/securities/file')
        }

        this.UploadHistoriesFile = async file => {
            return this._Upload(file, '/histories/file')
        }

        this.EditSecurity = async security => {
            return fetch(`/security/${security.secid}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: 'PUT', 
                body: JSON.stringify({
                    name: security.name
                })
            })
        }

        this.DeleteSecurity = async secid => {
            return fetch(`/security/${secid}`, {method: 'DELETE'})
        }
    }

    document.export.Service = Service 
})()