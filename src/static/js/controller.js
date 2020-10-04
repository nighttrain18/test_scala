(function() {
    function Controller() {
        this.model = new document.export.Model()
        this.securityTable = new document.export.SecurityTable(this)
        this.addSecurityForm = new document.export.AddSecurityForm(this)
        this.editSecurityForm = new document.export.EditSecurityForm(this)
        this.deleteSecurityForm = new document.export.DeleteSecurityForm(this)
        this.uploadFileForms = new document.export.UploadFileForms(this)

        this.model.Subscribe(this.securityTable.UpdateWithModel)
        this.model.Subscribe(this.addSecurityForm.UpdateWithModel)

        this.Initialize = () => {
            this.model.Initialize()
            this.uploadFileForms.Mount()
            this.addSecurityForm.Mount()
            this.editSecurityForm.Mount()
            this.deleteSecurityForm.Mount()
            this.securityTable.Mount()
        }

        this.AddSecurity = security => {
            this.model.AddSecurity(security)
        }

        this.EditSecurity = security => {
            this.model.EditSecurity(security)
        }

        this.DeleteSecurity = secid => {
            this.model.DeleteSecurity(secid)
        }

        this.UploadSecuritiesFile = file => {
            this.model.UploadSecuritiesFile(file)
        }

        this.UploadHistoriesFile = file => {
            this.model.UploadHistoriesFile(file)
        }
    }

    document.export.Controller = Controller
})()