import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema(
  {
    degree: {
      type: String,
      default: '',
    },
    institution: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    startYear: {
      type: String,
      default: '',
    },
    endYear: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const experienceSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    startYear: {
      type: String,
      default: '',
    },
    endYear: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      default: '',
    },
    technologies: {
      type: String,
      default: '',
    },
    projectLink: {
      type: String,
      default: '',
    },
    startYear: {
      type: String,
      default: '',
    },
    endYear: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const additionalInformationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: '',
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: [],
    },
  },
  { _id: true }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      default: 'My Resume',
    },

    template: {
      type: String,
      default: 'classic',
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    lastViewedAt: {
      type: Date,
      default: null,
    },

    personal: {
      fullName: {
        type: String,
        default: '',
      },

      email: {
        type: String,
        default: '',
      },

      phone: {
        type: String,
        default: '',
      },

      location: {
        type: String,
        default: '',
      },

      website: {
        type: String,
        default: '',
      },
    },

    summary: {
      type: String,
      default: '',
    },

    education: {
      type: [educationSchema],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: [experienceSchema],
      default: [],
    },

    projects: {
      type: [projectSchema],
      default: [],
    },

    additionalInformation: {
      type: [additionalInformationSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
