import FileCard from "@/components/FileCard";
import { objectOfTools } from "@/lib/tools";

export default function CategorySection() {
    const categories = Object.entries(objectOfTools);

    return (
        <section className="my-10 md:mt-20 md:mb-25">
            <h2 className="text-2xl font-light mb-6">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grid-rows-2">
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
                        linkClassName={index !== 0 && (index + 1) % 3 === 0 ? "lg:row-span-2 lg:h-full" : "h-fit"}
                    />
                ))}
            </div>
        </section>
    );
}
