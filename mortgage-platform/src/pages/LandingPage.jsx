import { useState, useMemo, useRef, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Shield,
  CheckCircle,
  BarChart2,
  Search,
  CreditCard,
  PenLine,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import RatesSection from "../components/RatesSection";
import FAQSection from "../components/FAQSection";
import businessLoanImg from "../assets/business_loan.png";
import personalLoanImg from "../assets/personal_loan.png";
import combinedLoanImg from "../assets/business-personal-loan.png";

/* ── Animated counter ── */
function AnimatedNumber({ target, prefix = "", suffix = "", style }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionVal.set(target);
  }, [isInView, motionVal, target]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref} style={style}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

/* ── Hero Loan Calculator ── */
function HeroCalc() {
  const [amount, setAmount] = useState(75000);
  const min = 5000;
  const max = 500000;

  const fmtFull = (v) => `₹${Number(v).toLocaleString("en-IN")}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative w-full"
    >
      {/* White floating card */}
      <div
        className="relative card p-8"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.06)" }}
      >
        <p
          className="type-ui text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: "#888888" }}
        >
          Select Loan Amount
        </p>
        <p
          className="type-number mb-5"
          style={{
            fontSize: "2.5rem",
            color: "#0a0a0a",
            letterSpacing: "-0.04em",
          }}
        >
          {fmtFull(amount)}
        </p>

        {/* Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={5000}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full mb-2"
          style={{
            background: `linear-gradient(to right, #a78bfa 0%, #4ecdc4 ${((amount - min) / (max - min)) * 50}%, #b5f23d ${((amount - min) / (max - min)) * 100}%, #e0e0e0 ${((amount - min) / (max - min)) * 100}%)`,
          }}
        />
        <div
          className="flex justify-between text-xs mb-6 font-bold"
          style={{ color: "#0a0a0a" }}
        >
          <span>₹5,000</span>
          <span>₹500,000</span>
        </div>

        <Link
          to="/apply"
          className="btn-primary w-full justify-center mb-4 text-base py-3.5"
        >
          Start Now
        </Link>

        <div
          className="flex items-center justify-center gap-4 text-xs font-medium"
          style={{ color: "#555555" }}
        >
          <span>50,000+ Users</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Shield size={14} /> Safe And Non-Binding
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Stats bar data ── */
const statsData = [
  {
    year: "2021–22",
    amount: 185,
    color: "#c4b5fd",
  } /* lavender  — matches image bar 1 */,
  {
    year: "2022–23",
    amount: 320,
    color: "#4ecdc4",
  } /* teal      — matches image bar 2 */,
  {
    year: "2023–24",
    amount: 553,
    color: "#a78bfa",
  } /* purple    — matches image bar 3 */,
  {
    year: "2024–25",
    amount: 786,
    color: "#b5f23d",
  } /* lime      — matches image bar 4 */,
];

/* ── Custom bar chart tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{
          background: "#0a0a0a",
          color: "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        }}
      >
        <p className="font-semibold mb-0.5">{label}</p>
        <p style={{ color: "#c8f542" }}>₹{payload[0].value} Cr</p>
      </div>
    );
  }
  return null;
}

/* ── Step card colors (exact from image) ── */
const stepCards = [
  {
    bg: "#4ecdc4" /* TEAL  — Step 1 in image */,
    step: "STEP 1",
    title: "Enter Your Details",
    desc: "Fill in your personal, employment, and income details in our quick guided form. Takes under 5 minutes.",
    icon: PenLine,
  },
  {
    bg: "#c4b5fd" /* LAVENDER — Step 2 in image */,
    step: "STEP 2",
    title: "Finding The Right Loans",
    desc: "Our system matches you with the best lenders and loan products suited to your profile and needs.",
    icon: Search,
  },
  {
    bg: "#b5f23d" /* LIME GREEN — Step 3 in image */,
    step: "STEP 3",
    title: "Payment Options",
    desc: "Choose your preferred repayment plan, EMI schedule, and disbursal timeline with full transparency.",
    icon: CreditCard,
  },
];

