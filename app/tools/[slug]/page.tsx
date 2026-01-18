import LayoutWrapper from "@/components/LayoutWrapper";

export default async function page({
    params,
}: {
    params: Promise<{
        slug: string;
    }>;
}) {
    const { slug } = await params;
    return (
        <LayoutWrapper>
            <div>{slug}</div>
        </LayoutWrapper>
    );
}
