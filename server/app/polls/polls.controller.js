var Polls = require('./polls.model').polls
var Responses = require('./polls.model').responses
var sequelize = require('./polls.model').sequelize

module.exports = {
  create: function(req, res, next) {
    // validation could go here.

    Polls.create({
      prompt: req.body.prompt,
      answer_choices: req.body.answer_choices
    })
      .then(function(poll) {
        console.log(
          'Created poll (id: ' +
            poll.id +
            ', prompt: ' +
            poll.prompt +
            ', answer_choices: ' +
            poll.answer_choices +
            ')'
        )
        res.json({
          success: true,
          data: poll,
          message: 'Poll created.'
        })
      })
      .catch(function(err) {
        console.log(err)
        res.json({
          success: false,
          message: err
        })
      })
  },
  getOne: function(req, res, next) {
    Polls.findOne({
      where: {
        id: req.params.poll_id
      }
    })
      .then(function(poll) {
        res.json({
          success: true,
          poll: poll,
          message: 'Here is your course poll.'
        })
      })
      .catch(function(err) {
        console.log(err)
        res.json({
          success: false,
          message: err
        })
      })
  },
  saveResponse: function(req, res, next) {
    Responses.create({
      poll_id: req.params.poll_id,
      course_id: req.decoded.custom_canvas_course_id,
      user_id: req.decoded.custom_canvas_user_id,
      value: req.body.value
    })
      .then(function(response) {
        res.json({
          success: true,
          response: response,
          message: 'Here is your saved response.'
        })
      })
      .catch(function(err) {
        console.log(err)
        res.json({
          success: false,
          message: err
        })
      })
  },
  getOwnResponse: function(req, res, next) {
    Responses.findOne({
      where: {
        poll_id: req.params.poll_id,
        course_id: req.decoded.custom_canvas_course_id,
        user_id: req.decoded.custom_canvas_user_id
      },
      include: ['poll']
    })
      .then(function(theResponse) {
        res.json({
          success: true,
          response: theResponse
        })
      })
      .catch(function(err) {
        console.log(err)
        res.json({
          success: false,
          message: err
        })
      })
  },
  getResponseAggregate: function(req, res, next) {
    Responses.findAll({
      where: {
        poll_id: req.params.poll_id,
        course_id: req.decoded.custom_canvas_course_id
      },
      group: ['value'],
      attributes: ['value', [sequelize.fn('COUNT', 'value'), 'count']]
    })
      .then(function(theResponse) {
        res.json({
          success: true,
          responses: theResponse
        })
      })
      .catch(function(err) {
        console.log(err)
        res.json({
          success: false,
          message: err
        })
      })
  }
}
