module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        // custom application error
        console.error('custom error:', err)
        return res.status(400).json({ message: err });
    }

    // if (err.name === 'ValidationError') {
    //     // mongoose validation error
    //     return res.status(400).json({ message: err.message });
    // }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.error('unauthorized error:', err)
        return res.status(401).json({ message: 'Invalid Token' });
    }

    // default to 500 server error
    console.log('unknown error:', err)
    return res.status(500).json({ message: err });
}