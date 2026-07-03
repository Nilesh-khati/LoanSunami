import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema(
  {
    // ── Step 1: Personal Information ──────────────────
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[+\d\s\-()]{7,20}$/, 'Please provide a valid phone number'],
    },
    dob: {
      type: Date,
    },

    // ── Step 2: Employment & Income ───────────────────
    employmentType: {
      type: String,
      enum: ['Salaried', 'Self-Employed', 'Business Owner', 'Freelancer', 'Retired', ''],
      default: '',
    },
    employer: {
      type: String,
      trim: true,
      maxlength: [100, 'Employer name cannot exceed 100 characters'],
    },
    monthlyIncome: {
      type: Number,
      min: [0, 'Monthly income cannot be negative'],
    },
    workExperience: {
      type: String,
      enum: ['< 1 year', '1–3 years', '3–5 years', '5–10 years', '10+ years', ''],
      default: '',
    },

    // ── Step 3: Loan Requirements ─────────────────────
    loanAmount: {
      type: Number,
      required: [true, 'Loan amount is required'],
      min: [10000, 'Minimum loan amount is ₹10,000'],
    },
    loanPurpose: {
      type: String,
      enum: [
        'Home Purchase',
        'Home Construction',
        'Home Renovation',
        'Plot Purchase',
        'Balance Transfer',
        'Business Loan',
        'Personal Loan',
        'Home Loan',
        '',
      ],
      default: '',
    },
    tenure: {
      type: String,
      enum: [
        '1 year', '2 years', '3 years', '5 years', '7 years',
        '10 years', '15 years', '20 years', '25 years', '30 years', '',
      ],
      default: '',
    },
    downPayment: {
      type: Number,
      min: [0, 'Down payment cannot be negative'],
      default: 0,
    },

    // ── Step 4: Property Information ──────────────────
    propertyType: {
      type: String,
      enum: ['Apartment', 'Independent House', 'Villa', 'Plot', 'Commercial Property', ''],
      default: '',
    },
    propertyLocation: {
      type: String,
      trim: true,
      maxlength: [200, 'Property location cannot exceed 200 characters'],
    },
    propertyValue: {
      type: Number,
      min: [0, 'Property value cannot be negative'],
      default: 0,
    },

    // ── Step 5: Financial Snapshot ────────────────────
    monthlyExpenses: {
      type: Number,
      min: [0, 'Monthly expenses cannot be negative'],
      default: 0,
    },
    existingLoans: {
      type: Number,
      min: [0, 'Existing loans EMI cannot be negative'],
      default: 0,
    },
    creditScore: {
      type: String,
      enum: ['Below 600', '600–650', '650–700', '700–750', '750–800', 'Above 800', "Don't Know", ''],
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },

    // ── Admin / CRM fields ────────────────────────────
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Qualified', 'Closed'],
      default: 'New',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    adminNotes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Admin notes cannot exceed 2000 characters'],
    },

    // Derived / computed
    city: {
      type: String,
      trim: true,
    },

    // Reference to registered user (if they were signed in)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },

    // Email notification sent flag
    emailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Virtual: full name
leadSchema.virtual('name').get(function () {
  return `${this.firstName} ${this.lastName}`
})

// Before saving, extract city from propertyLocation if not set
leadSchema.pre('save', function (next) {
  if (this.propertyLocation && !this.city) {
    // Extract city: take first part before comma
    const parts = this.propertyLocation.split(',')
    this.city = parts[0].trim()
  }
  next()
})

// Indexes
leadSchema.index({ email: 1 })
leadSchema.index({ status: 1 })
leadSchema.index({ createdAt: -1 })

const Lead = mongoose.model('Lead', leadSchema)
export default Lead
