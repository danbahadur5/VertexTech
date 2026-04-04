import ContactPage from "../pages/ContactPage";
import { getContactPageData } from "../lib/page-data";

export default async function Page() {
  const data = await getContactPageData();
  return <ContactPage initialData={data} />;
}
