import LoadingPage from "@/components/LoadingPage";
import type { CategoriesWithoutAll } from "@/lib/tools/types";
import dynamic from "next/dynamic";
import type { ComponentType, JSX } from "react";

type ToolComponentPage = ComponentType<JSX.IntrinsicElements["div"]>;

export const toolsPageCompObj: Record<
    CategoriesWithoutAll,
    Record<string, ToolComponentPage>
> = {
    developer: {
        url_encoder_decoder: dynamic(
            () => import("./developer/UrlEncoderDecoderPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        base64_encoder_decoder: dynamic(
            () => import("./developer/Base64EncoderDecoderPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        uuid_generator: dynamic(() => import("./developer/UuidGeneratorPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        lorem_ipsum_generator: dynamic(
            () => import("./developer/LoremIpsumGeneratorPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        json_to_csv: dynamic(() => import("./developer/JsonToCsvPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        csv_to_json: dynamic(() => import("./developer/CsvToJsonPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        yaml_to_json: dynamic(() => import("./developer/YamlToJsonPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        hash_generator: dynamic(() => import("./developer/HashGeneratorPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        regex_tester: dynamic(() => import("./developer/RegexTesterPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        cron_expression_builder: dynamic(
            () => import("./developer/CronExpressionBuilderPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        jwt_decoder: dynamic(() => import("./developer/JwtDecoderPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
    },
    document: {
        word_to_pdf: dynamic(() => import("./document/WordToPdfPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_merge: dynamic(() => import("./document/PdfMergePage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_split: dynamic(() => import("./document/PdfSplitPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
        pdf_add_text_watermark: dynamic(
            () => import("./document/PdfTextWaterMarkPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        pdf_add_image_watermark: dynamic(
            () => import("./document/PdfImageWatermarkPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        pdf_metadata_updater: dynamic(
            () => import("./document/PdfMetadataUpdaterPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
    },
    image: {
        image_resize_convert_format: dynamic(
            () => import("./image/ImageResizeConvertFormatPage"),
            { ssr: false, loading: () => <LoadingPage /> },
        ),
        image_to_pdf: dynamic(() => import("./image/ImageToPdfPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),

        image_transform: dynamic(() => import("./image/ImageTransformPage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
    },
    audio: {
        audio_trim_convert: dynamic(
            () => import("./audio/AudioTrimConvertPage"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        ),
        audio_merge: dynamic(() => import("./audio/AudioMergePage"), {
            ssr: false,
            loading: () => <LoadingPage />,
        }),
    },
    video: {
        video_trim_convert: dynamic(
            () => import("./video/VideoTrimConvertPage"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        ),
        add_subtitle_in_video: dynamic(
            () => import("./video/AddSubtitleInVideo"),
            {
                ssr: false,
                loading: () => <LoadingPage />,
            },
        ),
    },
};
