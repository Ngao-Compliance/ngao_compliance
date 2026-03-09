import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Shield, ArrowRight, Activity, FileCheck, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    const role = (session?.user as any)?.role;
    if (role === "VASP") {
      redirect("/vasp/dashboard");
    } else if (role === "REGULATOR") {
      redirect("/regulator/dashboard");
    }
    // Fallback logic
    redirect("/audit");
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-ngao-ivory font-sans text-ngao-dark">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center container-wide mx-auto">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-ngao-green text-ngao-ivory shadow-xl mb-10 transition-transform hover:scale-105 duration-300">
          <Shield className="h-12 w-12" />
        </div>
        
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl mb-6">
          Streamlined Compliance for the{" "}
          <span className="text-ngao-green whitespace-nowrap">Digital Asset</span> Era.
        </h1>
        
        <p className="max-w-2xl text-xl leading-relaxed text-ngao-muted mb-12">
          Ngao Compliance bridges the gap between Virtual Asset Service Providers (VASPs) and regulators, offering real-time oversight, secure auditing, and automated reporting.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
          <Link href="/api/auth/signin" className="w-full">
            <Button size="lg" className="w-full h-14 rounded-full bg-ngao-green text-ngao-ivory hover:bg-ngao-green-light text-lg gap-2 shadow-lg shadow-ngao-green/20 group transition-all">
              Sign In to Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/about" className="w-full">
             <Button size="lg" variant="outline" className="w-full h-14 rounded-full border-ngao-border bg-transparent text-ngao-dark hover:bg-ngao-warm-gray text-lg transition-colors">
              Learn More
            </Button>
          </Link>
        </div>
      </main>

      {/* Feature Highlight Section */}
      <section className="bg-white py-24 border-t border-ngao-border">
        <div className="container-wide mx-auto px-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-ngao-warm-gray rounded-full flex items-center justify-center text-ngao-green mb-4">
                   <Activity className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold heading-serif">Real-Time Oversight</h3>
                <p className="text-ngao-muted max-w-sm">Monitor transactions dynamically and receive instant alerts for suspected illicit activities.</p>
             </div>
             
             <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-ngao-warm-gray rounded-full flex items-center justify-center text-ngao-ochre mb-4">
                   <FileCheck className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold heading-serif">Automated Reporting</h3>
                <p className="text-ngao-muted max-w-sm">Generate and submit Suspicious Activity Reports (SARs) seamlessly directly to regulators.</p>
             </div>

             <div className="flex flex-col items-center space-y-4">
                <div className="h-16 w-16 bg-ngao-warm-gray rounded-full flex items-center justify-center text-ngao-dark mb-4">
                   <Lock className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-semibold heading-serif">Immutable Audit Trail</h3>
                <p className="text-ngao-muted max-w-sm">All compliance actions are securely preserved, ensuring an indisputable verifiable history.</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
