import mongoose from 'mongoose'

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
      maxlength: [300, 'Question cannot exceed 300 characters'],
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
      maxlength: [2000, 'Answer cannot exceed 2000 characters'],
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

faqSchema.index({ isActive: 1, order: 1 })

const FAQ = mongoose.model('FAQ', faqSchema)
export default FAQ
