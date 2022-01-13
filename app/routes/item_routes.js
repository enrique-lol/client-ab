
const express = require('express')
const passport = require('passport')

const Item = require('../models/item')
// const Collection = require('../models/collection')
const customErrors = require('../../lib/custom_errors')

const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership

const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

router.get('/item', (req, res, next) => {
  Item.find()
    .then(item => {
      return item.map(item => item.toObject())
    })
    .then(item => res.status(200).json({ item: item }))
    .catch(next)
})

router.get('/itemsincoll/:id', (req, res, next) => {
  const id = req.params.id
  Item.find()
    .then(item => {
      const array = item.map(item => item.toObject())
      const response = array.filter(item => item.collectionId === id)
      console.log(response)
      return response
    })
    // 200 status B)
    .then(item => res.status(200).json({ item: item }))
    .catch(next)
})

router.get('/item/:id', (req, res, next) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(200).json({ item: item.toObject() }))
    .catch(next)
})

router.post('/item', requireToken, (req, res, next) => {
  req.body.item.owner = req.user.id

  Item.create(req.body.item)
    .then(item => {
      res.status(201).json({ item: item.toObject() })
    })
    .catch(next)
})

router.patch('/item/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.item.owner

  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      requireOwnership(req, item)

      return item.updateOne(req.body.item)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.delete('/item/:id', requireToken, (req, res, next) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      requireOwnership(req, item)
      item.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
