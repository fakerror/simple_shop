/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  Route.group(() => {
    Route.route('/user', ['GET', 'POST', 'PUT'], 'API/UserController.index')
    Route.route('/product', ['GET', 'POST', 'PUT'], 'API/ProductController.index')
    Route.route('/order', ['GET', 'POST', 'PUT'], 'API/OrderController.index')
    Route.post('/user/login', 'API/UserController.login')
    Route.post('/user/change_password', 'API/UserController.change_password').middleware('auth')
    Route.get('/user/logout', 'API/UserController.logout').middleware('auth')
    Route.get('/product/search', 'API/ProductController.search')
    Route.post('/job/order_make', 'API/JobController.order_make').middleware('auth')
    Route.post('/job/order_trans_info_set', 'API/JobController.order_trans_info_set')
    Route.post('/job/product_quantity_add', 'API/JobController.product_quantity_add')
    Route.get('/job/status', 'API/JobController.status')
  }).prefix('/v1')
}).prefix('/api')
