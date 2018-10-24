// Загрузка библиотек
const Koa = require('koa');
const Router = require('koa-router');

const body = require('koa-body');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

// Загрузка моделей
const User = require('./models/user');

// Инициализация
const config = {
  jwt_key: 'secret_key',
  mongodb_uri: 'mongodb://localhost/test',
};

mongoose.connect(config.mongodb_uri);

const app = new Koa();
const router = new Router();

app.use(body());
app.use(router.routes());

// Вспомогательные функции и миддлвэйры
const jwt_verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt_key, (err, decoded) => {
      if (err) { return reject(err); }

      resolve(decoded);
    })
  })
}

const verifyTokenMiddleware = async (ctx, next) => {
  const auth = ctx.request.headers['authorization'];

  if (!auth) {
    return ctx.body = { code: 2, message: 'Unauthenticated' };
  }

  const [, token] = auth.split(' ');

  try {
    const data = await jwt_verify(token);

    ctx.request.user = data;

    await next();
  } catch (e) {
    ctx.body = { code: 2, message: 'Unauthenticated' };
  }
}

// Хандлеры
router
  .post('/auth', async (ctx) => {
    const { username, password } = ctx.request.body;

    const user = await User.findOne({username, password}).lean().exec();
    if (user) {
      const { _id: id, username, fullName } = user;

      ctx.body = {
        access_token: jwt.sign({ id, username, fullName }, config.jwt_key),
      };
    } else {
      ctx.body = { code: 1, message: 'Wrong credentials' };
    }
  })

  .get('/users', verifyTokenMiddleware, async (ctx) => {
    const users = await User.find();

    ctx.body = users;
  })

  .get('/users/:id', verifyTokenMiddleware, async (ctx) => {
    const user = await User.findById(ctx.params.id);

    ctx.body = user;
  })

  .post('/users', verifyTokenMiddleware, async (ctx) => {
    const user = await User.create(ctx.request.body);

    ctx.body = user;
  })

  .put('/users/:id', verifyTokenMiddleware, async (ctx) => {
    const user = await Users.findByIdAndUpdate(ctx.params.id, ctx.request.body);

    ctx.body = user;
  })

  .patch('/users/:id', verifyTokenMiddleware, async (ctx) => {
    const user = await Users.findByIdAndUpdate(ctx.params.id, {
      $set: ctx.request.body
    });

    ctx.body = user;
  })

  .delete('/users/:id', verifyTokenMiddleware, async (ctx) => {
    const user = await Users.findByIdAndRemove(ctx.params.id);

    ctx.body = user;
  })

app.listen(8888);