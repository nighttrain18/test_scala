(function() {
    const editSecurityForm = `
        <form id='edit-security-form' class="form">
            <label for='edit-form__security-id'>SecId </label><input type='text' id='edit-form__security-id' /> <br />
            <label for='edit-form__security-name'>SecName </label><input type='text' id='edit-form__security-name' /> <br />
            <button type='submit'>Edit</button>
        </form>
    `

    function EditSecurityForm(controller) {
        this.controller = controller
        this.formId = 'edit-security-form'

        this.Mount = async () => {
            document.
                getElementById('root').
                innerHTML += editSecurityForm

            await document.lib.makeRerenderingPromise()
            document.getElementById(this.formId).addEventListener('submit', evt => {
                evt.preventDefault()
                this.controller.EditSecurity({
                    secid: document.lib.getValueOfInputById('edit-form__security-id'),
                    name: document.lib.getValueOfInputById('edit-form__security-name') 
                })
            })
        }
    }

    document.export.EditSecurityForm = EditSecurityForm
})()