(function() {
    document.lib = {}
    document.lib.getValueOfInputById = id => document.getElementById(id).value 
    // ожидающий код продолжится после того как выполнятся все задачи из очереди событийного цикла
    // пример кейса: мы добавили в ДОМ элемент и хотим сразу же повесить обработчик на элемент, 
    // обращаясь через document в ДОМ за этим элементом (можно повесить сразу, но таков кейс:)).
    // Для этого мы должны выполниться после того как выполнится задача рендеринга нового состояния ДОМа, 
    // поэтому становимся в очередь за ререндером ДОМа
    document.lib.makeRerenderingPromise = () => {
        return new Promise((r, _) => {
            setTimeout(() => r(), 0)
        })
    }
})()