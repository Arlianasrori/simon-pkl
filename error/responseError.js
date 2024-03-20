class responseError extends Error {
    constructor(status,message) {
        super(message) = message
        this.status = status
    }
}

export default responseError