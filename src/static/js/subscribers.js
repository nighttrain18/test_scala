(function(){
    document.export.Subscribers = class {
        constructor() {
            this.subscribers = new Set()
        }
    
        Add(subscriber) {
            this.subscribers.add(subscriber)
        }
    
        Remove(subscriber) {
            this.subscribers.delete(subscriber)
        }
    
        Fire(event, state) {
            this.subscribers.forEach(s => s(event, state))
        }
    }
})()