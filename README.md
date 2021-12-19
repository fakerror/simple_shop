# simple_shop
一个简单到不能用的商城  
主要就是学习一下AdonisJs框架

## 组件
[AdonisJs 5](https://adonisjs.com/)  
一个基于nodejs的功能很全的框架，非常像PHP里的laraver

[Bull](https://github.com/Rocketseat/adonis-bull/tree/alpha)  
一个基于AdonisJs的消息队列组件

## 如何试用
- 创建环境
    ```cmd
    cd docker_compose
    docker_compose up -d
    ```
- 初始化数据库
    ```cmd
    cd backend
    node ace migration:run
    node ace db:seed
    ```
- 启动后端
    ```cmd
    cd backend
    pnpm run dev
    ```
- 启动前端
    ```cmd
    cd backend
    pnpm run dev
    ```
