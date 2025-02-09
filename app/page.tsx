import { HeroSection } from "@/components/blocks/hero-section";
import { FeaturesSectionWithHoverEffects } from "@/components/blocks/feature-section";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main>
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold">Radium</span>
            </div>
            <div className="flex items-center">
              <Button asChild variant="ghost" className="mr-2">
                <a href="/login">Login</a>
              </Button>
              <Button asChild>
                <a href="/dashboard">Go to Radium</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="relative">
          <HeroSection
            title="Take Control of Your Finances"
            description="Track your net worth, manage budgets, and achieve your financial goals with our comprehensive personal finance dashboard."
            actions={[
              {
                text: "Get Started",
                href: "/signup",
              },
            ]}
            image={{
              light: "/dashboard-light.png",
              dark: "/dashboard-dark.png",
              alt: "Dashboard preview",
            }}
          />

          {/* Screenshot Section */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-20">
            <div className="relative rounded-xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_0_50px_-12px_rgba(255,255,255,0.15)]">
              <img
                src="/radium_screenshot.png"
                alt="Radium Dashboard"
                className="w-full h-auto relative z-0"
              />
            </div>
          </div>
        </div>
      </div>

      <FeaturesSectionWithHoverEffects />
    </main>
  );
} 