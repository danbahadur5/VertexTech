import ServicesPage from "../pages/ServicesPage";
import { getServicesData } from "../lib/page-data";

export default async function Page() {
  const services = await getServicesData();
  return <ServicesPage initialData={services} />;
}
