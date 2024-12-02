const express = require('express');
const router = express.Router();
const { submitIssue, removeIssues, getAllIssues, editIssue } = require('../controllers/customerIssueController');

router.post('/submitIssue', submitIssue);

router.delete('/deleteIssue', removeIssues);

router.get('/issues', getAllIssues);

router.post('/editIssue', editIssue);

module.exports = router;
