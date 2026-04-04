import CaseStudyPage from "../pages/CaseStudyPage";
import { getCaseStudiesData } from "../lib/page-data";

export default async function Page() {
  const studies = await getCaseStudiesData();
  return <CaseStudyPage initialData={studies} />;
}
