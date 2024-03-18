class responseError extends Error {
    constructor(status,message) {
        this.status = status
        super(message) = message
    }
}

export default responseError