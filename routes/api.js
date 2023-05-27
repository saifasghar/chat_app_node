let productsController = new (require('../controllers/productsController'))();

module.exports = (router) => {

    router.get('/home', productsController.fetchAll)

    return router
}