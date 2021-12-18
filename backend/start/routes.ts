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
    Route.post('/user/login', 'API/UserController.login')
    Route.post('/user/change_password', 'API/UserController.change_password').middleware('auth')
    Route.get('/user/logout', 'API/UserController.logout').middleware('auth')
    Route.get('/user/make_order', 'API/UserController.make_order').middleware('auth')
    Route.route('/product', ['GET', 'POST', 'PUT'], 'API/ProductController.index')
    Route.get('/product/search', 'API/ProductController.search')
    Route.post('/job/make_order', 'API/JobController.make_order')
    Route.get('/job/status', 'API/JobController.status')
  }).prefix('/v1')
}).prefix('/api')
