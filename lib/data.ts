// /lib/data.ts
import {
  LayoutDashboard,
  Users,
  Shield,
  ListCheck,
  Key,
  DollarSign,
  TrendingUp,
  CreditCard,
  Wallet,
  ShoppingCart,
  PiggyBank,
  Calendar,
  FileChartColumnIncreasing,
} from "lucide-react";

// User information
export const user = {
  name: "Spentra",
  email: "spentra@example.com",
  avatar: "/avatars/shadcn.jpg",
};

// Navigation for dashboard overview
export const navOverview = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/overview/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
];

// Access control section
export const navAccessControl = [
  {
    title: "Access Control",
    items: [
      {
        title: "User Management",
        url: "/access-control/user-management",
        icon: Users,
      },
      {
        title: "Role Management",
        url: "/access-control/role-management",
        icon: Shield,
      },
      {
        title: "Permission Management",
        url: "/access-control/permission-management",
        icon: ListCheck,
      },
      {
        title: "Access Key Management",
        url: "/access-control/access-key-management",
        icon: Key,
      },
    ],
  },
];

// Master data section
export const navMasterData = [
  {
    title: "Master Data",
    items: [
      {
        title: "Expense Category",
        url: "/master-data/expense-category",
        icon: DollarSign,
      },
      {
        title: "Income Source",
        url: "/master-data/income-source",
        icon: TrendingUp,
      },
      {
        title: "Payment Method",
        url: "/master-data/payment-method",
        icon: CreditCard,
      },
      {
        title: "Bank",
        url: "/master-data/bank",
        icon: Wallet,
      },
    ],
  },
];

// Financials section
export const navFinancials = [
  {
    title: "Financial",
    items: [
      {
        title: "Expense Management",
        url: "/financial/expense-management",
        icon: ShoppingCart,
      },
      {
        title: "Income Management",
        url: "/financial/income-management",
        icon: PiggyBank,
      },
      {
        title: "Budget Management",
        url: "/financial/budget-management",
        icon: Calendar,
      },
      {
        title: "Reports",
        url: "/financial/report-management",
        icon: FileChartColumnIncreasing,
        subItems: [
          {
            title: "Expense Report",
            url: "/financial/report-management/expense-report",
          },
          {
            title: "Income Report",
            url: "/financial/report-management/income-report",
          },
          {
            title: "Budget Report",
            url: "/financial/report-management/budget-report",
          },
        ],
      },
    ],
  },
];

// Reports section
// export const navReports = [
//   {
//     title: "Reports",
//     items: [
//       {
//         title: "Expense Report",
//         url: "/reports/expense",
//         icon: FileChartColumn,
//       },
//       {
//         title: "Income Report",
//         url: "/reports/income",
//         icon: FileChartColumnIncreasing,
//       },
//       {
//         title: "Budget Report",
//         url: "/reports/budget",
//         icon: FileChartLine,
//       },
//     ],
//   },
// ];

// Export all navigation together for easy iteration
export const allNavGroups = [
  ...navOverview,
  ...navAccessControl,
  ...navMasterData,
  ...navFinancials,
];

