# **Product Requirements Document (PRD) for Cursor**

# **1. Project Overview**

- **Project Name:** Radium
- **Description:**
- **Objective:** (What problem does this solve? Who is the user?)
- **Tech Stack:**
    - **Frontend Framework:** (e.g., React, Vue, Next.js, etc.)
    - **UI Library:** (e.g., ShadCN/UI, Material UI, Bootstrap, Tailwind, etc.)
    - **Backend:** (e.g., Node.js, Python/Flask, Django, etc.)
    - **Database:** (e.g., PostgreSQL, MySQL, Firebase, MongoDB)
    - **API Framework:** (e.g., REST, GraphQL)
    - **Authentication Method:** (e.g., JWT, OAuth, Firebase Auth)

# **2. Database Schema**

For each database table, define its structure:

- We need to create a database in supabase, as well as a copy that we can reference for knowledge, but not actually pull any values from in this codebase. To create the supabase table, give me sql code and I will create the tables in Supabase. To create the copy of supabase table, make it a markdown file type and call it “copy_of supabase”.
- create a env local file with these keys for supabase:
    - project_url: [https://prnrjnobwvxvdjnovlhq.supabase.co](https://prnrjnobwvxvdjnovlhq.supabase.co/)
    - project api key anon: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBybnJqbm9id3Z4dmRqbm92bGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMTgzNjQsImV4cCI6MjA1MDg5NDM2NH0.S3XTui_Zi_i8GVzLchLvDF2BhFXEwGAfZMKURPNaEQY

### net_worth_log

- **Description:** table to track the logs created on the net worth page. Used to calculate net worth at different points in time.
- **Columns:**

| Column Name | Data Type | Constraints (e.g., NOT NULL, UNIQUE) | Description |
| --- | --- | --- | --- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| userid | UUID |  | pull from the supabase auth |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| deleted_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| date | date |  | the date of the user input, not the created_at timestamp |
| `title` | JSON | NOT NULL | JSON column that stores multiple titles as keys. Each key represents a user-defined title (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |
| `value` | JSON | NOT NULL | JSON column that stores the corresponding values for the titles (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |

### transactions

- **Description:** table to track the logs created on the net worth page. Used to calculate net worth at different points in time.
- **Columns:**

| Column Name | Data Type | Constraints (e.g., NOT NULL, UNIQUE) | Description |
| --- | --- | --- | --- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| userid | UUID |  | pull from the supabase auth |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| deleted_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| date | date |  | the date of the user input, not the created_at timestamp |
| `title` | JSON | NOT NULL | JSON column that stores multiple titles as keys. Each key represents a user-defined title (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |
| `value` | JSON | NOT NULL | JSON column that stores the corresponding values for the titles (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |
| transaction_type | varchar | NOT NULL | Either “income” or “expense” |
| category | varchar | NOT NULL |  |

### planned_budget

- **Description:** table to track the logs created on the net worth page. Used to calculate net worth at different points in time.
- **Columns:**

| Column Name | Data Type | Constraints (e.g., NOT NULL, UNIQUE) | Description |
| --- | --- | --- | --- |
| `id` | UUID | PRIMARY KEY | Unique identifier |
| userid | UUID |  | pull from the supabase auth |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of creation |
| `updated_at` | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| deleted_at | TIMESTAMP | ON UPDATE CURRENT_TIMESTAMP | Last updated timestamp |
| date | date |  | the date of the user input, not the created_at timestamp |
| `title` | JSON | NOT NULL | JSON column that stores multiple titles as keys. Each key represents a user-defined title (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |
| `value` | JSON | NOT NULL | JSON column that stores the corresponding values for the titles (e.g., `{ "Height": "6 ft", "Weight": "150 lbs" }`). |
| transaction_type | varchar | NOT NULL | Either “income” or “expense” |
| category | varchar | NOT NULL |  |

# **3. Pages & UI Components**

For each page in the project, fill out the following template:

### 3.1 Landing Page

1. **Page URL:** `/`
2. **Main Page Objective:** A landing page where potential users can learn about the product. They can also sign up for the app or sign in.
3. Sections
    - Hero Section
        
        The first section on the page should be the hero section. Copy-paste this component to /components/ui folder:
        
        Call it “hero-section”. Change the copy to be good copy for the product based on what you know. Remove the github button and center the get started button.
        
        ```tsx
        hero-section.tsx
        "use client";
        
        import { Button } from "@/components/ui/button";
        import { Badge } from "@/components/ui/badge";
        import { ArrowRightIcon } from "lucide-react";
        import { Mockup, MockupFrame } from "@/components/ui/mockup";
        import { Glow } from "@/components/ui/glow";
        import Image from "next/image";
        import { useTheme } from "next-themes";
        import { cn } from "@/lib/utils";
        
        interface HeroAction {
          text: string;
          href: string;
          icon?: React.ReactNode;
          variant?: "default" | "glow";
        }
        
        interface HeroProps {
          badge?: {
            text: string;
            action: {
              text: string;
              href: string;
            };
          };
          title: string;
          description: string;
          actions: HeroAction[];
          image: {
            light: string;
            dark: string;
            alt: string;
          };
        }
        
        export function HeroSection({
          badge,
          title,
          description,
          actions,
          image,
        }: HeroProps) {
          const { resolvedTheme } = useTheme();
          const imageSrc = resolvedTheme === "light" ? image.light : image.dark;
        
          return (
            <section
              className={cn(
                "bg-background text-foreground",
                "py-12 sm:py-24 md:py-32 px-4",
                "fade-bottom overflow-hidden pb-0"
              )}
            >
              <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
                <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
                  {/* Badge */}
                  {badge && (
                    <Badge variant="outline" className="animate-appear gap-2">
                      <span className="text-muted-foreground">{badge.text}</span>
                      <a href={badge.action.href} className="flex items-center gap-1">
                        {badge.action.text}
                        <ArrowRightIcon className="h-3 w-3" />
                      </a>
                    </Badge>
                  )}
        
                  {/* Title */}
                  <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
                    {title}
                  </h1>
        
                  {/* Description */}
                  <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
                    {description}
                  </p>
        
                  {/* Actions */}
                  <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
                    <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
                      {actions.map((action, index) => (
                        <Button key={index} variant={action.variant} size="lg" asChild>
                          <a href={action.href} className="flex items-center gap-2">
                            {action.icon}
                            {action.text}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
        
                  {/* Image with Glow */}
                  <div className="relative pt-12">
                    <MockupFrame
                      className="animate-appear opacity-0 delay-700"
                      size="small"
                    >
                      <Mockup type="responsive">
                        <Image
                          src={imageSrc}
                          alt={image.alt}
                          width={1248}
                          height={765}
                          priority
                        />
                      </Mockup>
                    </MockupFrame>
                    <Glow
                      variant="top"
                      className="animate-appear-zoom opacity-0 delay-1000"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }
        
        code.demo.tsx
        "use client"
        
        import { HeroSection } from "@/components/blocks/hero-section"
        import { Icons } from "@/components/ui/icons"
        
        export function HeroSectionDemo() {
          return (
            <HeroSection
              badge={{
                text: "Introducing our new components",
                action: {
                  text: "Learn more",
                  href: "/docs",
                },
              }}
              title="Build faster with beautiful components"
              description="Premium UI components built with React and Tailwind CSS. Save time and ship your next project faster with our ready-to-use components."
              actions={[
                {
                  text: "Get Started",
                  href: "/docs/getting-started",
                  variant: "default",
                },
                {
                  text: "GitHub",
                  href: "<https://github.com/your-repo>",
                  variant: "glow",
                  icon: <Icons.gitHub className="h-5 w-5" />,
                },
              ]}
              image={{
                light: "<https://www.launchuicomponents.com/app-light.png>",
                dark: "<https://www.launchuicomponents.com/app-dark.png>",
                alt: "UI Components Preview",
              }}
            />
          )
        }
        
        ```
        
        Copy-paste these files for dependencies:
        
        ```tsx
        /components/ui/icons.tsx
        type IconProps = React.HTMLAttributes<SVGElement>
        
        export const Icons = {
          logo: (props: IconProps) => (
            <svg xmlns="<http://www.w3.org/2000/svg>" viewBox="0 0 256 256" {...props}>
              <rect width="256" height="256" fill="none" />
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32"
              />
            </svg>
          ),
          twitter: (props: IconProps) => (
            <svg
              {...props}
              height="23"
              viewBox="0 0 1200 1227"
              width="23"
              xmlns="<http://www.w3.org/2000/svg>"
            >
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
            </svg>
          ),
          gitHub: (props: IconProps) => (
            <svg viewBox="0 0 438.549 438.549" {...props}>
              <path
                fill="currentColor"
                d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
              ></path>
            </svg>
          ),
          radix: (props: IconProps) => (
            <svg viewBox="0 0 25 25" fill="none" {...props}>
              <path
                d="M12 25C7.58173 25 4 21.4183 4 17C4 12.5817 7.58173 9 12 9V25Z"
                fill="currentcolor"
              ></path>
              <path d="M12 0H4V8H12V0Z" fill="currentcolor"></path>
              <path
                d="M17 8C19.2091 8 21 6.20914 21 4C21 1.79086 19.2091 0 17 0C14.7909 0 13 1.79086 13 4C13 6.20914 14.7909 8 17 8Z"
                fill="currentcolor"
              ></path>
            </svg>
          ),
          aria: (props: IconProps) => (
            <svg role="img" viewBox="0 0 24 24" fill="currentColor" {...props}>
              <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
            </svg>
          ),
          npm: (props: IconProps) => (
            <svg viewBox="0 0 24 24" {...props}>
              <path
                d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
                fill="currentColor"
              />
            </svg>
          ),
          yarn: (props: IconProps) => (
            <svg viewBox="0 0 24 24" {...props}>
              <path
                d="M12 0C5.375 0 0 5.375 0 12s5.375 12 12 12 12-5.375 12-12S18.625 0 12 0zm.768 4.105c.183 0 .363.053.525.157.125.083.287.185.755 1.154.31-.088.468-.042.551-.019.204.056.366.19.463.375.477.917.542 2.553.334 3.605-.241 1.232-.755 2.029-1.131 2.576.324.329.778.899 1.117 1.825.278.774.31 1.478.273 2.015a5.51 5.51 0 0 0 .602-.329c.593-.366 1.487-.917 2.553-.931.714-.009 1.269.445 1.353 1.103a1.23 1.23 0 0 1-.945 1.362c-.649.158-.95.278-1.821.843-1.232.797-2.539 1.242-3.012 1.39a1.686 1.686 0 0 1-.704.343c-.737.181-3.266.315-3.466.315h-.046c-.783 0-1.214-.241-1.45-.491-.658.329-1.51.19-2.122-.134a1.078 1.078 0 0 1-.58-1.153 1.243 1.243 0 0 1-.153-.195c-.162-.25-.528-.936-.454-1.946.056-.723.556-1.367.88-1.71a5.522 5.522 0 0 1 .408-2.256c.306-.727.885-1.348 1.32-1.737-.32-.537-.644-1.367-.329-2.21.227-.602.412-.936.82-1.08h-.005c.199-.074.389-.153.486-.259a3.418 3.418 0 0 1 2.298-1.103c.037-.093.079-.185.125-.283.31-.658.639-1.029 1.024-1.168a.94.94 0 0 1 .328-.06zm.006.7c-.507.016-1.001 1.519-1.001 1.519s-1.27-.204-2.266.871c-.199.218-.468.334-.746.44-.079.028-.176.023-.417.672-.371.991.625 2.094.625 2.094s-1.186.839-1.626 1.881c-.486 1.144-.338 2.261-.338 2.261s-.843.732-.899 1.487c-.051.663.139 1.2.343 1.515.227.343.51.176.51.176s-.561.653-.037.931c.477.25 1.283.394 1.71-.037.31-.31.371-1.001.486-1.283.028-.065.12.111.209.199.097.093.264.195.264.195s-.755.324-.445 1.066c.102.246.468.403 1.066.398.222-.005 2.664-.139 3.313-.296.375-.088.505-.283.505-.283s1.566-.431 2.998-1.357c.917-.598 1.293-.76 2.034-.936.612-.148.57-1.098-.241-1.084-.839.009-1.575.44-2.196.825-1.163.718-1.742.672-1.742.672l-.018-.032c-.079-.13.371-1.293-.134-2.678-.547-1.515-1.413-1.881-1.344-1.997.297-.5 1.038-1.297 1.334-2.78.176-.899.13-2.377-.269-3.151-.074-.144-.732.241-.732.241s-.616-1.371-.788-1.483a.271.271 0 0 0-.157-.046z"
                fill="currentColor"
              />
            </svg>
          ),
          pnpm: (props: IconProps) => (
            <svg viewBox="0 0 24 24" {...props}>
              <path
                d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"
                fill="currentColor"
              />
            </svg>
          ),
          react: (props: IconProps) => (
            <svg viewBox="0 0 24 24" {...props}>
              <path
                d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"
                fill="currentColor"
              />
            </svg>
          ),
          tailwind: (props: IconProps) => (
            <svg viewBox="0 0 24 24" {...props}>
              <path
                d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"
                fill="currentColor"
              />
            </svg>
          ),
          google: (props: IconProps) => (
            <svg role="img" viewBox="0 0 24 24" {...props}>
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              />
            </svg>
          ),
          apple: (props: IconProps) => (
            <svg role="img" viewBox="0 0 24 24" {...props}>
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
          ),
          paypal: (props: IconProps) => (
            <svg role="img" viewBox="0 0 24 24" {...props}>
              <path
                d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"
                fill="currentColor"
              />
            </svg>
          ),
          spinner: (props: IconProps) => (
            <svg
              xmlns="<http://www.w3.org/2000/svg>"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              {...props}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ),
        }
        
        ```
        
        ```tsx
        /components/blocks/hero-section.tsx
        "use client";
        
        import { Button } from "@/components/ui/button";
        import { Badge } from "@/components/ui/badge";
        import { ArrowRightIcon } from "lucide-react";
        import { Mockup, MockupFrame } from "@/components/ui/mockup";
        import { Glow } from "@/components/ui/glow";
        import Image from "next/image";
        import { useTheme } from "next-themes";
        import { cn } from "@/lib/utils";
        
        interface HeroAction {
          text: string;
          href: string;
          icon?: React.ReactNode;
          variant?: "default" | "glow";
        }
        
        interface HeroProps {
          badge?: {
            text: string;
            action: {
              text: string;
              href: string;
            };
          };
          title: string;
          description: string;
          actions: HeroAction[];
          image: {
            light: string;
            dark: string;
            alt: string;
          };
        }
        
        export function HeroSection({
          badge,
          title,
          description,
          actions,
          image,
        }: HeroProps) {
          const { resolvedTheme } = useTheme();
          const imageSrc = resolvedTheme === "light" ? image.light : image.dark;
        
          return (
            <section
              className={cn(
                "bg-background text-foreground",
                "py-12 sm:py-24 md:py-32 px-4",
                "fade-bottom overflow-hidden pb-0"
              )}
            >
              <div className="mx-auto flex max-w-container flex-col gap-12 pt-16 sm:gap-24">
                <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
                  {/* Badge */}
                  {badge && (
                    <Badge variant="outline" className="animate-appear gap-2">
                      <span className="text-muted-foreground">{badge.text}</span>
                      <a href={badge.action.href} className="flex items-center gap-1">
                        {badge.action.text}
                        <ArrowRightIcon className="h-3 w-3" />
                      </a>
                    </Badge>
                  )}
        
                  {/* Title */}
                  <h1 className="relative z-10 inline-block animate-appear bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-4xl font-semibold leading-tight text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
                    {title}
                  </h1>
        
                  {/* Description */}
                  <p className="text-md relative z-10 max-w-[550px] animate-appear font-medium text-muted-foreground opacity-0 delay-100 sm:text-xl">
                    {description}
                  </p>
        
                  {/* Actions */}
                  <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
                    <div className="relative z-10 flex animate-appear justify-center gap-4 opacity-0 delay-300">
                      {actions.map((action, index) => (
                        <Button key={index} variant={action.variant} size="lg" asChild>
                          <a href={action.href} className="flex items-center gap-2">
                            {action.icon}
                            {action.text}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
        
                  {/* Image with Glow */}
                  <div className="relative pt-12">
                    <MockupFrame
                      className="animate-appear opacity-0 delay-700"
                      size="small"
                    >
                      <Mockup type="responsive">
                        <Image
                          src={imageSrc}
                          alt={image.alt}
                          width={1248}
                          height={765}
                          priority
                        />
                      </Mockup>
                    </MockupFrame>
                    <Glow
                      variant="top"
                      className="animate-appear-zoom opacity-0 delay-1000"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        }
        
        ```
        
        ```tsx
        /components/ui/glow.tsx
        import React from "react";
        import { cn } from "@/lib/utils";
        import { cva, VariantProps } from "class-variance-authority";
        
        const glowVariants = cva("absolute w-full", {
          variants: {
            variant: {
              top: "top-0",
              above: "-top-[128px]",
              bottom: "bottom-0",
              below: "-bottom-[128px]",
              center: "top-[50%]",
            },
          },
          defaultVariants: {
            variant: "top",
          },
        });
        
        const Glow = React.forwardRef<
          HTMLDivElement,
          React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
        >(({ className, variant, ...props }, ref) => (
          <div
            ref={ref}
            className={cn(glowVariants({ variant }), className)}
            {...props}
          >
            <div
              className={cn(
                "absolute left-1/2 h-[256px] w-[60%] -translate-x-1/2 scale-[2.5] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand-foreground)/.5)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[512px]",
                variant === "center" && "-translate-y-1/2",
              )}
            />
            <div
              className={cn(
                "absolute left-1/2 h-[128px] w-[40%] -translate-x-1/2 scale-[2] rounded-[50%] bg-[radial-gradient(ellipse_at_center,_hsla(var(--brand)/.3)_10%,_hsla(var(--brand-foreground)/0)_60%)] sm:h-[256px]",
                variant === "center" && "-translate-y-1/2",
              )}
            />
          </div>
        ));
        Glow.displayName = "Glow";
        
        export { Glow };
        
        ```
        
        ```tsx
        /components/ui/badge.tsx
        import * as React from "react"
        import { cva, type VariantProps } from "class-variance-authority"
        
        import { cn } from "@/lib/utils"
        
        const badgeVariants = cva(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            variants: {
              variant: {
                default:
                  "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
                secondary:
                  "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                  "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
                outline: "text-foreground",
              },
            },
            defaultVariants: {
              variant: "default",
            },
          },
        )
        
        export interface BadgeProps
          extends React.HTMLAttributes<HTMLDivElement>,
            VariantProps<typeof badgeVariants> {}
        
        function Badge({ className, variant, ...props }: BadgeProps) {
          return (
            <div className={cn(badgeVariants({ variant }), className)} {...props} />
          )
        }
        
        export { Badge, badgeVariants }
        
        ```
        
        ```tsx
        /components/ui/button.tsx
        import * as React from "react"
        import { Slot } from "@radix-ui/react-slot"
        import { cva, type VariantProps } from "class-variance-authority"
        
        import { cn } from "@/lib/utils"
        
        const buttonVariants = cva(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            variants: {
              variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
              },
              size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
              },
            },
            defaultVariants: {
              variant: "default",
              size: "default",
            },
          },
        )
        
        export interface ButtonProps
          extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof buttonVariants> {
          asChild?: boolean
        }
        
        const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
          ({ className, variant, size, asChild = false, ...props }, ref) => {
            const Comp = asChild ? Slot : "button"
            return (
              <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
              />
            )
          },
        )
        Button.displayName = "Button"
        
        export { Button, buttonVariants }
        
        ```
        
        ```tsx
        /components/ui/card.tsx
        import * as React from "react"
        
        import { cn } from "@/lib/utils"
        
        const Card = React.forwardRef<
          HTMLDivElement,
          React.HTMLAttributes<HTMLDivElement>
        >(({ className, ...props }, ref) => (
          <div
            ref={ref}
            className={cn(
              "rounded-lg border bg-card text-card-foreground shadow-sm",
              className,
            )}
            {...props}
          />
        ))
        Card.displayName = "Card"
        
        const CardHeader = React.forwardRef<
          HTMLDivElement,
          React.HTMLAttributes<HTMLDivElement>
        >(({ className, ...props }, ref) => (
          <div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 p-6", className)}
            {...props}
          />
        ))
        CardHeader.displayName = "CardHeader"
        
        const CardTitle = React.forwardRef<
          HTMLParagraphElement,
          React.HTMLAttributes<HTMLHeadingElement>
        >(({ className, ...props }, ref) => (
          <h3
            ref={ref}
            className={cn(
              "text-2xl font-semibold leading-none tracking-tight",
              className,
            )}
            {...props}
          />
        ))
        CardTitle.displayName = "CardTitle"
        
        const CardDescription = React.forwardRef<
          HTMLParagraphElement,
          React.HTMLAttributes<HTMLParagraphElement>
        >(({ className, ...props }, ref) => (
          <p
            ref={ref}
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
          />
        ))
        CardDescription.displayName = "CardDescription"
        
        const CardContent = React.forwardRef<
          HTMLDivElement,
          React.HTMLAttributes<HTMLDivElement>
        >(({ className, ...props }, ref) => (
          <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
        ))
        CardContent.displayName = "CardContent"
        
        const CardFooter = React.forwardRef<
          HTMLDivElement,
          React.HTMLAttributes<HTMLDivElement>
        >(({ className, ...props }, ref) => (
          <div
            ref={ref}
            className={cn("flex items-center p-6 pt-0", className)}
            {...props}
          />
        ))
        CardFooter.displayName = "CardFooter"
        
        export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
        
        ```
        
        ```tsx
        /components/ui/input.tsx
        import * as React from "react"
        
        import { cn } from "@/lib/utils"
        
        export interface InputProps
          extends React.InputHTMLAttributes<HTMLInputElement> {}
        
        const Input = React.forwardRef<HTMLInputElement, InputProps>(
          ({ className, type, ...props }, ref) => {
            return (
              <input
                type={type}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                ref={ref}
                {...props}
              />
            )
          }
        )
        Input.displayName = "Input"
        
        export { Input }
        
        ```
        
        ```tsx
        /components/ui/label.tsx
        "use client"
        
        import * as React from "react"
        import * as LabelPrimitive from "@radix-ui/react-label"
        import { cva, type VariantProps } from "class-variance-authority"
        
        import { cn } from "@/lib/utils"
        
        const labelVariants = cva(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )
        
        const Label = React.forwardRef<
          React.ElementRef<typeof LabelPrimitive.Root>,
          React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
            VariantProps<typeof labelVariants>
        >(({ className, ...props }, ref) => (
          <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
          />
        ))
        Label.displayName = LabelPrimitive.Root.displayName
        
        export { Label }
        
        ```
        
        ```tsx
        /components/ui/checkbox.tsx
        "use client"
        
        import * as React from "react"
        import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
        import { Check } from "lucide-react"
        
        import { cn } from "@/lib/utils"
        
        const Checkbox = React.forwardRef<
          React.ElementRef<typeof CheckboxPrimitive.Root>,
          React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
        >(({ className, ...props }, ref) => (
          <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              className,
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator
              className={cn("flex items-center justify-center text-current")}
            >
              <Check className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        ))
        Checkbox.displayName = CheckboxPrimitive.Root.displayName
        
        export { Checkbox }
        
        ```
        
        ```tsx
        /components/ui/select.tsx
        "use client"
        
        import * as React from "react"
        import * as SelectPrimitive from "@radix-ui/react-select"
        import { Check, ChevronDown, ChevronUp } from "lucide-react"
        
        import { cn } from "@/lib/utils"
        
        const Select = SelectPrimitive.Root
        
        const SelectGroup = SelectPrimitive.Group
        
        const SelectValue = SelectPrimitive.Value
        
        const SelectTrigger = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.Trigger>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
        >(({ className, children, ...props }, ref) => (
          <SelectPrimitive.Trigger
            ref={ref}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
              className,
            )}
            {...props}
          >
            {children}
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
        ))
        SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
        
        const SelectScrollUpButton = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
        >(({ className, ...props }, ref) => (
          <SelectPrimitive.ScrollUpButton
            ref={ref}
            className={cn(
              "flex cursor-default items-center justify-center py-1",
              className,
            )}
            {...props}
          >
            <ChevronUp className="h-4 w-4" />
          </SelectPrimitive.ScrollUpButton>
        ))
        SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName
        
        const SelectScrollDownButton = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
        >(({ className, ...props }, ref) => (
          <SelectPrimitive.ScrollDownButton
            ref={ref}
            className={cn(
              "flex cursor-default items-center justify-center py-1",
              className,
            )}
            {...props}
          >
            <ChevronDown className="h-4 w-4" />
          </SelectPrimitive.ScrollDownButton>
        ))
        SelectScrollDownButton.displayName =
          SelectPrimitive.ScrollDownButton.displayName
        
        const SelectContent = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.Content>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
        >(({ className, children, position = "popper", ...props }, ref) => (
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              ref={ref}
              className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                  "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className,
              )}
              position={position}
              {...props}
            >
              <SelectScrollUpButton />
              <SelectPrimitive.Viewport
                className={cn(
                  "p-1",
                  position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
                )}
              >
                {children}
              </SelectPrimitive.Viewport>
              <SelectScrollDownButton />
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        ))
        SelectContent.displayName = SelectPrimitive.Content.displayName
        
        const SelectLabel = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.Label>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
        >(({ className, ...props }, ref) => (
          <SelectPrimitive.Label
            ref={ref}
            className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
            {...props}
          />
        ))
        SelectLabel.displayName = SelectPrimitive.Label.displayName
        
        const SelectItem = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.Item>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
        >(({ className, children, ...props }, ref) => (
          <SelectPrimitive.Item
            ref={ref}
            className={cn(
              "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
              className,
            )}
            {...props}
          >
            <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
              <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4" />
              </SelectPrimitive.ItemIndicator>
            </span>
        
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
          </SelectPrimitive.Item>
        ))
        SelectItem.displayName = SelectPrimitive.Item.displayName
        
        const SelectSeparator = React.forwardRef<
          React.ElementRef<typeof SelectPrimitive.Separator>,
          React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
        >(({ className, ...props }, ref) => (
          <SelectPrimitive.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-muted", className)}
            {...props}
          />
        ))
        SelectSeparator.displayName = SelectPrimitive.Separator.displayName
        
        export {
          Select,
          SelectGroup,
          SelectValue,
          SelectTrigger,
          SelectContent,
          SelectLabel,
          SelectItem,
          SelectSeparator,
          SelectScrollUpButton,
          SelectScrollDownButton,
        }
        
        ```
        
        ```tsx
        /components/ui/switch.tsx
        "use client"
        
        import * as React from "react"
        import * as SwitchPrimitives from "@radix-ui/react-switch"
        
        import { cn } from "@/lib/utils"
        
        const Switch = React.forwardRef<
          React.ElementRef<typeof SwitchPrimitives.Root>,
          React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
        >(({ className, ...props }, ref) => (
          <SwitchPrimitives.Root
            className={cn(
              "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
              className,
            )}
            {...props}
            ref={ref}
          >
            <SwitchPrimitives.Thumb
              className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
              )}
            />
          </SwitchPrimitives.Root>
        ))
        Switch.displayName = SwitchPrimitives.Root.displayName
        
        export { Switch }
        
        ```
        
        ```tsx
        /components/ui/mockup.tsx
        import React from "react";
        import { cn } from "@/lib/utils";
        import { cva, type VariantProps } from "class-variance-authority";
        
        const mockupVariants = cva(
          "flex relative z-10 overflow-hidden shadow-2xl border border-border/5 border-t-border/15",
          {
            variants: {
              type: {
                mobile: "rounded-[48px] max-w-[350px]",
                responsive: "rounded-md",
              },
            },
            defaultVariants: {
              type: "responsive",
            },
          },
        );
        
        export interface MockupProps
          extends React.HTMLAttributes<HTMLDivElement>,
            VariantProps<typeof mockupVariants> {}
        
        const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
          ({ className, type, ...props }, ref) => (
            <div
              ref={ref}
              className={cn(mockupVariants({ type, className }))}
              {...props}
            />
          ),
        );
        Mockup.displayName = "Mockup";
        
        const frameVariants = cva(
          "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
          {
            variants: {
              size: {
                small: "p-2",
                large: "p-4",
              },
            },
            defaultVariants: {
              size: "small",
            },
          },
        );
        
        export interface MockupFrameProps
          extends React.HTMLAttributes<HTMLDivElement>,
            VariantProps<typeof frameVariants> {}
        
        const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
          ({ className, size, ...props }, ref) => (
            <div
              ref={ref}
              className={cn(frameVariants({ size, className }))}
              {...props}
            />
          ),
        );
        MockupFrame.displayName = "MockupFrame";
        
        export { Mockup, MockupFrame };
        
        ```
        
        Install NPM dependencies:
        
        ```bash
        lucide-react, class-variance-authority, @radix-ui/react-slot, @radix-ui/react-label, @radix-ui/react-checkbox, @radix-ui/react-select, @radix-ui/react-switch
        
        ```
        
        Extend existing tailwind.config.js with this code:
        
        ```
        /** @type {import('tailwindcss').Config} */
        module.exports = {
          theme: {
            extend: {
              colors: {
                brand: "hsl(var(--brand))",
                "brand-foreground": "hsl(var(--brand-foreground))",
              },
              keyframes: {
                appear: {
                  "0%": { opacity: "0", transform: "translateY(10px)" },
                  "100%": { opacity: "1", transform: "translateY(0)" }
                },
                "appear-zoom": {
                  "0%": { opacity: "0", transform: "scale(0.95)" },
                  "100%": { opacity: "1", transform: "scale(1)" }
                }
              },
              animation: {
                appear: "appear 0.5s ease-out forwards",
                "appear-zoom": "appear-zoom 0.5s ease-out forwards"
              }
            }
          }
        }
        
        ```
        
        Extend existing globals.css with this code:
        
        ```css
        @layer utilities {
          .delay-100 {
            animation-delay: 100ms;
          }
          .delay-300 {
            animation-delay: 300ms;
          }
          .delay-700 {
            animation-delay: 700ms;
          }
          .delay-1000 {
            animation-delay: 1000ms;
          }
        }
        
        @layer base {
          :root {
            --brand: 27 96% 61%;
            --brand-foreground: 31 97% 72%;
          }
        
          .dark {
            --brand: 31 97% 72%;
            --brand-foreground: 27 96% 61%
          }
        }
        
        ```
        
        Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
        IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
        
    - Feature Section
        
        Copy-paste this component to /components/ui folder:
        
        Call it “feature-section”. Change the copy to be good copy for the product based on what you know.
        
        ```tsx
        feature-section-with-hover-effects.tsx
        import { cn } from "@/lib/utils";
        import {
          IconAdjustmentsBolt,
          IconCloud,
          IconCurrencyDollar,
          IconEaseInOut,
          IconHeart,
          IconHelp,
          IconRouteAltLeft,
          IconTerminal2,
        } from "@tabler/icons-react";
        
        export function FeaturesSectionWithHoverEffects() {
          const features = [
            {
              title: "Built for developers",
              description:
                "Built for engineers, developers, dreamers, thinkers and doers.",
              icon: <IconTerminal2 />,
            },
            {
              title: "Ease of use",
              description:
                "It's as easy as using an Apple, and as expensive as buying one.",
              icon: <IconEaseInOut />,
            },
            {
              title: "Pricing like no other",
              description:
                "Our prices are best in the market. No cap, no lock, no credit card required.",
              icon: <IconCurrencyDollar />,
            },
            {
              title: "100% Uptime guarantee",
              description: "We just cannot be taken down by anyone.",
              icon: <IconCloud />,
            },
            {
              title: "Multi-tenant Architecture",
              description: "You can simply share passwords instead of buying new seats",
              icon: <IconRouteAltLeft />,
            },
            {
              title: "24/7 Customer Support",
              description:
                "We are available a 100% of the time. Atleast our AI Agents are.",
              icon: <IconHelp />,
            },
            {
              title: "Money back guarantee",
              description:
                "If you donot like EveryAI, we will convince you to like us.",
              icon: <IconAdjustmentsBolt />,
            },
            {
              title: "And everything else",
              description: "I just ran out of copy ideas. Accept my sincere apologies",
              icon: <IconHeart />,
            },
          ];
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
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
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
              )}
            >
              {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
              </div>
              <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                  {title}
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
              </p>
            </div>
          );
        };
        
        code.demo.tsx
        import React from "react";
        import { FeaturesSectionWithHoverEffects } from "@/components/blocks/feature-section-with-hover-effects";
        
        function FeaturesSectionWithHoverEffectsDemo() {
          return (
            <div className="min-h-screen w-full">
              <div className="absolute top-0 left-0 w-full">
                <FeaturesSectionWithHoverEffects />
              </div>
            </div>
          );
        }
        
        export { FeaturesSectionWithHoverEffectsDemo };
        
        ```
        
        Copy-paste these files for dependencies:
        
        ```tsx
        /components/blocks/feature-section-with-hover-effects.tsx
        import { cn } from "@/lib/utils";
        import {
          IconAdjustmentsBolt,
          IconCloud,
          IconCurrencyDollar,
          IconEaseInOut,
          IconHeart,
          IconHelp,
          IconRouteAltLeft,
          IconTerminal2,
        } from "@tabler/icons-react";
        
        export function FeaturesSectionWithHoverEffects() {
          const features = [
            {
              title: "Built for developers",
              description:
                "Built for engineers, developers, dreamers, thinkers and doers.",
              icon: <IconTerminal2 />,
            },
            {
              title: "Ease of use",
              description:
                "It's as easy as using an Apple, and as expensive as buying one.",
              icon: <IconEaseInOut />,
            },
            {
              title: "Pricing like no other",
              description:
                "Our prices are best in the market. No cap, no lock, no credit card required.",
              icon: <IconCurrencyDollar />,
            },
            {
              title: "100% Uptime guarantee",
              description: "We just cannot be taken down by anyone.",
              icon: <IconCloud />,
            },
            {
              title: "Multi-tenant Architecture",
              description: "You can simply share passwords instead of buying new seats",
              icon: <IconRouteAltLeft />,
            },
            {
              title: "24/7 Customer Support",
              description:
                "We are available a 100% of the time. Atleast our AI Agents are.",
              icon: <IconHelp />,
            },
            {
              title: "Money back guarantee",
              description:
                "If you donot like EveryAI, we will convince you to like us.",
              icon: <IconAdjustmentsBolt />,
            },
            {
              title: "And everything else",
              description: "I just ran out of copy ideas. Accept my sincere apologies",
              icon: <IconHeart />,
            },
          ];
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
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
                "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
              )}
            >
              {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
                {icon}
              </div>
              <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                  {title}
                </span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
              </p>
            </div>
          );
        };
        
        ```
        
        Install NPM dependencies:
        
        ```bash
        @tabler/icons-react
        
        ```
        
        Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
        IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
        
    - Footer
        
        Copy-paste this component to /components/ui folder:
        
        Call it “footer”. Remove the light mode to dark mode toggle altogether. I do not want it. Default to light mode with a white background.
        
        ```tsx
        footer-section.tsx
        "use client"
        
        import * as React from "react"
        import { Button } from "@/components/ui/button"
        import { Input } from "@/components/ui/input"
        import { Label } from "@/components/ui/label"
        import { Switch } from "@/components/ui/switch"
        import { Textarea } from "@/components/ui/textarea"
        import {
          Tooltip,
          TooltipContent,
          TooltipProvider,
          TooltipTrigger,
        } from "@/components/ui/tooltip"
        import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"
        
        function Footerdemo() {
          const [isDarkMode, setIsDarkMode] = React.useState(true)
          const [isChatOpen, setIsChatOpen] = React.useState(false)
        
          React.useEffect(() => {
            if (isDarkMode) {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          }, [isDarkMode])
        
          return (
            <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
              <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
                    <p className="mb-6 text-muted-foreground">
                      Join our newsletter for the latest updates and exclusive offers.
                    </p>
                    <form className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pr-12 backdrop-blur-sm"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Subscribe</span>
                      </Button>
                    </form>
                    <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                    <nav className="space-y-2 text-sm">
                      <a href="#" className="block transition-colors hover:text-primary">
                        Home
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        About Us
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Services
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Products
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Contact
                      </a>
                    </nav>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
                    <address className="space-y-2 text-sm not-italic">
                      <p>123 Innovation Street</p>
                      <p>Tech City, TC 12345</p>
                      <p>Phone: (123) 456-7890</p>
                      <p>Email: hello@example.com</p>
                    </address>
                  </div>
                  <div className="relative">
                    <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
                    <div className="mb-6 flex space-x-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Facebook className="h-4 w-4" />
                              <span className="sr-only">Facebook</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Facebook</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Twitter className="h-4 w-4" />
                              <span className="sr-only">Twitter</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Twitter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Instagram className="h-4 w-4" />
                              <span className="sr-only">Instagram</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Instagram</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Linkedin className="h-4 w-4" />
                              <span className="sr-only">LinkedIn</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Connect with us on LinkedIn</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                      <Moon className="h-4 w-4" />
                      <Label htmlFor="dark-mode" className="sr-only">
                        Toggle dark mode
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    © 2024 Your Company. All rights reserved.
                  </p>
                  <nav className="flex gap-4 text-sm">
                    <a href="#" className="transition-colors hover:text-primary">
                      Privacy Policy
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                      Terms of Service
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                      Cookie Settings
                    </a>
                  </nav>
                </div>
              </div>
            </footer>
          )
        }
        
        export { Footerdemo }
        
        code.demo.tsx
        import { Footerdemo } from "@/components/ui/footer-section";
        
        function Footer() {
          return (
            <div className="block">
              <Footerdemo />
            </div>
          );
        }
        
        export { Footer };
        
        ```
        
        Copy-paste these files for dependencies:
        
        ```tsx
        /components/ui/footer-section.tsx
        "use client"
        
        import * as React from "react"
        import { Button } from "@/components/ui/button"
        import { Input } from "@/components/ui/input"
        import { Label } from "@/components/ui/label"
        import { Switch } from "@/components/ui/switch"
        import { Textarea } from "@/components/ui/textarea"
        import {
          Tooltip,
          TooltipContent,
          TooltipProvider,
          TooltipTrigger,
        } from "@/components/ui/tooltip"
        import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"
        
        function Footerdemo() {
          const [isDarkMode, setIsDarkMode] = React.useState(true)
          const [isChatOpen, setIsChatOpen] = React.useState(false)
        
          React.useEffect(() => {
            if (isDarkMode) {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          }, [isDarkMode])
        
          return (
            <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
              <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                  <div className="relative">
                    <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
                    <p className="mb-6 text-muted-foreground">
                      Join our newsletter for the latest updates and exclusive offers.
                    </p>
                    <form className="relative">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="pr-12 backdrop-blur-sm"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1 top-1 h-8 w-8 rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                      >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Subscribe</span>
                      </Button>
                    </form>
                    <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
                    <nav className="space-y-2 text-sm">
                      <a href="#" className="block transition-colors hover:text-primary">
                        Home
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        About Us
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Services
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Products
                      </a>
                      <a href="#" className="block transition-colors hover:text-primary">
                        Contact
                      </a>
                    </nav>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-semibold">Contact Us</h3>
                    <address className="space-y-2 text-sm not-italic">
                      <p>123 Innovation Street</p>
                      <p>Tech City, TC 12345</p>
                      <p>Phone: (123) 456-7890</p>
                      <p>Email: hello@example.com</p>
                    </address>
                  </div>
                  <div className="relative">
                    <h3 className="mb-4 text-lg font-semibold">Follow Us</h3>
                    <div className="mb-6 flex space-x-4">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Facebook className="h-4 w-4" />
                              <span className="sr-only">Facebook</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Facebook</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Twitter className="h-4 w-4" />
                              <span className="sr-only">Twitter</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Twitter</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Instagram className="h-4 w-4" />
                              <span className="sr-only">Instagram</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Follow us on Instagram</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" className="rounded-full">
                              <Linkedin className="h-4 w-4" />
                              <span className="sr-only">LinkedIn</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Connect with us on LinkedIn</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Switch
                        id="dark-mode"
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                      <Moon className="h-4 w-4" />
                      <Label htmlFor="dark-mode" className="sr-only">
                        Toggle dark mode
                      </Label>
                    </div>
                  </div>
                </div>
                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-center md:flex-row">
                  <p className="text-sm text-muted-foreground">
                    © 2024 Your Company. All rights reserved.
                  </p>
                  <nav className="flex gap-4 text-sm">
                    <a href="#" className="transition-colors hover:text-primary">
                      Privacy Policy
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                      Terms of Service
                    </a>
                    <a href="#" className="transition-colors hover:text-primary">
                      Cookie Settings
                    </a>
                  </nav>
                </div>
              </div>
            </footer>
          )
        }
        
        export { Footerdemo }
        
        ```
        
        ```tsx
        /components/ui/button.tsx
        import * as React from "react"
        import { Slot } from "@radix-ui/react-slot"
        import { cva, type VariantProps } from "class-variance-authority"
        
        import { cn } from "@/lib/utils"
        
        const buttonVariants = cva(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            variants: {
              variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                  "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                  "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
              },
              size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
              },
            },
            defaultVariants: {
              variant: "default",
              size: "default",
            },
          },
        )
        
        export interface ButtonProps
          extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof buttonVariants> {
          asChild?: boolean
        }
        
        const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
          ({ className, variant, size, asChild = false, ...props }, ref) => {
            const Comp = asChild ? Slot : "button"
            return (
              <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
              />
            )
          },
        )
        Button.displayName = "Button"
        
        export { Button, buttonVariants }
        
        ```
        
        ```tsx
        /components/ui/input.tsx
        import * as React from "react"
        
        import { cn } from "@/lib/utils"
        
        export interface InputProps
          extends React.InputHTMLAttributes<HTMLInputElement> {}
        
        const Input = React.forwardRef<HTMLInputElement, InputProps>(
          ({ className, type, ...props }, ref) => {
            return (
              <input
                type={type}
                className={cn(
                  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                ref={ref}
                {...props}
              />
            )
          }
        )
        Input.displayName = "Input"
        
        export { Input }
        
        ```
        
        ```tsx
        /components/ui/label.tsx
        "use client"
        
        import * as React from "react"
        import * as LabelPrimitive from "@radix-ui/react-label"
        import { cva, type VariantProps } from "class-variance-authority"
        
        import { cn } from "@/lib/utils"
        
        const labelVariants = cva(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        )
        
        const Label = React.forwardRef<
          React.ElementRef<typeof LabelPrimitive.Root>,
          React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
            VariantProps<typeof labelVariants>
        >(({ className, ...props }, ref) => (
          <LabelPrimitive.Root
            ref={ref}
            className={cn(labelVariants(), className)}
            {...props}
          />
        ))
        Label.displayName = LabelPrimitive.Root.displayName
        
        export { Label }
        
        ```
        
        ```tsx
        /components/ui/checkbox.tsx
        "use client"
        
        import * as React from "react"
        import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
        import { Check } from "lucide-react"
        
        import { cn } from "@/lib/utils"
        
        const Checkbox = React.forwardRef<
          React.ElementRef<typeof CheckboxPrimitive.Root>,
          React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
        >(({ className, ...props }, ref) => (
          <CheckboxPrimitive.Root
            ref={ref}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
              className,
            )}
            {...props}
          >
            <CheckboxPrimitive.Indicator
              className={cn("flex items-center justify-center text-current")}
            >
              <Check className="h-4 w-4" />
            </CheckboxPrimitive.Indicator>
          </CheckboxPrimitive.Root>
        ))
        Checkbox.displayName = CheckboxPrimitive.Root.displayName
        
        export { Checkbox }
        
        ```
        
        ```tsx
        /components/ui/switch.tsx
        "use client"
        
        import * as React from "react"
        import * as SwitchPrimitives from "@radix-ui/react-switch"
        
        import { cn } from "@/lib/utils"
        
        const Switch = React.forwardRef<
          React.ElementRef<typeof SwitchPrimitives.Root>,
          React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
        >(({ className, ...props }, ref) => (
          <SwitchPrimitives.Root
            className={cn(
              "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
              className,
            )}
            {...props}
            ref={ref}
          >
            <SwitchPrimitives.Thumb
              className={cn(
                "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
              )}
            />
          </SwitchPrimitives.Root>
        ))
        Switch.displayName = SwitchPrimitives.Root.displayName
        
        export { Switch }
        
        ```
        
        ```tsx
        /components/ui/textarea.tsx
        import * as React from "react"
        
        import { cn } from "@/lib/utils"
        
        export interface TextareaProps
          extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
        
        const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
          ({ className, ...props }, ref) => {
            return (
              <textarea
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                  className
                )}
                ref={ref}
                {...props}
              />
            )
          }
        )
        Textarea.displayName = "Textarea"
        
        export { Textarea }
        
        ```
        
        ```tsx
        /components/ui/tooltip.tsx
        "use client"
        
        import * as React from "react"
        import * as TooltipPrimitive from "@radix-ui/react-tooltip"
        
        import { cn } from "@/lib/utils"
        
        const TooltipProvider = TooltipPrimitive.Provider
        
        const Tooltip = TooltipPrimitive.Root
        
        const TooltipTrigger = TooltipPrimitive.Trigger
        
        const TooltipContent = React.forwardRef<
          React.ElementRef<typeof TooltipPrimitive.Content>,
          React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
        >(({ className, sideOffset = 4, ...props }, ref) => (
          <TooltipPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
              "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              className,
            )}
            {...props}
          />
        ))
        TooltipContent.displayName = TooltipPrimitive.Content.displayName
        
        export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
        
        ```
        
        Install NPM dependencies:
        
        ```bash
        lucide-react, @radix-ui/react-slot, class-variance-authority, @radix-ui/react-label, @radix-ui/react-checkbox, @radix-ui/react-switch, @radix-ui/react-tooltip
        
        ```
        
        Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
        IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
        
4. **Buttons & Actions:**
    - [Get Started] → [links to the /signup page]
        - This button should be the main CTA in the hero section
    - [Go to Radium] → [links to the /login page, or to the /dashboard page if the user is authenticated]
        - This button should be in the top right of the landing page
5. **Data Requirements:**
    - **Data to Display:** (List all pieces of information shown on the page)
    - **Database Source:** (Which table and field should each value come from?)
    - **External API Calls:** (If data is fetched from an external API, specify the endpoint)
- **User Interactions & Validations:**
    - Form validation rules
    - Required vs. optional fields

### 3.2 Sign Up Page

- **Page URL:** /sign-up
- **Main Page Objective:** (What is the purpose of this page?)
- Build a simple login page that uses supabase auth. use this component:
    
    Copy-paste this component to /components/ui folder:
    
    Call it “sign-up”.
    
    ```tsx
    code.tsx?v=1
    "use client";
    
    import * as DialogPrimitive from "@radix-ui/react-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { Cross2Icon } from "@radix-ui/react-icons";
    
    const Dialog = DialogPrimitive.Root;
    
    const DialogTrigger = DialogPrimitive.Trigger;
    
    const DialogPortal = DialogPrimitive.Portal;
    
    const DialogClose = DialogPrimitive.Close;
    
    const DialogOverlay = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      />
    ));
    DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
    
    const DialogContent = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
    >(({ className, children, ...props }, ref) => (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none">
            <Cross2Icon
              width={16}
              height={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    ));
    DialogContent.displayName = DialogPrimitive.Content.displayName;
    
    const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
    );
    DialogHeader.displayName = "DialogHeader";
    
    const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}
        {...props}
      />
    );
    DialogFooter.displayName = "DialogFooter";
    
    const DialogTitle = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold tracking-tight", className)}
        {...props}
      />
    ));
    DialogTitle.displayName = DialogPrimitive.Title.displayName;
    
    const DialogDescription = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    DialogDescription.displayName = DialogPrimitive.Description.displayName;
    
    export {
      Dialog,
      DialogClose,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogOverlay,
      DialogPortal,
      DialogTitle,
      DialogTrigger,
    };
    
    code.demo.tsx?v=1
    import { Button } from "@/components/ui/button";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { useId } from "react";
    
    function Component() {
      const id = useId();
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Sign up</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <svg
                  className="stroke-zinc-800 dark:stroke-zinc-100"
                  xmlns="<http://www.w3.org/2000/svg>"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
                </svg>
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">Sign up Origin UI</DialogTitle>
                <DialogDescription className="sm:text-center">
                  We just need a few details to get you started.
                </DialogDescription>
              </DialogHeader>
            </div>
    
            <form className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-name`}>Full name</Label>
                  <Input id={`${id}-name`} placeholder="Matt Welsh" type="text" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-password`}>Password</Label>
                  <Input
                    id={`${id}-password`}
                    placeholder="Enter your password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button type="button" className="w-full">
                Sign up
              </Button>
            </form>
    
            <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              <span className="text-xs text-muted-foreground">Or</span>
            </div>
    
            <Button variant="outline">Continue with Google</Button>
    
            <p className="text-center text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <a className="underline hover:no-underline" href="#">
                Terms
              </a>
              .
            </p>
          </DialogContent>
        </Dialog>
      );
    }
    
    export { Component };
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/label.tsx
    "use client";
    
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    
    const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
      ({ className, ...props }, ref) => (
        <label
          ref={ref}
          className={cn(
            "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className,
          )}
          {...props}
        />
      ),
    );
    Label.displayName = "Label";
    
    export { Label };
    
    ```
    
    ```tsx
    /components/ui/input.tsx
    import { cn } from "@/lib/utils";
    import * as React from "react";
    
    const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
      ({ className, type, ...props }, ref) => {
        return (
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
              type === "search" &&
                "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
              type === "file" &&
                "p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
              className,
            )}
            ref={ref}
            {...props}
          />
        );
      },
    );
    Input.displayName = "Input";
    
    export { Input };
    
    ```
    
    ```tsx
    /components/ui/button.tsx
    import { Slot } from "@radix-ui/react-slot";
    import { cva, type VariantProps } from "class-variance-authority";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    
    const buttonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",
            destructive:
              "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
            outline:
              "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-lg px-3 text-xs",
            lg: "h-10 rounded-lg px-8",
            icon: "h-9 w-9",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      },
    );
    
    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      asChild?: boolean;
    }
    
    const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
          <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        );
      },
    );
    Button.displayName = "Button";
    
    export { Button, buttonVariants };
    
    ```
    
    ```tsx
    /components/ui/dialog.tsx
    "use client";
    
    import * as DialogPrimitive from "@radix-ui/react-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { Cross2Icon } from "@radix-ui/react-icons";
    
    const Dialog = DialogPrimitive.Root;
    
    const DialogTrigger = DialogPrimitive.Trigger;
    
    const DialogPortal = DialogPrimitive.Portal;
    
    const DialogClose = DialogPrimitive.Close;
    
    const DialogOverlay = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      />
    ));
    DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
    
    const DialogContent = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
    >(({ className, children, ...props }, ref) => (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none">
            <Cross2Icon
              width={16}
              height={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    ));
    DialogContent.displayName = DialogPrimitive.Content.displayName;
    
    const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
    );
    DialogHeader.displayName = "DialogHeader";
    
    const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}
        {...props}
      />
    );
    DialogFooter.displayName = "DialogFooter";
    
    const DialogTitle = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold tracking-tight", className)}
        {...props}
      />
    ));
    DialogTitle.displayName = DialogPrimitive.Title.displayName;
    
    const DialogDescription = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    DialogDescription.displayName = DialogPrimitive.Description.displayName;
    
    export {
      Dialog,
      DialogClose,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogOverlay,
      DialogPortal,
      DialogTitle,
      DialogTrigger,
    };
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    @radix-ui/react-icons, @radix-ui/react-dialog, @radix-ui/react-slot, class-variance-authority
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    

### 3.3 Login Page

- **Page URL:** /login
- **Main Page Objective:** login page for the app
- Build a simple login page that uses supabase auth. use this component:
    
    Copy-paste this component to /components/ui folder:
    Call it “login”.
    
    ```tsx
    code.tsx?v=1
    "use client";
    
    import * as DialogPrimitive from "@radix-ui/react-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { Cross2Icon } from "@radix-ui/react-icons";
    
    const Dialog = DialogPrimitive.Root;
    
    const DialogTrigger = DialogPrimitive.Trigger;
    
    const DialogPortal = DialogPrimitive.Portal;
    
    const DialogClose = DialogPrimitive.Close;
    
    const DialogOverlay = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      />
    ));
    DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
    
    const DialogContent = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
    >(({ className, children, ...props }, ref) => (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none">
            <Cross2Icon
              width={16}
              height={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    ));
    DialogContent.displayName = DialogPrimitive.Content.displayName;
    
    const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
    );
    DialogHeader.displayName = "DialogHeader";
    
    const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}
        {...props}
      />
    );
    DialogFooter.displayName = "DialogFooter";
    
    const DialogTitle = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold tracking-tight", className)}
        {...props}
      />
    ));
    DialogTitle.displayName = DialogPrimitive.Title.displayName;
    
    const DialogDescription = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    DialogDescription.displayName = DialogPrimitive.Description.displayName;
    
    export {
      Dialog,
      DialogClose,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogOverlay,
      DialogPortal,
      DialogTitle,
      DialogTrigger,
    };
    
    code.demo.tsx?v=1
    import { Button } from "@/components/ui/button";
    import { Checkbox } from "@/components/ui/checkbox";
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogTrigger,
    } from "@/components/ui/dialog";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { useId } from "react";
    
    function Component() {
      const id = useId();
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Sign in</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <svg
                  className="stroke-zinc-800 dark:stroke-zinc-100"
                  xmlns="<http://www.w3.org/2000/svg>"
                  width="20"
                  height="20"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
                </svg>
              </div>
              <DialogHeader>
                <DialogTitle className="sm:text-center">Welcome back</DialogTitle>
                <DialogDescription className="sm:text-center">
                  Enter your credentials to login to your account.
                </DialogDescription>
              </DialogHeader>
            </div>
    
            <form className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <Input id={`${id}-email`} placeholder="hi@yourcompany.com" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${id}-password`}>Password</Label>
                  <Input
                    id={`${id}-password`}
                    placeholder="Enter your password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox id={`${id}-remember`} />
                  <Label htmlFor={`${id}-remember`} className="font-normal text-muted-foreground">
                    Remember me
                  </Label>
                </div>
                <a className="text-sm underline hover:no-underline" href="#">
                  Forgot password?
                </a>
              </div>
              <Button type="button" className="w-full">
                Sign in
              </Button>
            </form>
    
            <div className="flex items-center gap-3 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              <span className="text-xs text-muted-foreground">Or</span>
            </div>
    
            <Button variant="outline">Login with Google</Button>
          </DialogContent>
        </Dialog>
      );
    }
    
    export { Component };
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/checkbox.tsx
    "use client";
    
    import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    
    const Checkbox = React.forwardRef<
      React.ElementRef<typeof CheckboxPrimitive.Root>,
      React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
    >(({ className, ...props }, ref) => (
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer size-4 shrink-0 rounded border border-input shadow-sm shadow-black/5 outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=indeterminate]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground",
          className
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
          {props.checked === "indeterminate" ? (
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="currentcolor"
              xmlns="<http://www.w3.org/2000/svg>"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.75 4.5C0.75 4.08579 1.08579 3.75 1.5 3.75H7.5C7.91421 3.75 8.25 4.08579 8.25 4.5C8.25 4.91421 7.91421 5.25 7.5 5.25H1.5C1.08579 5.25 0.75 4.91421 0.75 4.5Z"
              />
            </svg>
          ) : (
            <svg
              width="9"
              height="9"
              viewBox="0 0 9 9"
              fill="currentcolor"
              xmlns="<http://www.w3.org/2000/svg>"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.53547 0.62293C8.88226 0.849446 8.97976 1.3142 8.75325 1.66099L4.5083 8.1599C4.38833 8.34356 4.19397 8.4655 3.9764 8.49358C3.75883 8.52167 3.53987 8.45309 3.3772 8.30591L0.616113 5.80777C0.308959 5.52987 0.285246 5.05559 0.563148 4.74844C0.84105 4.44128 1.31533 4.41757 1.62249 4.69547L3.73256 6.60459L7.49741 0.840706C7.72393 0.493916 8.18868 0.396414 8.53547 0.62293Z"
              />
            </svg>
          )}
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    ));
    Checkbox.displayName = CheckboxPrimitive.Root.displayName;
    
    export { Checkbox };
    
    ```
    
    ```tsx
    /components/ui/label.tsx
    "use client";
    
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    
    const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
      ({ className, ...props }, ref) => (
        <label
          ref={ref}
          className={cn(
            "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            className,
          )}
          {...props}
        />
      ),
    );
    Label.displayName = "Label";
    
    export { Label };
    
    ```
    
    ```tsx
    /components/ui/input.tsx
    import { cn } from "@/lib/utils";
    import * as React from "react";
    
    const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
      ({ className, type, ...props }, ref) => {
        return (
          <input
            type={type}
            className={cn(
              "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm shadow-black/5 transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
              type === "search" &&
                "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none",
              type === "file" &&
                "p-0 pr-3 italic text-muted-foreground/70 file:me-3 file:h-full file:border-0 file:border-r file:border-solid file:border-input file:bg-transparent file:px-3 file:text-sm file:font-medium file:not-italic file:text-foreground",
              className,
            )}
            ref={ref}
            {...props}
          />
        );
      },
    );
    Input.displayName = "Input";
    
    export { Input };
    
    ```
    
    ```tsx
    /components/ui/button.tsx
    import { Slot } from "@radix-ui/react-slot";
    import { cva, type VariantProps } from "class-variance-authority";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    
    const buttonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground shadow-sm shadow-black/5 hover:bg-primary/90",
            destructive:
              "bg-destructive text-destructive-foreground shadow-sm shadow-black/5 hover:bg-destructive/90",
            outline:
              "border border-input bg-background shadow-sm shadow-black/5 hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground shadow-sm shadow-black/5 hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-lg px-3 text-xs",
            lg: "h-10 rounded-lg px-8",
            icon: "h-9 w-9",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      },
    );
    
    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      asChild?: boolean;
    }
    
    const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
          <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
        );
      },
    );
    Button.displayName = "Button";
    
    export { Button, buttonVariants };
    
    ```
    
    ```tsx
    /components/ui/dialog.tsx
    "use client";
    
    import * as DialogPrimitive from "@radix-ui/react-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { Cross2Icon } from "@radix-ui/react-icons";
    
    const Dialog = DialogPrimitive.Root;
    
    const DialogTrigger = DialogPrimitive.Trigger;
    
    const DialogPortal = DialogPrimitive.Portal;
    
    const DialogClose = DialogPrimitive.Close;
    
    const DialogOverlay = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          "fixed inset-0 z-[101] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
      />
    ));
    DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
    
    const DialogContent = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
    >(({ className, children, ...props }, ref) => (
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-[101] grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close className="group absolute right-3 top-3 flex size-7 items-center justify-center rounded-lg outline-offset-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none">
            <Cross2Icon
              width={16}
              height={16}
              strokeWidth={2}
              className="opacity-60 transition-opacity group-hover:opacity-100"
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    ));
    DialogContent.displayName = DialogPrimitive.Content.displayName;
    
    const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
    );
    DialogHeader.displayName = "DialogHeader";
    
    const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3", className)}
        {...props}
      />
    );
    DialogFooter.displayName = "DialogFooter";
    
    const DialogTitle = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold tracking-tight", className)}
        {...props}
      />
    ));
    DialogTitle.displayName = DialogPrimitive.Title.displayName;
    
    const DialogDescription = React.forwardRef<
      React.ElementRef<typeof DialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    DialogDescription.displayName = DialogPrimitive.Description.displayName;
    
    export {
      Dialog,
      DialogClose,
      DialogContent,
      DialogDescription,
      DialogFooter,
      DialogHeader,
      DialogOverlay,
      DialogPortal,
      DialogTitle,
      DialogTrigger,
    };
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    @radix-ui/react-icons, @radix-ui/react-dialog, @radix-ui/react-checkbox, @radix-ui/react-slot, class-variance-authority
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    

### 3.4 Sidebar

- This is the sidebar component that should be present on the dashboard page, budget page, and net_worth page. not on the landing page, sign up page, or login page.
- Here are the sidebar requirements. Please change the icons and titles to match the project. Dashboard, budget, and net worth. Change the company title to “Radium.”
    
    Copy-paste this component to /components/ui folder:
    
    ```tsx
    sidebar.tsx
    "use client";
    
    import { cn } from "@/lib/utils";
    import Link, { LinkProps } from "next/link";
    import React, { useState, createContext, useContext } from "react";
    import { AnimatePresence, motion } from "framer-motion";
    import { Menu, X } from "lucide-react";
    
    interface Links {
      label: string;
      href: string;
      icon: React.JSX.Element | React.ReactNode;
    }
    
    interface SidebarContextProps {
      open: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      animate: boolean;
    }
    
    const SidebarContext = createContext<SidebarContextProps | undefined>(
      undefined
    );
    
    export const useSidebar = () => {
      const context = useContext(SidebarContext);
      if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
      }
      return context;
    };
    
    export const SidebarProvider = ({
      children,
      open: openProp,
      setOpen: setOpenProp,
      animate = true,
    }: {
      children: React.ReactNode;
      open?: boolean;
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      animate?: boolean;
    }) => {
      const [openState, setOpenState] = useState(false);
    
      const open = openProp !== undefined ? openProp : openState;
      const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
    
      return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
          {children}
        </SidebarContext.Provider>
      );
    };
    
    export const Sidebar = ({
      children,
      open,
      setOpen,
      animate,
    }: {
      children: React.ReactNode;
      open?: boolean;
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      animate?: boolean;
    }) => {
      return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
          {children}
        </SidebarProvider>
      );
    };
    
    export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
      return (
        <>
          <DesktopSidebar {...props} />
          <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
      );
    };
    
    export const DesktopSidebar = ({
      className,
      children,
      ...props
    }: React.ComponentProps<typeof motion.div>) => {
      const { open, setOpen, animate } = useSidebar();
      return (
        <motion.div
          className={cn(
            "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
            className
          )}
          animate={{
            width: animate ? (open ? "300px" : "60px") : "300px",
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          {...props}
        >
          {children}
        </motion.div>
      );
    };
    
    export const MobileSidebar = ({
      className,
      children,
      ...props
    }: React.ComponentProps<"div">) => {
      const { open, setOpen } = useSidebar();
      return (
        <>
          <div
            className={cn(
              "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
            )}
            {...props}
          >
            <div className="flex justify-end z-20 w-full">
              <Menu
                className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              />
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                    className
                  )}
                >
                  <div
                    className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    <X />
                  </div>
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      );
    };
    
    export const SidebarLink = ({
      link,
      className,
      ...props
    }: {
      link: Links;
      className?: string;
      props?: LinkProps;
    }) => {
      const { open, animate } = useSidebar();
      return (
        <Link
          href={link.href}
          className={cn(
            "flex items-center justify-start gap-2 group/sidebar py-2",
            className
          )}
          {...props}
        >
          {link.icon}
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
          >
            {link.label}
          </motion.span>
        </Link>
      );
    };
    
    code.demo.tsx
    "use client";
    import React, { useState } from "react";
    import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
    import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
    import Link from "next/link";
    import { motion } from "framer-motion";
    import Image from "next/image";
    import { cn } from "@/lib/utils";
    
    export function SidebarDemo() {
      const links = [
        {
          label: "Dashboard",
          href: "#",
          icon: (
            <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "Profile",
          href: "#",
          icon: (
            <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "Settings",
          href: "#",
          icon: (
            <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
          label: "Logout",
          href: "#",
          icon: (
            <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
      ];
      const [open, setOpen] = useState(false);
      return (
        <div
          className={cn(
            "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
            "h-[60vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
          )}
        >
          <Sidebar open={open} setOpen={setOpen}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {open ? <Logo /> : <LogoIcon />}
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                </div>
              </div>
              <div>
                <SidebarLink
                  link={{
                    label: "Manu Arora",
                    href: "#",
                    icon: (
                      <Image
                        src="<https://assets.aceternity.com/manu.png>"
                        className="h-7 w-7 flex-shrink-0 rounded-full"
                        width={50}
                        height={50}
                        alt="Avatar"
                      />
                    ),
                  }}
                />
              </div>
            </SidebarBody>
          </Sidebar>
          <Dashboard />
        </div>
      );
    }
    
    export const Logo = () => {
      return (
        <Link
          href="#"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
          <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium text-black dark:text-white whitespace-pre"
          >
            Acet Labs
          </motion.span>
        </Link>
      );
    };
    
    export const LogoIcon = () => {
      return (
        <Link
          href="#"
          className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
          <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
      );
    };
    
    // Dummy dashboard component with content
    const Dashboard = () => {
      return (
        <div className="flex flex-1">
          <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
            <div className="flex gap-2">
              {[...new Array(4)].map((i) => (
                <div
                  key={"first-array" + i}
                  className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
            <div className="flex gap-2 flex-1">
              {[...new Array(2)].map((i) => (
                <div
                  key={"second-array" + i}
                  className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/sidebar.tsx
    "use client";
    
    import { cn } from "@/lib/utils";
    import Link, { LinkProps } from "next/link";
    import React, { useState, createContext, useContext } from "react";
    import { AnimatePresence, motion } from "framer-motion";
    import { Menu, X } from "lucide-react";
    
    interface Links {
      label: string;
      href: string;
      icon: React.JSX.Element | React.ReactNode;
    }
    
    interface SidebarContextProps {
      open: boolean;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      animate: boolean;
    }
    
    const SidebarContext = createContext<SidebarContextProps | undefined>(
      undefined
    );
    
    export const useSidebar = () => {
      const context = useContext(SidebarContext);
      if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
      }
      return context;
    };
    
    export const SidebarProvider = ({
      children,
      open: openProp,
      setOpen: setOpenProp,
      animate = true,
    }: {
      children: React.ReactNode;
      open?: boolean;
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      animate?: boolean;
    }) => {
      const [openState, setOpenState] = useState(false);
    
      const open = openProp !== undefined ? openProp : openState;
      const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;
    
      return (
        <SidebarContext.Provider value={{ open, setOpen, animate }}>
          {children}
        </SidebarContext.Provider>
      );
    };
    
    export const Sidebar = ({
      children,
      open,
      setOpen,
      animate,
    }: {
      children: React.ReactNode;
      open?: boolean;
      setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
      animate?: boolean;
    }) => {
      return (
        <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
          {children}
        </SidebarProvider>
      );
    };
    
    export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
      return (
        <>
          <DesktopSidebar {...props} />
          <MobileSidebar {...(props as React.ComponentProps<"div">)} />
        </>
      );
    };
    
    export const DesktopSidebar = ({
      className,
      children,
      ...props
    }: React.ComponentProps<typeof motion.div>) => {
      const { open, setOpen, animate } = useSidebar();
      return (
        <motion.div
          className={cn(
            "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
            className
          )}
          animate={{
            width: animate ? (open ? "300px" : "60px") : "300px",
          }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          {...props}
        >
          {children}
        </motion.div>
      );
    };
    
    export const MobileSidebar = ({
      className,
      children,
      ...props
    }: React.ComponentProps<"div">) => {
      const { open, setOpen } = useSidebar();
      return (
        <>
          <div
            className={cn(
              "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full"
            )}
            {...props}
          >
            <div className="flex justify-end z-20 w-full">
              <Menu
                className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              />
            </div>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className={cn(
                    "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                    className
                  )}
                >
                  <div
                    className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    onClick={() => setOpen(!open)}
                  >
                    <X />
                  </div>
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      );
    };
    
    export const SidebarLink = ({
      link,
      className,
      ...props
    }: {
      link: Links;
      className?: string;
      props?: LinkProps;
    }) => {
      const { open, animate } = useSidebar();
      return (
        <Link
          href={link.href}
          className={cn(
            "flex items-center justify-start gap-2 group/sidebar py-2",
            className
          )}
          {...props}
        >
          {link.icon}
          <motion.span
            animate={{
              display: animate ? (open ? "inline-block" : "none") : "inline-block",
              opacity: animate ? (open ? 1 : 0) : 1,
            }}
            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
          >
            {link.label}
          </motion.span>
        </Link>
      );
    };
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    framer-motion
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    

### 3.5 Dashboard Page

- **Page URL:** `/dashboard`
- **Main Page Objective:** This page should be a dashboard that acts as a visual overview of the user’s financial state
- **Key Features:** Ability to filter the chart type and the month range of the data
- **Requirements**
    - Page is titled “Dashboard”
    - Small cards for “Income”, “Expenses”, “Net” and “Current net worth” with the data being pulled for the user’s id from the supabase table. Also show a percent change.
    - Wide section for a chart
    - Slightly less wide section for detailed info on the raw data points that make up the chart. Organized by date
    - Hovering over the chart should show details of the data point.
    - The date filter should default to the last 12 months of data. It should reference the current month to calculate that. It should require a minimum of a difference of at least 1 month. It should have validation that the user cannot select a future month.
    - Chart types to filter between:
        - Income
            - Should be a line chart with the sum of the income for each month as the value. X axis should be months. The detailed data on the right should show all the transactions in the date range with a transaction type of “income”, in a scroll section where each transaction has its own card with the title, value, and date. It should be sorted with the most recent transaction at the top.
        - Expenses
            - Should be a stacked bar chart broken down into the expense categories and show the sum of the transactions for those categories. The axis should be months. The detailed data on the right should show all the transactions in the date range with a transaction type of “expense”, in a scroll section where each transaction has its own card with the title, value, and date. It should be sorted with the most recent transaction at the top.
        - Income vs expenses
            - This should be a bar chart with income in green, expenses in red, and the net in either green or red (depending on if it is positive or negative). X axis should be months. The detailed data on the right should show all the transactions in the date range with a transaction type of either income or expense, in a scroll section where each transaction has its own card with the title, value, and date. It should be sorted with the most recent transaction at the top.
        - Net worth
            - Should be a line chart with data points for each record in the net_worth_log table. The value should be the total net worth of each log. The x axis should be the dates of the logs. The detailed data on the right should show all the net_worth_logs in the date range in a scroll section where each transaction has its own card with the title, value, and date. It should be sorted with the most recent transaction at the top.
- **Buttons & Actions:**
    - [Filter on the left side (below the page title) to filter between the chart types] → [Changes the ]
    - [Filter for the month and year. Not the day. This can be a range of months. Defaults to the last 12 months. Minimum of 2 months required.] → [Changes the calculation for the data that is shown in the charts, as well as the detailed data on the right]
- **Data Requirements:**
    - **Data to Display:** Pull all the data from the supabase table. Pull from the transactions and net_worth_log tables for the relevant fields. Check the table names, column names, and data types from the “copy_of supabase” file.
    - **Database Source:** (Which table and field should each value come from?)
    - **External API Calls:** (If data is fetched from an external API, specify the endpoint)

### 3.6 Budget Page

- **Page URL:** /budget
- **Main Page Objective:** This page should be a budget tool that lets the user create a planned amount to spend per category, and log transactions against these categories. each month should be different.
- **Key Features:** Ability to create planned expenses and incomes, and actual incomes and transactions (transactions).
- **Requirements**
    - Page is titled “Budget”
    - Ability to create a planned budget income or expense for a category with a dollar amount (value) with the ability to add a title.
    - A date filter should default to the current month. It can be switched to go back or forward a month at a time.
    - The date filter should change the data on the page to match it, based on the “date” field (not created_at).
    - Ability to edit and delete transactions and planned budget items. Changes are saved to the database table. All fields should be editable.
- **Data Requirements:**
    - **Data to Display:** Pull all the data from the supabase table. Pull from the transactions and planned_budget tables for the relevant fields. Check the table names, column names, and data types from the “copy_of supabase” file.

### 3.7 Net Worth Page

- **Page URL:** /net-worth
- **Main Page Objective:** This page should be a place to create logs of a user’s current net worth at a moment in time.
- **Key Features:** Ability to create a
- **Requirements**
    - Page is titled “Net Worth”
    - Small card for the current net worth, which is the net worth of the most recent net_worth_log
    - Ability to create a new_worth_log and add new items in the modal and assign a title and value to them.
        - Calculate the sum of the items. This is the net worth.
    - line chart for the net worth, matches the net_worth chart on the dashboard.
- **Data Requirements:**
    - **Data to Display:** Pull all the data from the supabase table. Pull from the transactions and net_worth_log tables for the relevant fields. Check the table names, column names, and data types from the “copy_of supabase” file.

# **4. Frontend Components & Styling**

- **Component Structure:**
    - **Reusable Components:** (List buttons, modals, input fields, etc.)
    - **Routing Method:** Nextjs pages
- **Success message component:** (describe or paste component code)
    
    Copy-paste this component to /components/ui folder:
    
    Call it “success_message”
    
    ```tsx
    code.tsx?v=1
    import * as React from "react"
    import { cva, type VariantProps } from "class-variance-authority"
    import { cn } from "@/lib/utils"
    
    const alertVariants = cva("relative rounded-lg border", {
      variants: {
        variant: {
          default: "border-border bg-background",
          warning: "border-amber-500/50 text-amber-600",
          error: "border-red-500/50 text-red-600",
          success: "border-emerald-500/50",
          info: "border-blue-500/50 text-blue-600",
        },
        size: {
          sm: "px-4 py-3",
          lg: "p-4",
        },
        isNotification: {
          true: "z-[100] max-w-[400px] bg-background shadow-lg shadow-black/5",
          false: "",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "sm",
        isNotification: false,
      },
    })
    
    interface AlertProps
      extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {
      icon?: React.ReactNode
      action?: React.ReactNode
      layout?: "row" | "complex"
    }
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
      (
        {
          className,
          variant,
          size,
          isNotification,
          icon,
          action,
          layout = "row",
          children,
          ...props
        },
        ref,
      ) => (
        <div
          ref={ref}
          role="alert"
          className={cn(
            alertVariants({ variant, size, isNotification }),
            className,
          )}
          {...props}
        >
          {layout === "row" ? (
            // Однострочный вариант
            <div className="flex items-center gap-2">
              <div className="grow flex items-center">
                {icon && <span className="me-3 inline-flex">{icon}</span>}
                {children}
              </div>
              {action && <div className="flex items-center shrink-0">{action}</div>}
            </div>
          ) : (
            // Многострочный вариант
            <div className="flex gap-2">
              {icon && children ? (
                <div className="flex grow gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="grow">{children}</div>
                </div>
              ) : (
                <div className="grow">
                  {icon && <span className="me-3 inline-flex">{icon}</span>}
                  {children}
                </div>
              )}
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
        </div>
      ),
    )
    Alert.displayName = "Alert"
    
    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
      <h5 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
    ))
    AlertTitle.displayName = "AlertTitle"
    
    const AlertDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ))
    AlertDescription.displayName = "AlertDescription"
    
    const AlertContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    ))
    AlertContent.displayName = "AlertContent"
    
    export { Alert, AlertTitle, AlertDescription, AlertContent }
    
    code.demo.tsx?v=1
    import { Alert } from "@/components/ui/alert"
    import { CircleCheck } from "lucide-react"
    
    function AlertSuccess() {
      return (
        <Alert
          layout="row"
          icon={
            <CircleCheck className="text-emerald-500" size={16} strokeWidth={2} />
          }
        >
          <p className="text-sm">Completed successfully!</p>
        </Alert>
      )
    }
    
    export { AlertSuccess }
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/alert.tsx
    import * as React from "react"
    import { cva, type VariantProps } from "class-variance-authority"
    import { cn } from "@/lib/utils"
    
    const alertVariants = cva("relative rounded-lg border", {
      variants: {
        variant: {
          default: "border-border bg-background",
          warning: "border-amber-500/50 text-amber-600",
          error: "border-red-500/50 text-red-600",
          success: "border-emerald-500/50",
          info: "border-blue-500/50 text-blue-600",
        },
        size: {
          sm: "px-4 py-3",
          lg: "p-4",
        },
        isNotification: {
          true: "z-[100] max-w-[400px] bg-background shadow-lg shadow-black/5",
          false: "",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "sm",
        isNotification: false,
      },
    })
    
    interface AlertProps
      extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {
      icon?: React.ReactNode
      action?: React.ReactNode
      layout?: "row" | "complex"
    }
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
      (
        {
          className,
          variant,
          size,
          isNotification,
          icon,
          action,
          layout = "row",
          children,
          ...props
        },
        ref,
      ) => (
        <div
          ref={ref}
          role="alert"
          className={cn(
            alertVariants({ variant, size, isNotification }),
            className,
          )}
          {...props}
        >
          {layout === "row" ? (
            // Однострочный вариант
            <div className="flex items-center gap-2">
              <div className="grow flex items-center">
                {icon && <span className="me-3 inline-flex">{icon}</span>}
                {children}
              </div>
              {action && <div className="flex items-center shrink-0">{action}</div>}
            </div>
          ) : (
            // Многострочный вариант
            <div className="flex gap-2">
              {icon && children ? (
                <div className="flex grow gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="grow">{children}</div>
                </div>
              ) : (
                <div className="grow">
                  {icon && <span className="me-3 inline-flex">{icon}</span>}
                  {children}
                </div>
              )}
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
        </div>
      ),
    )
    Alert.displayName = "Alert"
    
    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
      <h5 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
    ))
    AlertTitle.displayName = "AlertTitle"
    
    const AlertDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ))
    AlertDescription.displayName = "AlertDescription"
    
    const AlertContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    ))
    AlertContent.displayName = "AlertContent"
    
    export { Alert, AlertTitle, AlertDescription, AlertContent }
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    class-variance-authority
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    
- **Error message component:** (describe or paste component code)
    
    Copy-paste this component to /components/ui folder:
    
    Call it “error_message”
    
    ```tsx
    code.tsx?v=1
    import * as React from "react"
    import { cva, type VariantProps } from "class-variance-authority"
    import { cn } from "@/lib/utils"
    
    const alertVariants = cva("relative rounded-lg border", {
      variants: {
        variant: {
          default: "border-border bg-background",
          warning: "border-amber-500/50 text-amber-600",
          error: "border-red-500/50 text-red-600",
          success: "border-emerald-500/50",
          info: "border-blue-500/50 text-blue-600",
        },
        size: {
          sm: "px-4 py-3",
          lg: "p-4",
        },
        isNotification: {
          true: "z-[100] max-w-[400px] bg-background shadow-lg shadow-black/5",
          false: "",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "sm",
        isNotification: false,
      },
    })
    
    interface AlertProps
      extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {
      icon?: React.ReactNode
      action?: React.ReactNode
      layout?: "row" | "complex"
    }
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
      (
        {
          className,
          variant,
          size,
          isNotification,
          icon,
          action,
          layout = "row",
          children,
          ...props
        },
        ref,
      ) => (
        <div
          ref={ref}
          role="alert"
          className={cn(
            alertVariants({ variant, size, isNotification }),
            className,
          )}
          {...props}
        >
          {layout === "row" ? (
            // Однострочный вариант
            <div className="flex items-center gap-2">
              <div className="grow flex items-center">
                {icon && <span className="me-3 inline-flex">{icon}</span>}
                {children}
              </div>
              {action && <div className="flex items-center shrink-0">{action}</div>}
            </div>
          ) : (
            // Многострочный вариант
            <div className="flex gap-2">
              {icon && children ? (
                <div className="flex grow gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="grow">{children}</div>
                </div>
              ) : (
                <div className="grow">
                  {icon && <span className="me-3 inline-flex">{icon}</span>}
                  {children}
                </div>
              )}
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
        </div>
      ),
    )
    Alert.displayName = "Alert"
    
    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
      <h5 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
    ))
    AlertTitle.displayName = "AlertTitle"
    
    const AlertDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ))
    AlertDescription.displayName = "AlertDescription"
    
    const AlertContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    ))
    AlertContent.displayName = "AlertContent"
    
    export { Alert, AlertTitle, AlertDescription, AlertContent }
    
    code.demo.tsx?v=1
    import { Alert } from "@/components/ui/alert"
    import { CircleAlert } from "lucide-react"
    
    function AlertError() {
      return (
        <Alert
          layout="row"
          icon={
            <CircleAlert className="text-red-500" size={16} strokeWidth={2} />
          }
        >
          <p className="text-sm">An error occurred!</p>
        </Alert>
      )
    }
    
    export { AlertError }
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/alert.tsx
    import * as React from "react"
    import { cva, type VariantProps } from "class-variance-authority"
    import { cn } from "@/lib/utils"
    
    const alertVariants = cva("relative rounded-lg border", {
      variants: {
        variant: {
          default: "border-border bg-background",
          warning: "border-amber-500/50 text-amber-600",
          error: "border-red-500/50 text-red-600",
          success: "border-emerald-500/50",
          info: "border-blue-500/50 text-blue-600",
        },
        size: {
          sm: "px-4 py-3",
          lg: "p-4",
        },
        isNotification: {
          true: "z-[100] max-w-[400px] bg-background shadow-lg shadow-black/5",
          false: "",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "sm",
        isNotification: false,
      },
    })
    
    interface AlertProps
      extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof alertVariants> {
      icon?: React.ReactNode
      action?: React.ReactNode
      layout?: "row" | "complex"
    }
    
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
      (
        {
          className,
          variant,
          size,
          isNotification,
          icon,
          action,
          layout = "row",
          children,
          ...props
        },
        ref,
      ) => (
        <div
          ref={ref}
          role="alert"
          className={cn(
            alertVariants({ variant, size, isNotification }),
            className,
          )}
          {...props}
        >
          {layout === "row" ? (
            // Однострочный вариант
            <div className="flex items-center gap-2">
              <div className="grow flex items-center">
                {icon && <span className="me-3 inline-flex">{icon}</span>}
                {children}
              </div>
              {action && <div className="flex items-center shrink-0">{action}</div>}
            </div>
          ) : (
            // Многострочный вариант
            <div className="flex gap-2">
              {icon && children ? (
                <div className="flex grow gap-3">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="grow">{children}</div>
                </div>
              ) : (
                <div className="grow">
                  {icon && <span className="me-3 inline-flex">{icon}</span>}
                  {children}
                </div>
              )}
              {action && <div className="shrink-0">{action}</div>}
            </div>
          )}
        </div>
      ),
    )
    Alert.displayName = "Alert"
    
    const AlertTitle = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLHeadingElement>
    >(({ className, ...props }, ref) => (
      <h5 ref={ref} className={cn("text-sm font-medium", className)} {...props} />
    ))
    AlertTitle.displayName = "AlertTitle"
    
    const AlertDescription = React.forwardRef<
      HTMLParagraphElement,
      React.HTMLAttributes<HTMLParagraphElement>
    >(({ className, ...props }, ref) => (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ))
    AlertDescription.displayName = "AlertDescription"
    
    const AlertContent = React.forwardRef<
      HTMLDivElement,
      React.HTMLAttributes<HTMLDivElement>
    >(({ className, ...props }, ref) => (
      <div ref={ref} className={cn("space-y-1", className)} {...props} />
    ))
    AlertContent.displayName = "AlertContent"
    
    export { Alert, AlertTitle, AlertDescription, AlertContent }
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    class-variance-authority
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    
- **Loading spinner:** (describe or paste component code)
    
    Only use the “ring” loading component from the options in this component. there are 8, and we only want to use the ring loading state:
    
    Copy-paste this component to /components/ui folder:
    
    Call it “loading_ring_spinner”
    
    ```tsx
    code.tsx
    import { cn } from '@/lib/utils';
    import {
      LoaderCircleIcon,
      LoaderIcon,
      LoaderPinwheelIcon,
      type LucideProps,
    } from 'lucide-react';
    
    type SpinnerVariantProps = Omit<SpinnerProps, 'variant'>;
    
    const Default = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const Circle = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderCircleIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const Pinwheel = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderPinwheelIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const CircleFilled = ({
      className,
      size = 24,
      ...props
    }: SpinnerVariantProps) => (
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rotate-180">
          <LoaderCircleIcon
            className={cn('animate-spin', className, 'text-foreground opacity-20')}
            size={size}
            {...props}
          />
        </div>
        <LoaderCircleIcon
          className={cn('relative animate-spin', className)}
          size={size}
          {...props}
        />
      </div>
    );
    
    const Ellipsis = ({ size = 24, ...props }: SpinnerVariantProps) => {
      return (
        <svg
          xmlns="<http://www.w3.org/2000/svg>"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          {...props}
        >
          <title>Loading...</title>
          <circle cx="4" cy="12" r="2" fill="currentColor">
            <animate
              id="ellipsis1"
              begin="0;ellipsis3.end+0.25s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="12" cy="12" r="2" fill="currentColor">
            <animate
              begin="ellipsis1.begin+0.1s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="20" cy="12" r="2" fill="currentColor">
            <animate
              id="ellipsis3"
              begin="ellipsis1.begin+0.2s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
        </svg>
      );
    };
    
    const Ring = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 44 44"
        stroke="currentColor"
        {...props}
      >
        <title>Loading...</title>
        <g fill="none" fillRule="evenodd" strokeWidth="2">
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="0s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="-0.9s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="-0.9s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    );
    
    const Bars = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        {...props}
      >
        <title>Loading...</title>
        <style>{`
          .spinner-bar {
            animation: spinner-bars-animation .8s linear infinite;
            animation-delay: -.8s;
          }
          .spinner-bars-2 {
            animation-delay: -.65s;
          }
          .spinner-bars-3 {
            animation-delay: -0.5s;
          }
          @keyframes spinner-bars-animation {
            0% {
              y: 1px;
              height: 22px;
            }
            93.75% {
              y: 5px;
              height: 14px;
              opacity: 0.2;
            }
          }
        `}</style>
        <rect
          className="spinner-bar"
          x="1"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
        <rect
          className="spinner-bar spinner-bars-2"
          x="9"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
        <rect
          className="spinner-bar spinner-bars-3"
          x="17"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
      </svg>
    );
    
    const Infinite = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        {...props}
      >
        <title>Loading...</title>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="205.271142578125 51.317785644531256"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          strokeLinecap="round"
          style={{
            transform: 'scale(0.8)',
            transformOrigin: '50px 50px',
          }}
        >
          <animate
            attributeName="stroke-dashoffset"
            repeatCount="indefinite"
            dur="2s"
            keyTimes="0;1"
            values="0;256.58892822265625"
          />
        </path>
      </svg>
    );
    
    export type SpinnerProps = LucideProps & {
      variant?:
        | 'default'
        | 'circle'
        | 'pinwheel'
        | 'circle-filled'
        | 'ellipsis'
        | 'ring'
        | 'bars'
        | 'infinite';
    };
    
    export const Spinner = ({ variant, ...props }: SpinnerProps) => {
      switch (variant) {
        case 'circle':
          return <Circle {...props} />;
        case 'pinwheel':
          return <Pinwheel {...props} />;
        case 'circle-filled':
          return <CircleFilled {...props} />;
        case 'ellipsis':
          return <Ellipsis {...props} />;
        case 'ring':
          return <Ring {...props} />;
        case 'bars':
          return <Bars {...props} />;
        case 'infinite':
          return <Infinite {...props} />;
        default:
          return <Default {...props} />;
      }
    };
    
    code.demo.tsx
    import { Spinner } from "@/components/ui/spinner"
    
    const variants = ['default', 'circle', 'pinwheel', 'circle-filled', 'ellipsis', 'ring', 'bars', 'infinite'];
    
    const Demo = () => (
      <div className="grid grid-cols-4 gap-16">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-center justify-center gap-4">
            <Spinner key={variant} variant={variant} />
            <span className="text-xs text-muted-foreground font-mono">{variant}</span>
          </div>
        ))}
      </div>
    );
    
    export default { Demo }
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/spinner.tsx
    import { cn } from '@/lib/utils';
    import {
      LoaderCircleIcon,
      LoaderIcon,
      LoaderPinwheelIcon,
      type LucideProps,
    } from 'lucide-react';
    
    type SpinnerVariantProps = Omit<SpinnerProps, 'variant'>;
    
    const Default = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const Circle = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderCircleIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const Pinwheel = ({ className, ...props }: SpinnerVariantProps) => (
      <LoaderPinwheelIcon className={cn('animate-spin', className)} {...props} />
    );
    
    const CircleFilled = ({
      className,
      size = 24,
      ...props
    }: SpinnerVariantProps) => (
      <div className="relative" style={{ width: size, height: size }}>
        <div className="absolute inset-0 rotate-180">
          <LoaderCircleIcon
            className={cn('animate-spin', className, 'text-foreground opacity-20')}
            size={size}
            {...props}
          />
        </div>
        <LoaderCircleIcon
          className={cn('relative animate-spin', className)}
          size={size}
          {...props}
        />
      </div>
    );
    
    const Ellipsis = ({ size = 24, ...props }: SpinnerVariantProps) => {
      return (
        <svg
          xmlns="<http://www.w3.org/2000/svg>"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          {...props}
        >
          <title>Loading...</title>
          <circle cx="4" cy="12" r="2" fill="currentColor">
            <animate
              id="ellipsis1"
              begin="0;ellipsis3.end+0.25s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="12" cy="12" r="2" fill="currentColor">
            <animate
              begin="ellipsis1.begin+0.1s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
          <circle cx="20" cy="12" r="2" fill="currentColor">
            <animate
              id="ellipsis3"
              begin="ellipsis1.begin+0.2s"
              attributeName="cy"
              calcMode="spline"
              dur="0.6s"
              values="12;6;12"
              keySplines=".33,.66,.66,1;.33,0,.66,.33"
            />
          </circle>
        </svg>
      );
    };
    
    const Ring = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 44 44"
        stroke="currentColor"
        {...props}
      >
        <title>Loading...</title>
        <g fill="none" fillRule="evenodd" strokeWidth="2">
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="0s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="-0.9s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="-0.9s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    );
    
    const Bars = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        {...props}
      >
        <title>Loading...</title>
        <style>{`
          .spinner-bar {
            animation: spinner-bars-animation .8s linear infinite;
            animation-delay: -.8s;
          }
          .spinner-bars-2 {
            animation-delay: -.65s;
          }
          .spinner-bars-3 {
            animation-delay: -0.5s;
          }
          @keyframes spinner-bars-animation {
            0% {
              y: 1px;
              height: 22px;
            }
            93.75% {
              y: 5px;
              height: 14px;
              opacity: 0.2;
            }
          }
        `}</style>
        <rect
          className="spinner-bar"
          x="1"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
        <rect
          className="spinner-bar spinner-bars-2"
          x="9"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
        <rect
          className="spinner-bar spinner-bars-3"
          x="17"
          y="1"
          width="6"
          height="22"
          fill="currentColor"
        />
      </svg>
    );
    
    const Infinite = ({ size = 24, ...props }: SpinnerVariantProps) => (
      <svg
        xmlns="<http://www.w3.org/2000/svg>"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        {...props}
      >
        <title>Loading...</title>
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray="205.271142578125 51.317785644531256"
          d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z"
          strokeLinecap="round"
          style={{
            transform: 'scale(0.8)',
            transformOrigin: '50px 50px',
          }}
        >
          <animate
            attributeName="stroke-dashoffset"
            repeatCount="indefinite"
            dur="2s"
            keyTimes="0;1"
            values="0;256.58892822265625"
          />
        </path>
      </svg>
    );
    
    export type SpinnerProps = LucideProps & {
      variant?:
        | 'default'
        | 'circle'
        | 'pinwheel'
        | 'circle-filled'
        | 'ellipsis'
        | 'ring'
        | 'bars'
        | 'infinite';
    };
    
    export const Spinner = ({ variant, ...props }: SpinnerProps) => {
      switch (variant) {
        case 'circle':
          return <Circle {...props} />;
        case 'pinwheel':
          return <Pinwheel {...props} />;
        case 'circle-filled':
          return <CircleFilled {...props} />;
        case 'ellipsis':
          return <Ellipsis {...props} />;
        case 'ring':
          return <Ring {...props} />;
        case 'bars':
          return <Bars {...props} />;
        case 'infinite':
          return <Infinite {...props} />;
        default:
          return <Default {...props} />;
      }
    };
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.
    
- **Delete confirmation:** (describe or paste component code)
    
    Copy-paste this component to /components/ui folder:
    
    Call it “delete_confirmation_dialog”
    
    ```tsx
    alert-dialog.tsx
    "use client";
    
    import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { buttonVariants } from "@/components/ui/button";
    
    const AlertDialog = AlertDialogPrimitive.Root;
    
    const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
    
    const AlertDialogPortal = AlertDialogPrimitive.Portal;
    
    const AlertDialogOverlay = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
        ref={ref}
      />
    ));
    AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
    
    const AlertDialogContent = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
    >(({ className, ...props }, ref) => (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        />
      </AlertDialogPortal>
    ));
    AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
    
    const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1 text-center sm:text-left", className)} {...props} />
    );
    AlertDialogHeader.displayName = "AlertDialogHeader";
    
    const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3", className)}
        {...props}
      />
    );
    AlertDialogFooter.displayName = "AlertDialogFooter";
    
    const AlertDialogTitle = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
      />
    ));
    AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
    
    const AlertDialogDescription = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
    
    const AlertDialogAction = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Action>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
    ));
    AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
    
    const AlertDialogCancel = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
        {...props}
      />
    ));
    AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
    
    export {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogOverlay,
      AlertDialogPortal,
      AlertDialogTitle,
      AlertDialogTrigger,
    };
    
    code.demo.tsx?v=1
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import { Button } from "@/components/ui/button";
    import { CircleAlert } from "lucide-react";
    
    function AlertComponent() {
      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Alert dialog with icon</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border"
                aria-hidden="true"
              >
                <CircleAlert className="opacity-80" size={16} strokeWidth={2} />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete your account? All your data will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    
    export { AlertComponent };
    
    ```
    
    Copy-paste these files for dependencies:
    
    ```tsx
    /components/ui/button.tsx
    import * as React from "react"
    import { Slot } from "@radix-ui/react-slot"
    import { cva, type VariantProps } from "class-variance-authority"
    
    import { cn } from "@/lib/utils"
    
    const buttonVariants = cva(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground hover:bg-primary/90",
            destructive:
              "bg-destructive text-destructive-foreground hover:bg-destructive/90",
            outline:
              "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-accent hover:text-accent-foreground",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
          },
        },
        defaultVariants: {
          variant: "default",
          size: "default",
        },
      },
    )
    
    export interface ButtonProps
      extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
      asChild?: boolean
    }
    
    const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
          <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
          />
        )
      },
    )
    Button.displayName = "Button"
    
    export { Button, buttonVariants }
    
    ```
    
    ```tsx
    /components/ui/alert-dialog.tsx
    "use client";
    
    import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
    import * as React from "react";
    
    import { cn } from "@/lib/utils";
    import { buttonVariants } from "@/components/ui/button";
    
    const AlertDialog = AlertDialogPrimitive.Root;
    
    const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
    
    const AlertDialogPortal = AlertDialogPrimitive.Portal;
    
    const AlertDialogOverlay = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          className,
        )}
        {...props}
        ref={ref}
      />
    ));
    AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName;
    
    const AlertDialogContent = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Content>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
    >(({ className, ...props }, ref) => (
      <AlertDialogPortal>
        <AlertDialogOverlay />
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 grid max-h-[calc(100%-4rem)] w-full -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto border bg-background p-6 shadow-lg shadow-black/5 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-[400px] sm:rounded-xl",
            className,
          )}
          {...props}
        />
      </AlertDialogPortal>
    ));
    AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;
    
    const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={cn("flex flex-col space-y-1 text-center sm:text-left", className)} {...props} />
    );
    AlertDialogHeader.displayName = "AlertDialogHeader";
    
    const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3", className)}
        {...props}
      />
    );
    AlertDialogFooter.displayName = "AlertDialogFooter";
    
    const AlertDialogTitle = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Title>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Title
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
      />
    ));
    AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;
    
    const AlertDialogDescription = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Description>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    ));
    AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;
    
    const AlertDialogAction = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Action>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Action ref={ref} className={cn(buttonVariants(), className)} {...props} />
    ));
    AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;
    
    const AlertDialogCancel = React.forwardRef<
      React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
      React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
    >(({ className, ...props }, ref) => (
      <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0", className)}
        {...props}
      />
    ));
    AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;
    
    export {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogOverlay,
      AlertDialogPortal,
      AlertDialogTitle,
      AlertDialogTrigger,
    };
    
    ```
    
    Install NPM dependencies:
    
    ```bash
    @radix-ui/react-alert-dialog, @radix-ui/react-slot, class-variance-authority
    
    ```
    
    Remember: Do not change the component's code unless it's required to integrate or the user asks you to.
    IMPORTANT: Create all mentioned files in full, without abbreviations. Do not use placeholders like "insert the rest of the code here" – output every line of code exactly as it is, so it can be copied and pasted directly into the project.