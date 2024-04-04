class DocDelegate {

    constructor () {
        this.callback_functions = {}
    }

    addCallback (name, func) {
        this.callback_functions[name] = func
    }

    callback (name) {
        if (name in this.callback_functions) {
            let func = this.callback_functions[name]
            func()
            return
        }
        console.log('Function not found!')
    }
}

export default DocDelegate
