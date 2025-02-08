export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Auth form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          {children}
        </div>
      </div>
      
      {/* Right side - Image/Branding */}
      <div className="hidden lg:block relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold">Welcome to Radium</h2>
            <p className="text-lg">Your personal finance companion</p>
          </div>
        </div>
      </div>
    </div>
  )
} 