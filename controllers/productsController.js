let factory = require('../util/factory');

module.exports = class ProductsController {

    constructor() { }

    fetchAll(req, res) {
        // factory.product.find({}).then(res => {
        //     console.log(res);
        // }).catch(err => {
        //     console.log(err);
        // })
        // console.log('hit')
        return res.send({
            data: 'Hello World!',
            success: true
        });
    }

}