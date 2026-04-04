import { ArrowUpRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

const posts = [
  { title: "How to Build a Brand That Stands Out in 2025", date: "Apr 22, 2025", author: "Kola Communications", img: project1 },
  { title: "The Future of Web Design: Trends to Watch", date: "Apr 1, 2025", author: "Kola Communications", img: project2 },
];

const BlogSection = () => {
  return (
    <section id="blog" className="py-16 md:py-24 section-container p-4">
      <div className="flex items-end justify-between mb-10">
        <h2 className="heading-lg">
          <span className="text-text-tertiary">From the</span> Blog
        </h2>
        <a href="#" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          View all posts <ArrowUpRight size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <a key={post.title} href="#" className="group block card-surface overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[16/9] overflow-hidden">
              <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" width={600} height={338} />
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-foreground mb-2 group-hover:underline">{post.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span>·</span>
                <span>By {post.author}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
