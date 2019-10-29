const { Router } = require('express');
const { updateProfile } = require('../controllers/updateProfile');
const { updateAvatar } = require('../controllers/updateAvatar');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-err');

const User = require('../models/user');

const router = Router();

router.get('/', (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
});

router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch(next);
});

router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);


module.exports = router;