export const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "🎨",
    testimonial:
      "Spentra helped me finally understand where my money was going. I saved 30% on monthly expenses in just 3 months.",
  },
  {
    name: "Marcus Johnson",
    role: "Software Engineer",
    avatar: "💻",
    testimonial:
      "The automatic categorization is a game-changer. No more manual tracking. It just works seamlessly.",
  },
  {
    name: "Emma Wilson",
    role: "Business Owner",
    avatar: "📊",
    testimonial:
      "The insights dashboard gives me clarity on my spending patterns. Essential tool for my financial planning.",
  },
  {
    name: "Priya Sharma",
    role: "Product Manager",
    avatar: "🚀",
    testimonial:
      "I've tried every budgeting app out there. Spentra is the only one that actually stuck. The UX is just right.",
  },
  {
    name: "Jake Torres",
    role: "Startup Founder",
    avatar: "💡",
    testimonial:
      "Tracking burn rate for my startup is so much easier now. The export feature alone saves me hours each month.",
  },
  {
    name: "Nia Okafor",
    role: "Nurse Practitioner",
    avatar: "🏥",
    testimonial:
      "Finally an app that doesn't require a finance degree to use. Set it up in 10 minutes and it's been running itself.",
  },
  {
    name: "Chris Daniels",
    role: "Content Creator",
    avatar: "🎬",
    testimonial:
      "My income is irregular but Spentra adapts. The variable income mode is something no other app offers.",
  },
  {
    name: "Lena Park",
    role: "UX Researcher",
    avatar: "🔬",
    testimonial:
      "The spending heatmap is brilliant. I immediately spotted patterns I never would have noticed in a spreadsheet.",
  },
  {
    name: "David Osei",
    role: "Accountant",
    avatar: "📁",
    testimonial:
      "I recommend Spentra to all my clients now. The category rules engine is surprisingly powerful for a consumer app.",
  },
  {
    name: "Mia Rosenberg",
    role: "Grad Student",
    avatar: "📚",
    testimonial:
      "Living on a tight budget, every dollar counts. Spentra helped me cut $200/month I didn't even know I was wasting.",
  },
  {
    name: "Carlos Mendez",
    role: "Real Estate Agent",
    avatar: "🏠",
    testimonial:
      "Commission income made budgeting a nightmare. Spentra's forecasting changed everything for my financial planning.",
  },
  {
    name: "Sofia Novak",
    role: "Photographer",
    avatar: "📷",
    testimonial:
      "Gear expenses used to derail my whole budget. Now I have a dedicated category with smart alerts. Lifesaver.",
  },
  {
    name: "Aaron Lee",
    role: "Financial Analyst",
    avatar: "📈",
    testimonial:
      "Even as someone who works in finance, Spentra surfaces insights about my personal spending I genuinely missed.",
  },
  {
    name: "Fatima Al-Hassan",
    role: "Teacher",
    avatar: "🎓",
    testimonial:
      "I finally paid off my credit card after using Spentra for 6 months. Seeing the numbers laid out just motivates you.",
  },
  {
    name: "Ryan Kowalski",
    role: "Personal Trainer",
    avatar: "💪",
    testimonial:
      "I run my own training business and Spentra keeps my personal and business expenses from bleeding into each other.",
  },
  {
    name: "Aisha Patel",
    role: "Marketing Lead",
    avatar: "📣",
    testimonial:
      "The weekly summary email is the one financial email I actually look forward to. Keeps me honest without being stressful.",
  },
  {
    name: "Tom Nguyen",
    role: "DevOps Engineer",
    avatar: "⚙️",
    testimonial:
      "I set up the API integration with my bank in under 5 minutes. Clean docs, zero friction. Rare for a fintech product.",
  },
  {
    name: "Isabella Cruz",
    role: "Interior Designer",
    avatar: "🛋️",
    testimonial:
      "Client project budgets and personal finances finally feel separate and manageable. Spentra made that possible.",
  },
  {
    name: "James Whitfield",
    role: "Retired Engineer",
    avatar: "🔧",
    testimonial:
      "Managing a fixed retirement income is stressful. Spentra gives me a clear picture every month with zero hassle.",
  },
  {
    name: "Zoe Hartmann",
    role: "Clinical Psychologist",
    avatar: "🧠",
    testimonial:
      "Financial anxiety is real. Spentra actually reduced mine by replacing vague dread with concrete, actionable numbers.",
  },
  {
    name: "Ethan Brooks",
    role: "E-commerce Manager",
    avatar: "🛒",
    testimonial:
      "Separating inventory costs from personal spending used to be messy. Spentra keeps everything clean and easy to track.",
  },
];
