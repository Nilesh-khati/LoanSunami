/**
 * Seed script — populates DB with initial data
 * Run: node src/utils/seed.js
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/User.js'
import Lead from '../models/Lead.js'
import Rate from '../models/Rate.js'
import FAQ from '../models/FAQ.js'

const seed = async () => {
  await connectDB()
  console.log('🌱 Starting seed...\n')

  // ── Clear existing data ──────────────────────────────────────
  await Promise.all([
    User.deleteMany(),
    Lead.deleteMany(),
    Rate.deleteMany(),
    FAQ.deleteMany(),
  ])
  console.log('✅ Cleared existing data')

  // ── Admin user ───────────────────────────────────────────────
  // Pass plain text — User model pre('save') hook handles hashing
  const admin = await User.create({
    fullName: 'LoanSunami Admin',
    email: 'admin@loansunami.com',
    phone: '+91 98765 00000',
    password: 'Admin@123456',
    role: 'admin',
    isVerified: true,
  })
  console.log(`✅ Admin created: ${admin.email} / Admin@123456`)

  // ── Sample regular user ──────────────────────────────────────
  await User.create({
    fullName: 'Priya Sharma',
    email: 'priya@email.com',
    phone: '+91 98765 43210',
    password: 'User@12345',
    role: 'user',
    isVerified: true,
  })
  console.log('✅ Sample user created: priya@email.com / User@12345')

  // ── Interest rates ───────────────────────────────────────────
  const rates = await Rate.insertMany([
    {
      type: 'Home Loan',
      rate: '8.50%',
      rateValue: 8.5,
      trend: 'down',
      lender: 'SBI',
      tenure: 'Up to 30 yrs',
      isActive: true,
      order: 1,
      lastUpdatedBy: admin._id,
    },
    {
      type: 'Balance Transfer',
      rate: '8.75%',
      rateValue: 8.75,
      trend: 'stable',
      lender: 'HDFC',
      tenure: 'Up to 25 yrs',
      isActive: true,
      order: 2,
      lastUpdatedBy: admin._id,
    },
    {
      type: 'Plot Loan',
      rate: '9.20%',
      rateValue: 9.2,
      trend: 'up',
      lender: 'ICICI',
      tenure: 'Up to 20 yrs',
      isActive: true,
      order: 3,
      lastUpdatedBy: admin._id,
    },
    {
      type: 'Construction',
      rate: '9.00%',
      rateValue: 9.0,
      trend: 'down',
      lender: 'Axis',
      tenure: 'Up to 25 yrs',
      isActive: true,
      order: 4,
      lastUpdatedBy: admin._id,
    },
  ])
  console.log(`✅ ${rates.length} interest rates seeded`)

  // ── FAQs ─────────────────────────────────────────────────────
  const faqs = await FAQ.insertMany([
    {
      question: 'How quickly can I get pre-approved?',
      answer:
        'Our guided form takes under 5 minutes. Our team typically responds within 24 hours with a pre-approval decision and no credit impact.',
      isActive: true,
      order: 1,
      lastUpdatedBy: admin._id,
    },
    {
      question: 'What documents will I need?',
      answer:
        "Initially just your basic details. For formal approval you'll need income proof (salary slips / ITR), bank statements, property documents, and ID proof.",
      isActive: true,
      order: 2,
      lastUpdatedBy: admin._id,
    },
    {
      question: 'Is my financial data safe?',
      answer:
        'Absolutely. All data is encrypted in transit and at rest using bank-grade security standards. We never share your information without your consent.',
      isActive: true,
      order: 3,
      lastUpdatedBy: admin._id,
    },
    {
      question: "Can I apply if I'm self-employed?",
      answer:
        'Yes. We work with lenders who have tailored products for self-employed individuals. Your last 2 years of ITR and business financials are typically required.',
      isActive: true,
      order: 4,
      lastUpdatedBy: admin._id,
    },
    {
      question: 'What is the maximum loan amount I can get?',
      answer:
        "Typically up to 80% of the property value, depending on your income, existing liabilities, credit score, and the lender's policies.",
      isActive: true,
      order: 5,
      lastUpdatedBy: admin._id,
    },
  ])
  console.log(`✅ ${faqs.length} FAQs seeded`)

  // ── Sample leads ─────────────────────────────────────────────
  const leadsData = [
    {
      firstName: 'Priya', lastName: 'Sharma', email: 'priya@email.com',
      phone: '+91 98765 43210', employmentType: 'Salaried',
      employer: 'TechCorp Pvt. Ltd.', monthlyIncome: 120000,
      loanAmount: 5000000, loanPurpose: 'Home Purchase', tenure: '20 years',
      propertyLocation: 'Mumbai, Maharashtra', propertyValue: 7000000,
      monthlyExpenses: 35000, existingLoans: 0, creditScore: '750–800',
      status: 'New', city: 'Mumbai',
    },
    {
      firstName: 'Rahul', lastName: 'Mehta', email: 'rahul@email.com',
      phone: '+91 87654 32109', employmentType: 'Business Owner',
      employer: 'Mehta Enterprises', monthlyIncome: 200000,
      loanAmount: 8000000, loanPurpose: 'Home Construction', tenure: '25 years',
      propertyLocation: 'Delhi, NCR', propertyValue: 12000000,
      monthlyExpenses: 60000, existingLoans: 15000, creditScore: 'Above 800',
      status: 'Contacted', city: 'Delhi',
    },
    {
      firstName: 'Anjali', lastName: 'Patel', email: 'anjali@email.com',
      phone: '+91 76543 21098', employmentType: 'Salaried',
      employer: 'Infosys Ltd.', monthlyIncome: 90000,
      loanAmount: 3500000, loanPurpose: 'Balance Transfer', tenure: '15 years',
      propertyLocation: 'Bangalore, Karnataka', propertyValue: 5000000,
      monthlyExpenses: 25000, existingLoans: 22000, creditScore: '700–750',
      status: 'Qualified', city: 'Bangalore',
    },
    {
      firstName: 'Vikram', lastName: 'Singh', email: 'vikram@email.com',
      phone: '+91 65432 10987', employmentType: 'Salaried',
      employer: 'Wipro Limited', monthlyIncome: 350000,
      loanAmount: 12000000, loanPurpose: 'Home Purchase', tenure: '30 years',
      propertyLocation: 'Pune, Maharashtra', propertyValue: 18000000,
      monthlyExpenses: 80000, existingLoans: 0, creditScore: 'Above 800',
      status: 'New', city: 'Pune',
    },
    {
      firstName: 'Sneha', lastName: 'Nair', email: 'sneha@email.com',
      phone: '+91 54321 09876', employmentType: 'Salaried',
      employer: 'HCL Technologies', monthlyIncome: 150000,
      loanAmount: 6000000, loanPurpose: 'Plot Purchase', tenure: '20 years',
      propertyLocation: 'Chennai, Tamil Nadu', propertyValue: 8500000,
      monthlyExpenses: 40000, existingLoans: 10000, creditScore: '750–800',
      status: 'Closed', city: 'Chennai',
    },
    {
      firstName: 'Amit', lastName: 'Kumar', email: 'amit@email.com',
      phone: '+91 43210 98765', employmentType: 'Self-Employed',
      employer: 'Kumar Associates', monthlyIncome: 110000,
      loanAmount: 4500000, loanPurpose: 'Home Renovation', tenure: '10 years',
      propertyLocation: 'Hyderabad, Telangana', propertyValue: 6000000,
      monthlyExpenses: 30000, existingLoans: 8000, creditScore: '650–700',
      status: 'Contacted', city: 'Hyderabad',
    },
  ]

  const leads = await Lead.insertMany(leadsData)
  console.log(`✅ ${leads.length} sample leads seeded`)

  console.log('\n🎉 Seed complete!\n')
  console.log('Admin login: admin@loansunami.com / Admin@123456')
  console.log('User login:  priya@email.com / User@12345')
  console.log('Server: http://localhost:5000/api')

  await mongoose.connection.close()
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message)
  process.exit(1)
})
