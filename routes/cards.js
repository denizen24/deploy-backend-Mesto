const { Router } = require('express');
const { createCard } = require('../controllers/cards');
const { likeCard } = require('../controllers/likeCard');
const { dislikeCard } = require('../controllers/dislikeCard');

const Card = require('../models/card');

const router = Router();
const errRoute = { message: 'Нет карточки с таким id' };

router.get('/', (req, res) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.delete('/:id', (req, res) => {
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

router.post('/', createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
