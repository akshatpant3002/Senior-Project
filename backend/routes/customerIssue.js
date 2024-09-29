const express = require('express');
const router = express.Router();
const { submitIssue, removeIssue } = require('../controllers/customerIssueController');

router.post('/submitIssue', submitIssue);

router.delete('/issues/:issueId', removeIssue);

module.exports = router;
