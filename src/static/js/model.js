(function(){
    const Event = {
        InitialEvent: 'InitialEvent',
        // если не заморачиваться
        StateUpdated: 'StateUpdated'
    }
    
    function Model() {
        this.subscribers = new document.export.Subscribers()
        this.state = {
            securities: [],
            histories: [],
            securityValidation: {
                errorName: ''
            }
        }
        this.service = new document.export.Service()

        this._UpdateState = async () => {
            const response =  await Promise.all([
                this.service.FetchSecurities(),
                this.service.FetchHistories()
            ])
            console.log(response)
            this.state.securities = response[0]
            this.state.histories = response[1]
            this.subscribers.Fire(Event.StateUpdated, this.state)
        }

        this.Initialize = async () => {
            this._UpdateState()
        }
    
        this.EditSecurity = async security => {
            this.state.securityValidation = await this.service.EditSecurity(security)
            this.subscribers.Fire(Event.StateUpdated, this.state)
        }
    
        this.UploadSecuritiesFile = async file => {
            await this.service.UploadSecuritiesFile(file)
            this._UpdateState()
        }

        this.UploadHistoriesFile = async file => {
            await this.service.UploadHistoriesFile(file)
            this._UpdateState()
        }
    
        this.AddSecurity = async security => {
            const error = await this.service.AddSecurity(security)
            this.state.securityValidation.errorName = error.errorName
            if(error.errorName.length) {
                this.subscribers.Fire(Event.StateUpdated, this.state)
                return
            }

            this._UpdateState()
        }
    
        this.DeleteSecurity = async secid => {
            await this.service.DeleteSecurity(secid)
            this._UpdateState()
        }
    
        this.Subscribe = (subscriber) => {
            this.subscribers.Add(subscriber)
            this.subscribers.Fire(Event.InitialEvent, this.state)
        }
        
        this.Unsubscribe = (subscriber) => {
            this.subscribers.Remove(subscriber)
        }
    }

    document.export.Event = Event
    document.export.Model = Model
})()