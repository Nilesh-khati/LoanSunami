import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import faqsApi from '../api/faqs.js'

// Fallback data if API is unavailable
const FALLBACK_FAQS = [
  { q: 'How quickly can I get pre-approved?',        a: 'Our guided form takes under 5 minutes. Our team typically responds within 24 hours with a pre-approval decision and no credit impact.' },
  { q: 'What documents will I need?',                a: "Initially just your basic details. For formal approval you'll need income proof (salary slips / ITR), bank statements, property documents, and ID proof." },
  { q: 'Is my financial data safe?',                 a: 'Absolutely. All data is encrypted in transit and at rest using bank-grade security standards. We never share your information without your consent.' },
  { q: "Can I apply if I'm self-employed?",          a: 'Yes. We work with lenders who have tailored products for self-employed individuals. Your last 2 years of ITR and business financials are typically required.' },
  { q: 'What is the maximum loan amount I can get?', a: "Typically up to 80% of the property value, depending on your income, existing liabilities, credit score, and the lender's policies." },
]

export default function FAQSection() {
  const [open, setOpen]   = useState(null)
  const [faqs, setFaqs]   = useState(FALLBACK_FAQS.map((f, i) => ({ _id: i, question: f.q, answer: f.a })))

  useEffect(() => {
    let mounted = true
    faqsApi.getAll()
      .then(res => {
        if (mounted && res.data && res.data.length > 0) {
          setFaqs(res.data)
        }
      })
      .catch(() => {
        // silently fall back to static data
      })
    return () => { mounted = false }
  }, [])

  return (
    <section className="py-20 px-6" id="faq" style={{ background: '#ffffff' }}>
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="section-label mb-2">FAQ</p>
          <h2
            className="font-extrabold"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#0a0a0a', letterSpacing: '-0.03em' }}
          >
            Common Questions
          </h2>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl overflow-hidden"
              style={{
                border: `1.5px solid ${open === i ? '#0a0a0a' : '#eeeeee'}`,
                background: '#ffffff',
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span
                  className="font-medium text-sm pr-4"
                  style={{ color: open === i ? '#0a0a0a' : '#555555' }}
                >
                  {faq.question}
                </span>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ background: open === i ? '#0a0a0a' : '#f5f5f5' }}
                >
                  {open === i
                    ? <Minus size={13} color="#ffffff" />
                    : <Plus size={13} style={{ color: '#0a0a0a' }} />
                  }
                </div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#555555' }}>
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
