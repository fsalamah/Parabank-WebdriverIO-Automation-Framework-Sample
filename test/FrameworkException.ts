class FrameworkException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FrameworkException';
    }
}

export default FrameworkException;