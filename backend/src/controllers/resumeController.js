import Resume from "../models/Resume.js";
import crypto from "crypto";

export const createResume = async (req, res) => {
  try {
    const resume = await Resume.create({
      user: req.user.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: "Resume created successfully",
      resume,
    });
  } catch (error) {
    console.error(
      "Create resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to create resume",
    });
  }
};

export const getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.userId,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      resumes,
    });
  } catch (error) {
    console.error(
      "Get resumes error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to get resumes",
    });
  }
};

export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error(
      "Get resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to get resume",
    });
  }
};

export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        $set: req.body,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume updated successfully",
      resume,
    });
  } catch (error) {
    console.error(
      "Update resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to update resume",
    });
  }
};

export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to delete resume",
    });
  }
};

export const toggleResumeSharing = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    if (!resume.isPublic) {
      if (!resume.shareToken) {
        resume.shareToken = crypto.randomBytes(24).toString("hex");
      }

      resume.isPublic = true;
    } else {
      resume.isPublic = false;
    }

    await resume.save();

    return res.status(200).json({
      message: resume.isPublic
        ? "Resume is now public"
        : "Resume is now private",
      isPublic: resume.isPublic,
      shareToken: resume.isPublic
        ? resume.shareToken
        : null,
    });
  } catch (error) {
    console.error(
      "Toggle resume sharing error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to update sharing settings",
    });
  }
};

export const getPublicResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      {
        shareToken: req.params.shareToken,
        isPublic: true,
      },
      {
        $inc: {
          views: 1,
        },
        $set: {
          lastViewedAt: new Date(),
        },
      },
      {
        new: true,
      }
    ).select("-user");

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or is private",
      });
    }

    return res.status(200).json({
      resume,
    });
  } catch (error) {
    console.error(
      "Get public resume error:",
      error.message
    );

    return res.status(500).json({
      message: "Failed to get public resume",
    });
  }
};
