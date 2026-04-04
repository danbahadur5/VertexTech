import ServiceDetailPage from "../../pages/ServiceDetailPage";
import { getServiceBySlug } from "../../lib/page-data";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  
  if (!service) {
    notFound();
  }

  return <ServiceDetailPage initialData={service} />;
}