/* ── Product cards (exact from image) ── */

const productCards = [
  {
    label: "Business Loan",
    title: "Refreshingly Instant Business Loan",
    desc: "Quick approval, minimal documentation, and flexible repayment for your business growth.",
    accent: "#c4b5fd",
    bg: "#ede9fe",
    img: businessLoanImg,
    imgPosition: "left",
  },
  {
    label: "Personal Loan",
    title: "Individual Short Term Personal Loan",
    desc: "Fast personal loans for travel, medical, education, or any personal need with no collateral.",
    accent: "#b5f23d",
    bg: "#f3fde8",
    img: personalLoanImg,
    imgPosition: "right",
  },
];

/* ── Stagger children ── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function LandingPage() {
  return (
    <div style={{ background: "#ffffff" }}>
      {/* ══ HERO ══ */}
      <section className="relative isolate min-h-[92vh] flex items-center overflow-hidden bg-white">
        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main Green Glow */}
          <div
            className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 w-[1400px] h-[550px]"
            style={{
              background:
                "radial-gradient(circle, rgba(193,255,74,0.95) 0%, rgba(193,255,74,0.6) 35%, rgba(193,255,74,0.18) 65%, transparent 85%)",
              filter: "blur(100px)",
            }}
          />

          {/* Purple Tint Right */}
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[350px]"
            style={{
              background:
                "radial-gradient(circle, rgba(69, 195, 60, 0.83) 0%, rgba(115, 145, 60, 0.6) 35%, rgba(193,255,74,0.18) 65%, transparent 85%)",
              filter: "blur(100px)",
            }}
          />

          {/* Yellow Tint Left */}
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[280px]"
            style={{
              background:
                "radial-gradient(circle, rgba(149, 197, 60, 0.92) 0%, rgba(168, 222, 67, 0.6) 35%, rgba(193,255,74,0.18) 65%, transparent 85%)",
              filter: "blur(100px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center w-full">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
              style={{ background: "#f5f5f5", color: "#555555" }}
            >
              <span style={{ color: "#c8f542" }}>✦</span>
              Compare The Banks' Interest Rates
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="type-heading leading-[1.04] mb-6"
              style={{
                fontSize: "clamp(3rem, 6vw, 4.75rem)",
                color: "#0a0a0a",
              }}
            >
              Completely
              <br />
              Hassle-Free
              <br />
              Process.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="type-body text-lg mb-8 max-w-md"
              style={{ color: "#555555" }}
            >
              Simple, transparent, and built for India. Know what you qualify
              for in under 10 minutes — no fees, no pressure, no paperwork
              stress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="flex flex-col sm:flex-row gap-3 mb-7"
            >
              <Link to="/apply" className="btn-primary text-base py-4 px-8">
                Get Started
              </Link>

              <Link
                to="/signin"
                className="btn-green-outline text-base py-4 px-8"
              >
                Chat With Experts
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="flex items-center gap-5 text-sm"
              style={{ color: "#555555" }}
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle
                  size={15}
                  style={{ color: "#c8f542" }}
                  strokeWidth={2.5}
                />
                Safe and Secure
              </span>

              <span className="flex items-center gap-1.5">
                <CheckCircle
                  size={15}
                  style={{ color: "#c8f542" }}
                  strokeWidth={2.5}
                />
                No-Document Needed
              </span>
            </motion.div>
          </div>

          {/* Right Calculator */}
          <HeroCalc />
        </div>
      </section>

      {/* ══ LOAN PRODUCTS + WHY US ══ */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-7xl mx-auto">
          {/* Top row: Products + Combined Image */}
          <div className="grid lg:grid-cols-2 gap-12 items-stretch mb-16">
            {/* Left — heading + product cards */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="text-center lg:text-left"
            >
              <p className="section-label mb-3">Our Products</p>
              <h2
                className="type-heading leading-tight mb-8"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0a0a0a" }}
              >
                Why Should You Use
                <br />
                LoanSunami?
              </h2>

              {/* Product cards stacked */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-4"
              >
                {productCards.map(
                  ({ label, title, desc, accent, bg, img, imgPosition }, i) => (
                    <motion.div
                      key={label}
                      variants={itemVariants}
                      className="rounded-2xl overflow-hidden flex"
                      style={{
                        background: bg,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
                        minHeight: "200px",
                      }}
                      whileHover={{
                        y: -3,
                        boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {imgPosition === "left" && (
                        <div className="w-48 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={img}
                            alt={label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Text side */}
                      <div className="flex-1 p-8 flex flex-col justify-between">
                        <div>
                          <span
                            className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
                            style={{ background: accent, color: "#0a0a0a" }}
                          >
                            {label}
                          </span>
                          <h3
                            className="type-subheading mb-2 leading-snug"
                            style={{ fontSize: "1.1rem", color: "#0a0a0a" }}
                          >
                            {title}
                          </h3>
                          <p
                            className="type-body text-sm"
                            style={{ color: "#555555" }}
                          >
                            {desc}
                          </p>
                        </div>
                        <Link
                          to="/apply"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold mt-4"
                          style={{ color: "#0a0a0a" }}
                        >
                          Apply Now <ArrowRight size={13} />
                        </Link>
                      </div>

                      {imgPosition === "right" && (
                        <div className="w-48 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          <img
                            src={img}
                            alt={label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </motion.div>
                  ),
                )}
              </motion.div>
            </motion.div>

            {/* Right — combined loan image */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex"
            >
              <img
                src={combinedLoanImg}
                alt="Business and Personal Loans"
                className="rounded-3xl shadow-xl w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Bottom row — Stats + Why Us */}
          <div className="grid gap-12">
            {/* Stats / benefits */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  {
                    value: "₹782 Cr+",
                    label: "Loans Processed",
                    bg: "#f3fdc8",
                  },
                  { value: "50,000+", label: "Happy Customers", bg: "#ccfbf1" },
                  { value: "98%", label: "Approval Rate", bg: "#ede9fe" },
                  {
                    value: "< 10 min",
                    label: "Pre-approval Time",
                    bg: "#fef9c3",
                  },
                ].map(({ value, label, bg }) => (
                  <div
                    key={label}
                    className="rounded-2xl p-5 text-center"
                    style={{ background: bg }}
                  >
                    <p
                      className="type-number text-3xl mb-1"
                      style={{ color: "#0a0a0a" }}
                    >
                      {value}
                    </p>
                    <p
                      className="type-body text-xs"
                      style={{ color: "#555555" }}
                    >
                      {label}
                    </p>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl p-6"
                style={{ background: "#0a0a0a", color: "#ffffff" }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{ color: "#888888" }}
                >
                  Why us?
                </p>
                <ul className="space-y-3">
                  {[
                    "Compare 30+ banks in one place",
                    "Zero processing fee guarantee",
                    "Dedicated loan specialist support",
                    "Fully digital — apply from anywhere",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: "#c8f542" }}
                      >
                        <CheckCircle
                          size={12}
                          color="#0a0a0a"
                          strokeWidth={2.5}
                        />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/apply"
                  className="btn-green mt-5 w-full justify-center"
                >
                  Get Started Free
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section className="py-20 px-6" style={{ background: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p
                className="type-subheading mb-2"
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                  color: "#0a0a0a",
                  fontWeight: 700,
                }}
              >
                Loan Success Till Today —
              </p>
              <p
                className="type-heading leading-none mb-4"
                style={{
                  fontSize: "clamp(3rem, 6vw, 4.75rem)",
                  color: "#0a0a0a",
                }}
              >
                <AnimatedNumber
                  target={782}
                  prefix="₹"
                  suffix=" Cr+"
                  style={{ fontFamily: '"Times New Roman", Times, serif' }}
                />
              </p>
              <p className="type-body text-sm" style={{ color: "#888888" }}>
                Some previous stats of 'Growth / Year'
              </p>
              <div className="mt-6 flex gap-4">
                {statsData.map(({ year, color }) => (
                  <div key={year} className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ background: color }}
                    />
                    <span className="text-xs" style={{ color: "#888888" }}>
                      {year}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={statsData}
                  margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f0f0f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: "#888888", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `₹${v}Cr`}
                    tick={{ fill: "#888888", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {statsData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 px-6" style={{ background: "#f9f9f9" }}>
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2
              className="type-heading mb-3"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#0a0a0a" }}
            >
              How It Works?
            </h2>
            <p
              className="type-body text-base max-w-lg mx-auto"
              style={{ color: "#555555" }}
            >
              Three simple steps to get your loan approved and disbursed — fast,
              transparent, hassle-free.
            </p>
          </motion.div>

          {/* Step cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {stepCards.map(({ bg, step, title, desc, icon: Icon }) => (
              <motion.div
                key={step}
                variants={itemVariants}
                className="rounded-2xl p-8"
                style={{ background: bg }}
                whileHover={{
                  y: -4,
                  boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
                }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                >
                  <Icon size={22} color="#0a0a0a" strokeWidth={2} />
                </div>
                <p
                  className="type-ui text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(10,10,10,0.5)" }}
                >
                  {step}
                </p>
                <h3
                  className="type-subheading mb-3 leading-snug"
                  style={{ fontSize: "1.25rem", color: "#0a0a0a" }}
                >
                  {title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(10,10,10,0.65)" }}
                >
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-10">
            <Link to="/apply" className="btn-primary inline-flex">
              Start My Application <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ RATES ══ */}
      <RatesSection />

      {/* ══ FAQ ══ */}
      <FAQSection />

      {/* ══ FINAL CTA ══ */}
      <section className="py-20 px-6 pb-28 lg:pb-20" style={{ background: "#f9f9f9" }}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl p-12"
            style={{ background: "#0a0a0a" }}
          >
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "#888888" }}
            >
              Get Started Today
            </p>
            <h2
              className="font-extrabold text-white mb-4 leading-tight"
              style={{ fontSize: "2.25rem", letterSpacing: "-0.03em" }}
            >
              Ready to get your
              <br />
              loan approved?
            </h2>
            <p className="text-sm mb-8" style={{ color: "#888888" }}>
              No commitment. See your eligibility in under 10 minutes.
            </p>
            <Link
              to="/apply"
              className="btn-green inline-flex text-base px-10 py-4"
            >
              Get My Free Estimate <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: "#0a0a0a", paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            {
              heading: "LoanSunami",
              links: ["About Us", "Careers", "Press Room", "Social Impact"],
            },
            {
              heading: "Loan Types",
              links: [
                "Home Loan",
                "Business Loan",
                "Personal Loan",
                "Balance Transfer",
              ],
            },
            {
              heading: "Resources",
              links: ["Calculator", "Rate Updates", "FAQs", "Loan Guide"],
            },
            {
              heading: "Support",
              links: [
                "Talk to Us",
                "Privacy Policy",
                "Terms of Use",
                "Accessibility",
              ],
            },
          ].map(({ heading, links }) => (
            <div key={heading}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "#555555" }}
              >
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm transition-colors"
                      style={{ color: "#888888" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "#ffffff")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#888888")
                      }
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "#c8f542" }}
            >
              <span className="font-black text-xs" style={{ color: "#0a0a0a" }}>
                L
              </span>
            </div>
            <span
              className="font-black text-base tracking-tight text-white"
              style={{ letterSpacing: "-0.03em" }}
            >
              LoanSunami
            </span>
          </div>
          <p className="text-xs" style={{ color: "#555555" }}>
            © 2026 LoanSunami. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Disclosures"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-xs transition-colors"
                style={{ color: "#555555" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <p className="text-xs leading-relaxed" style={{ color: "#333333" }}>
            All loan products are subject to credit approval. Rates and terms
            subject to change without notice. LoanSunami Financial Pvt. Ltd. is
            a registered loan intermediary. This is not a commitment to lend.
          </p>
        </div>
      </footer>
    </div>
  );
}
