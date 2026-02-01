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
