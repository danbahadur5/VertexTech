import CaseStudyDetailPage from "../../pages/CaseStudyDetailPage";
import { getCaseStudyBySlug } from "../../lib/page-data";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const study = await getCaseStudyBySlug(slug);
  
  if (!study) {
    notFound();
  }

  return <CaseStudyDetailPage initialData={study} />;
}
