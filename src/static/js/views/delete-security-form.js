(function() {
    const deleteSecurityForm = `
        <form id='delete-security-form' class="form">
            <label for='delete-form__security-id'>SecId </label><input type='text' id='delete-form__security-id' /> <br />
            <button type='submit'>Delete</button>
        </form>
    `

    function DeleteSecurityForm(controller) {
        this.controller = controller
        this.formId = 'delete-security-form'

        this.Mount = async () => {
            document.
                getElementById('root').
                innerHTML += deleteSecurityForm

            await document.lib.makeRerenderingPromise()
            document.getElementById(this.formId).addEventListener('submit', evt => {
                evt.preventDefault()
                this.controller.DeleteSecurity(document.lib.getValueOfInputById('delete-form__security-id'))
            })
        }
    }

    document.export.DeleteSecurityForm = DeleteSecurityForm
})()