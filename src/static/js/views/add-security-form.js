(function() {
    const addSecurityForm = `
    <form id='add-security-form' class="form">
        <label for='add-form__security-id'>SecId </label><input type='text' id='add-form__security-id' /> <br />
        <label for='add-form__security-name'>SecName </label><input type='text' id='add-form__security-name' /> <br />
        <div id='security-name-validation' class='error'></div>
        <button type='submit'>Add</button>
    </form>
    `

    function AddSecurityForm(controller) {
        this.controller = controller
        this.formId = 'add-security-form'

        this.Mount = async () => {
            document.
                getElementById('root').
                innerHTML += addSecurityForm

            await document.lib.makeRerenderingPromise()
            document.getElementById(this.formId).addEventListener('submit', evt => {
                evt.preventDefault()
                this.controller.AddSecurity({
                    secid: document.lib.getValueOfInputById('add-form__security-id'),
                    name: document.lib.getValueOfInputById('add-form__security-name') 
                })
            })
        }

        this.UpdateWithModel = (event, state) => {
            const Event = document.export.Event
            switch(event) {
                case Event.StateUpdated:
                    document.getElementById('security-name-validation').innerHTML = state.securityValidation.errorName
            }
        }
    }

    document.export.AddSecurityForm = AddSecurityForm
})()