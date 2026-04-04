import BlogPage from "../pages/BlogPage";
import { getBlogsData } from "../lib/page-data";

export default async function Page() {
  const blogs = await getBlogsData();
  return <BlogPage initialData={blogs} />;
}
