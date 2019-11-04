const { Router } = require('express');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { createCard } = require('../controllers/cards');
const { likeCard } = require('../controllers/likeCard');
const { dislikeCard } = require('../controllers/dislikeCard');
const auth = require('../middlewares/auth');
// const NotFoundError = require('../errors/not-found-err');
// const NotAuthError = require('../errors/not-auth');
const ServerError = require('../errors/server-err');

const Card = require('../models/card');

const router = Router();
const errRoute = { message: 'Нет карточки с таким id' };

router.use(requestLogger);

router.get('/', (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        throw new ServerError('Внутренняя ошибка сервера');
      }
      res.send({ data: card });
    })
    .catch(next);
});

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24),
  }),
}), (req, res) => {
  Card
    .findById({ _id: req.params.id }, (err, data) => {
      if (!data) {
        return res
          .status(404).send(errRoute)
          .end();
      }
      if (!(data.owner.toString() === req.user.toString())) {
        return res
          .status(401)
          .send({ message: 'Нет прав на удаление карточки' })
          .end();
      }
      Card.findByIdAndRemove(req.params.id)
        .then((card) => res.send({ data: card }))
        .catch(() => res.status(404).send(errRoute));
      return undefined;
    });
});

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(5),
  }),
}), createCard);

router.put('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

router.delete('/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

router.use(errorLogger);
router.use(errors());

module.exports = router;
