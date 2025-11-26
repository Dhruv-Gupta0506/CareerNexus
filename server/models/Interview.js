const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"], // ensures valid difficulty
    },

    questionCount: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },

    // AI-generated questions
    questions: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    // User's submitted answers
    answers: {
      type: [String],
      required: true,
      validate: (v) => Array.isArray(v) && v.length > 0,
    },

    // AI evaluation text
    evaluationText: {
      type: String,
      required: true,
    },

    // Final score extracted from AI output
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    // Helpful metadata for better analytics
    meta: {
      timeTakenSeconds: { type: Number, default: null },
      answerWordCount: { type: Number, default: null },
    },
  },
  { timestamps: true } // auto manages createdAt + updatedAt
);

module.exports = mongoose.model("Interview", InterviewSchema);
