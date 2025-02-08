import { cn } from "@/lib/utils";
import {
  IconWallet,
  IconChartBar,
  IconPigMoney,
  IconReportMoney,
  IconChartPie,
  IconCalculator,
  IconBuildingBank,
  IconCoin,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Track Net Worth",
      description: "Monitor your total assets and liabilities in one place",
      icon: <IconWallet />,
    },
    {
      title: "Budget Planning",
      description: "Create and manage monthly budgets with ease",
      icon: <IconChartBar />,
    },
    {
      title: "Expense Tracking",
      description: "Log and categorize all your expenses automatically",
      icon: <IconPigMoney />,
    },
    {
      title: "Income Management",
      description: "Track multiple income sources in one dashboard",
      icon: <IconReportMoney />,
    },
    {
      title: "Visual Analytics",
      description: "Beautiful charts and graphs to visualize your finances",
      icon: <IconChartPie />,
    },
    {
      title: "Budget Calculator",
      description: "Powerful tools to plan your financial future",
      icon: <IconCalculator />,
    },
    {
      title: "Asset Tracking",
      description: "Keep track of all your investments and assets",
      icon: <IconBuildingBank />,
    },
    {
      title: "Financial Goals",
      description: "Set and track your financial goals with ease",
      icon: <IconCoin />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 px-6 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}; 