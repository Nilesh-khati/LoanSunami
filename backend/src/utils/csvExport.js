/**
 * Convert an array of lead objects to CSV string
 */
export const leadsToCSV = (leads) => {
  const headers = [
    'ID',
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Date of Birth',
    'Employment Type',
    'Employer',
    'Monthly Income',
    'Work Experience',
    'Loan Amount',
    'Loan Purpose',
    'Tenure',
    'Down Payment',
    'Property Type',
    'Property Location',
    'Property Value',
    'Monthly Expenses',
    'Existing EMIs',
    'Credit Score',
    'Notes',
    'Status',
    'City',
    'Submitted At',
  ]

  const escape = (val) => {
    if (val === null || val === undefined) return ''
    const str = String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const rows = leads.map((lead) => [
    lead._id,
    lead.firstName,
    lead.lastName,
    lead.email,
    lead.phone,
    lead.dob ? new Date(lead.dob).toLocaleDateString('en-IN') : '',
    lead.employmentType,
    lead.employer,
    lead.monthlyIncome,
    lead.workExperience,
    lead.loanAmount,
    lead.loanPurpose,
    lead.tenure,
    lead.downPayment,
    lead.propertyType,
    lead.propertyLocation,
    lead.propertyValue,
    lead.monthlyExpenses,
    lead.existingLoans,
    lead.creditScore,
    lead.notes,
    lead.status,
    lead.city,
    new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  ])

  const csvRows = [headers, ...rows]
  return csvRows.map((row) => row.map(escape).join(',')).join('\n')
}
