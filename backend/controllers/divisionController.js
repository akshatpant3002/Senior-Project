const Division = require("../models/divisionModel"); 

const getInsights = async (req, res) => {
  try {
    const divisions = await Division.find().populate("customerIssues");

    if (!divisions || divisions.length === 0) {
      return res.status(404).json({ error: "No divisions found." });
    }

    const insights = divisions.map((division) => {
      const customerIssues = division.customerIssues;

      const totalIssues = customerIssues.length;

      const completedIssues = customerIssues.filter(
        (issue) => issue.completed
      ).length;
      const pendingIssues = totalIssues - completedIssues;

      const priorityBreakdown = customerIssues.reduce(
        (acc, issue) => {
          acc[issue.priority] = (acc[issue.priority] || 0) + 1;
          return acc;
        },
        { low: 0, medium: 0, high: 0 }
      );

      const issuesOverTime = customerIssues.reduce((acc, issue) => {
        const dateKey = issue.submittedAt.toISOString().split("T")[0];
        acc[dateKey] = (acc[dateKey] || 0) + 1;
        return acc;
      }, {});

      return {
        division: division.title,
        totalIssues,
        completedIssues,
        pendingIssues,
        priorityBreakdown,
        issuesOverTime,
      };
    });

    res.status(200).json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllDivisions = async (req, res) => {
  try {
    const divisions = await Division.find().populate("customerIssues");
    res.status(200).json(divisions);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve divisions", details: error.message });
  }
};

const createDivision = async (req, res) => {
  const { title } = req.body;
  try {
    const newDivision = new Division({ title });
    await newDivision.save();
    res.status(201).json({
      message: "Division successfully created",
      division: newDivision,
    });
  } catch (error) {
    res
      .status(400)
      .json({ error: "Failed to create division", details: error.message });
  }
};

const deleteDivision = async (req, res) => {
  const { divisionId } = req.params;
  try {
    const deletedDivision = await Division.findByIdAndDelete(divisionId);
    if (!deletedDivision) {
      return res.status(404).json({ message: "Division not found" });
    }
    res.status(200).json({ message: "Division deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to delete division", details: error.message });
  }
};

const assignIssueToDivision = async (req, res) => {
  const { divisionId } = req.params;
  const { issueId } = req.body;

  try {
    const issue = await Issue.findById(issueId);
    const division = await Team.findById(divisionId);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Add issue to the division's customerIssues array
    division.customerIssues.push(issue._id);
    await division.save();

    res.status(200).json({
      message: "Issue assigned to division successfully",
      division,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllDivisions,
  createDivision,
  deleteDivision,
  assignIssueToDivision,
  getInsights,
};
