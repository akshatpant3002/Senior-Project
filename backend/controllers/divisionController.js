const Division = require('../models/divisionModel');

const getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find().populate('customerIssues');
    res.status(200).json(divisions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve divisions', details: error.message });
  }
};

const createDivision = async (req, res) => {
  const { title } = req.body;
  try {
    const newDivision = new Division({ title });
    await newDivision.save();
    res.status(201).json({ message: 'Division successfully created', division: newDivision });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create division', details: error.message });
  }
};

const deleteDivision = async (req, res) => {
  const { divisionId } = req.params;
  try {
    const deletedDivision = await Division.findByIdAndDelete(divisionId);
    if (!deletedDivision) {
      return res.status(404).json({ message: 'Division not found' });
    }
    res.status(200).json({ message: 'Division deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete division', details: error.message });
  }
};

const assignIssueToDivision = async (req, res) => {
  const { divisionId } = req.params;
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId);
    const division = await Team.findById(divisionId);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    // Add issue to the division's customerIssues array
    division.customerIssues.push(issue._id);
    await division.save();

    res.status(200).json({
      message: 'Issue assigned to division successfully',
      division
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { getAllDivisions, createDivision, deleteDivision, assignIssueToDivision };
