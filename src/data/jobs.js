export const APPLICATION_RECIPIENTS = [
  'medhaj@2mscorporation.com',
  'megha@2mscorporation.com',
  'pranaya@2mscorporation.com',
]

export const jobs = [
  {
    slug: 'corporate-president',
    title: 'Corporate President',
    department: 'Executive Leadership',
    type: 'Full-time, Exempt',
    location: 'California (On-site / Hybrid)',
    reportsTo: 'Chief Executive Officer / Founder / Principal',
    directReports:
      'Finance/Accounting, HR/Administration, Contracts, Project Operations and Business Systems staff (current and future)',
    summary:
      "The Corporate President is the firm's senior business leader below the CEO. This position owns financial strategy and the day-to-day operations and administration of the business, and builds the infrastructure, people and processes needed to grow the firm from a small practice to a medium-sized consultancy. The Corporate President is a hands-on executive who leads the finance function, runs project delivery operations, and ensures the firm grows profitably and compliantly while protecting its reputation with public agency and private sector clients.",
    duties: [
      {
        title: 'Strategic Planning and Growth',
        weight: 25,
        items: [
          'Partner with the CEO to develop and execute a multi-year strategic and growth plan, including revenue targets, service line expansion, market entry, and potential acquisitions or teaming arrangements.',
          'Build the organizational structure, staffing plan and operating model required to scale from small to medium size.',
          'Establish company-wide goals, KPIs and dashboards (utilization, backlog, win rate, realization, margin, cash) and report progress to the CEO and ownership.',
          'Support business development by providing pricing strategy, proposal cost volumes, and risk review on major pursuits.',
        ],
      },
      {
        title: 'Financial Management and Reporting',
        weight: 30,
        items: [
          'Direct accounting, bookkeeping, accounts payable and receivable, payroll, billing and collections; deliver accurate monthly financial statements on a timely close schedule.',
          'Develop annual budgets, rolling forecasts, cash flow projections and project-level profitability analysis.',
          'Develop and maintain indirect cost rate structure (overhead, fringe, G&A) and prepare annual rate schedules and incurred cost submittals consistent with FAR/Caltrans and other agency requirements, as applicable.',
          'Manage banking relationships, lines of credit, working capital and financing needs; oversee capital investment decisions.',
          'Oversee tax planning and compliance with outside CPAs, including entity structure, California and federal filings, and audit support.',
          'Maintain strong internal controls, audit readiness and financial risk management.',
        ],
      },
      {
        title: 'Operations and Project Delivery',
        weight: 25,
        items: [
          'Oversee project operations, resource planning and staff utilization to ensure projects are delivered on scope, schedule and budget.',
          'Implement and manage project controls, including time and expense tracking, earned value or percent-complete reporting, subconsultant management and change order processes.',
          'Establish quality assurance and quality control procedures and standard operating procedures across service lines.',
          'Select, implement and optimize business systems (accounting/ERP, project management, timekeeping, CRM) and technology to improve efficiency.',
          'Manage subconsultant, vendor and teaming agreements, and monitor performance.',
        ],
      },
      {
        title: 'Administration, Contracts and Compliance',
        weight: 10,
        items: [
          'Oversee contract administration, including review of client agreements, terms and conditions, indemnification, insurance and limitation of liability provisions, with outside counsel as needed.',
          "Manage insurance programs (professional liability, general liability, workers' compensation, cyber) and risk management.",
          'Ensure compliance with applicable regulations, including DBE/SBE/DVBE certification and reporting requirements, prevailing wage, state licensing, and employment law.',
          'Oversee corporate records, facilities, IT, vendor contracts and other administrative functions.',
        ],
      },
      {
        title: 'People and Culture',
        weight: 10,
        items: [
          'Lead recruiting, onboarding, compensation, benefits, performance management and professional development; oversee HR policies and the employee handbook.',
          'Build a high-performing management team, coach emerging leaders and plan for succession.',
          'Promote a culture of accountability, technical excellence, client service and ethical conduct.',
        ],
      },
    ],
    skills: [
      'Expert knowledge of GAAP, management accounting, budgeting, forecasting and professional services financial models.',
      'Working knowledge of government contracting cost principles and indirect rate development (preferred).',
      'Proven ability to build systems and scale operations in a growing professional services firm.',
      'Strong leadership, communication and negotiation skills with the ability to advise the CEO and present to clients, lenders and ownership.',
      'Sound judgment, high integrity and the ability to balance strategic thinking with hands-on execution.',
      'Proficiency with accounting and project management platforms (for example, Deltek Vision/Vantagepoint, QuickBooks, NetSuite, or similar) and advanced Excel.',
    ],
    conditions: [
      'Primarily office-based work with periodic travel to client, project and partner sites.',
      'Extended hours may be required during month-end, year-end, proposal deadlines and audits.',
      'Ability to use a computer and standard office equipment for extended periods.',
    ],
    disclaimer:
      'This duty statement describes the general nature and level of work and is not an exhaustive list of all responsibilities. Duties may be adjusted as the business evolves.',
  },
]

export const getJob = (slug) => jobs.find((j) => j.slug === slug)
