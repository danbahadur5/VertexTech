import PricingPage from "../pages/PricingPage";
import { getPricingPageData } from "../lib/page-data";

export default async function Page() {
  const data = await getPricingPageData();
  return <PricingPage initialData={data} />;
}
