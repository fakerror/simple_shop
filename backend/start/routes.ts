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

// public
Route.group(() => {
  Route.post('/admin_user/login', 'API/AdminController.login')
  Route.post('/admin_user/register', 'API/AdminController.register')
  Route.post('/user/login', 'API/UserController.login')
  Route.get('/product/search', 'API/ProductController.search')
})
  .prefix('/v1')
  .prefix('/api')

// admin
Route.group(() => {
  Route.route('/admin_user', ['GET', 'POST', 'PUT'], 'API/AdminController.index')
  Route.post('/admin_user/change_password', 'API/AdminController.change_password')
  Route.get('/admin_user/logout', 'API/AdminController.logout')
  Route.route('/user', ['GET', 'POST', 'PUT'], 'API/UserController.index')
  Route.route('/product', ['GET', 'POST', 'PUT'], 'API/ProductController.index')
  Route.route('/order', ['GET', 'POST', 'PUT'], 'API/OrderController.index')
  Route.post('/job/order_trans_info_set', 'API/JobController.order_trans_info_set')
  Route.post('/job/product_quantity_add', 'API/JobController.product_quantity_add')
})
  .middleware('auth:admin_api')
  .prefix('/v1')
  .prefix('/api')

// user
Route.group(() => {
  Route.post('/user/change_password', 'API/UserController.change_password')
  Route.get('/user/logout', 'API/UserController.logout')
  Route.post('/job/order_make', 'API/JobController.order_make')
  Route.get('/job/status', 'API/JobController.status')
})
  .middleware('auth:user_api')
  .prefix('/v1')
  .prefix('/api')
