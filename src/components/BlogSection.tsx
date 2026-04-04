import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import AnimatedHeading from "@/components/AnimatedHeading";

import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";

/* ---------------- DATA ---------------- */
const featuredPost = {
  title: "How designers and developers can actually collaborate.",
  date: "Mar 6, 2025",
  author: "Joseph Alexander",
  desc: "Discover proven strategies to bridge the designer-developer gap. Learn how top teams eliminate handoff friction and ship better products faster through true collaboration.",
  img: project1,
};

const posts = [
  {
    title: "The Future of Web Design: Trends to Watch",
    img: project2,
  },
  {
    title: "Building interfaces that users actually love",
    img: project1,
  },
];

/* ---------------- VIEW ALL BUTTON ---------------- */
const ViewAll = () => {
  return (
    <motion.a
      href="#"
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="hidden md:flex items-center gap-2 text-md text-gray-600 hover:text-black transition group"
    >
      <span className="relative">
        View All
        <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-black group-hover:w-full transition-all duration-300" />
      </span>

      {/* arrow */}
      <span className="relative w-4 h-4 overflow-hidden">
        <motion.span
          variants={{
            rest: { x: 0, y: 0, opacity: 1 },
            hover: { x: 16, y: -16, opacity: 0 },
          }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          <ArrowUpRight size={16} />
        </motion.span>

        <motion.span
          variants={{
            rest: { x: -16, y: 16, opacity: 0 },
            hover: { x: 0, y: 0, opacity: 1 },
          }}
          transition={{ duration: 0.25 }}
          className="absolute"
        >
          <ArrowUpRight size={16} />
        </motion.span>
      </span>
    </motion.a>
  );
};

/* ---------------- FEATURED CARD ---------------- */
const FeaturedPost = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -6 }}
      className="
        group
        rounded-[24px]
        border border-[#e6e6e6]
        overflow-hidden
        bg-white
        mb-6
      "
    >
      <div className="grid md:grid-cols-2">

        {/* IMAGE */}
        <div className="relative overflow-hidden">
          <img
            src={featuredPost.img}
            className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          />

          {/* overlay */}
          <div className="
            absolute inset-0 
            bg-gradient-to-t from-black/10 to-transparent
            opacity-0 group-hover:opacity-100
            transition duration-500
          " />
        </div>

        {/* CONTENT */}
        <div className="p-8 flex flex-col justify-center">
          <h3 className="text-[28px] font-semibold leading-tight mb-3">
            {featuredPost.title}
          </h3>

          <div className="text-xs text-[#777] mb-4">
            {featuredPost.date} &nbsp;&nbsp; By {featuredPost.author}
          </div>

          <p className="text-sm text-[#666] leading-relaxed">
            {featuredPost.desc}
          </p>
        </div>

      </div>
    </motion.div>
  );
};

/* ---------------- GRID CARD ---------------- */
const BlogCard = ({ post }: any) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="
        group
        rounded-[20px]
        overflow-hidden
        border border-[#e6e6e6]
        bg-white
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={post.img}
          className="w-full h-[220px] object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="
          absolute inset-0 
          bg-gradient-to-t from-black/10 to-transparent
          opacity-0 group-hover:opacity-100
          transition duration-500
        " />
      </div>

      <div className="p-5">
        <h3 className="text-[16px] font-medium group-hover:underline">
          {post.title}
        </h3>
      </div>
    </motion.div>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */
const BlogSection = () => {
  return (
    <section className="py-24 section-container">
      <div className="max-w-[1100px] p-4 md:p-10">

        {/* HEADER */}
        <div className="flex items-end justify-between mb-14">
          <AnimatedHeading
            lines={["From my blog,", "design insights."]}
            className="
              text-[clamp(2.6rem,5vw,3.6rem)]
              leading-[1.1]
              tracking-[-0.02em]
              font-semibold
            "
          />

          <ViewAll />
        </div>

        {/* FEATURED */}
        <FeaturedPost />

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, i) => (
            <BlogCard key={i} post={post} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogSection;