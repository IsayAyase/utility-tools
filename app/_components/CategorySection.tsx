import FileCard from "@/components/FileCard";
import { objectOfTools } from "@/lib/tools";

export default function CategorySection() {
    const categories = Object.entries(objectOfTools);

    return (
        <section className="my-10 md:mt-20 md:mb-25">
            <h2 className="text-2xl font-light mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map(([slug, category], index) => (
                    <FileCard
                        key={slug}
                        title={category.metadata.category}
                        description={category.metadata.description}
                        icon={category.extra.icon}
                        lightBgColor={category.extra.lightBgColor}
                        darkBgColor={category.extra.darkBgColor}
                        href={`/tools/${slug}`}
                        className="capitalize"
                        linkClassName={index !== 0 && (index + 1) % 3 === 0 ? "md:row-span-2 md:h-full lg:row-span-1 lg:h-fit" : "h-fit"}
                    />
                ))}
            </div>
        </section>
    );
}
