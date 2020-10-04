(function() {
    const uploadSecurityFileForm = `
        <form id='upload-security-file-form' class="form">
            <label>Choose security file</label><input id='security-file-input' type='file' />
            <button type='submit'>Send security file</button>
        </form>
    `

    const uploadHistoryFileForm = `
        <form id='upload-history-file-form' class="form">
            <label>Choose history file</label><input id='history-file-input' type='file' />
            <button type='submit'>Send history file</button>
        </form>
    `

    function UploadFileForms(controller) {
        this.controller = controller
        this.securityFormId = 'upload-security-file-form'
        this.historyFormId = 'upload-history-file-form'

        this.Mount = async () => {
            const root = document.getElementById('root')
            new Array([uploadSecurityFileForm, uploadHistoryFileForm]).forEach(f => root.innerHTML += f)
            await document.lib.makeRerenderingPromise()
            document.getElementById(this.securityFormId).addEventListener('submit', evt => {
                evt.preventDefault()
                const files = document.getElementById('security-file-input').files
                if(files.length) {
                    this.controller.UploadSecuritiesFile(files[0])
                }
                
            })
            document.getElementById(this.historyFormId).addEventListener('submit', evt => {
                evt.preventDefault()
                document.getElementById('history-file-input').files[0]
                const files = document.getElementById('history-file-input').files
                if(files.length) {
                    this.controller.UploadHistoriesFile(files[0])
                }
            })
        }
    }

    document.export.UploadFileForms = UploadFileForms
})()