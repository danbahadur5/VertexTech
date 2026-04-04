import AboutPage from "../pages/AboutPage";
import { getAboutPageData } from "../lib/page-data";

export default async function Page() {
  const data = await getAboutPageData();
  return <AboutPage initialData={data} />;
}
