import mongoose from 'mongoose'

const rateSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Loan type is required'],
      trim: true,
      maxlength: [100, 'Loan type cannot exceed 100 characters'],
    },
    rate: {
      type: String,
      required: [true, 'Rate is required'],
      trim: true,
      // stored as display string e.g. "8.50%"
    },
    rateValue: {
      type: Number,
      required: [true, 'Rate value is required'],
      min: [0, 'Rate cannot be negative'],
      max: [50, 'Rate seems unreasonably high'],
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
    lender: {
      type: String,
      required: [true, 'Lender name is required'],
      trim: true,
    },
    tenure: {
      type: String,
      required: [true, 'Tenure is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

rateSchema.index({ isActive: 1, order: 1 })

const Rate = mongoose.model('Rate', rateSchema)
export default Rate
