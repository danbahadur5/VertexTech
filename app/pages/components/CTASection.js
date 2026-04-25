import { Button } from "../../components/ui/button";
import { ArrowRight} from "lucide-react";
import Link from "next/link";
export default function CTASection(){
    return(
             <section className="py-24 theme-bg">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="reveal">
            <h2 className="text-4xl font-extrabold text-white mb-6">
              Ready to Secure Your Organization?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join 2,000+ security teams that trust DarbarTech to protect their
              endpoints, cloud, and identities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/pricing">
                <Button
                  size="lg"
                  className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12 shadow-lg"
                >
                  View Pricing <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/50 dark:bg-transparent bg-transparent text-white  font-bold rounded-xl px-8 h-12"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
}