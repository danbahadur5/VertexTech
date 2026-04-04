import BlogPostPage from "../../pages/BlogPostPage";
import { getBlogBySlug } from "../../lib/page-data";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    notFound();
  }

  return <BlogPostPage initialData={blog} />;
}
