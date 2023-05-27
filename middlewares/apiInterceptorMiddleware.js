
module.exports = class ApiInterceptorMiddleware {
    setTemplate = (req, res, next) => {
        // Modify the response object to set a default template
        res.template = {
            status: 200,
            success: true,
            message: '',
            data: null
        };

        // Call the next middleware function
        next();
    }
}