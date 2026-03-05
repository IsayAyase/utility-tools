import type { CategoriesWithoutAll } from "@/lib/tools/types";
import type { JSX } from "react";
import AudioMergePage from "./audio/AudioMergePage";
import AudioTrimConvertPage from "./audio/AudioTrimConvertPage";
import Base64EncoderDecoderPage from "./developer/Base64EncoderDecoderPage";
import CronExpressionBuilderPage from "./developer/CronExpressionBuilderPage";
import CsvToJsonPage from "./developer/CsvToJsonPage";
import HashGeneratorPage from "./developer/HashGeneratorPage";
import JsonToCsvPage from "./developer/JsonToCsvPage";
import JwtDecoderPage from "./developer/JwtDecoderPage";
import LoremIpsumGeneratorPage from "./developer/LoremIpsumGeneratorPage";
import RegexTesterPage from "./developer/RegexTesterPage";
import UrlEncoderDecoderPage from "./developer/UrlEncoderDecoderPage";
import UuidGeneratorPage from "./developer/UuidGeneratorPage";
import YamlToJsonPage from "./developer/YamlToJsonPage";
import PdfImageWatermarkPage from "./document/PdfImageWatermarkPage";
import PdfMergePage from "./document/PdfMergePage";
import PdfMetadataUpdaterPage from "./document/PdfMetadataUpdaterPage";
import PdfSplitPage from "./document/PdfSplitPage";
import PdfTextWaterMarkPage from "./document/PdfTextWaterMarkPage";
import WordToPdfPage from "./document/WordToPdfPage";
import ImageResizeConvertFormatPage from "./image/ImageResizeConvertFormatPage";
import ImageToPdfPage from "./image/ImageToPdfPage";
import ImageTransformPage from "./image/ImageTransformPage";
import AddSubtitleInVideo from "./video/AddSubtitleInVideo";
import VideoTrimConvertPage from "./video/VideoTrimConvertPage";

type ToolComponentPage = JSX.Element;

export const toolsPageCompObj: Record<
    CategoriesWithoutAll,
    Record<string, ToolComponentPage>
> = {
    developer: {
        url_encoder_decoder: <UrlEncoderDecoderPage />,
        base64_encoder_decoder: <Base64EncoderDecoderPage />,
        uuid_generator: <UuidGeneratorPage />,
        lorem_ipsum_generator: <LoremIpsumGeneratorPage />,
        json_to_csv: <JsonToCsvPage />,
        csv_to_json: <CsvToJsonPage />,
        yaml_to_json: <YamlToJsonPage />,
        hash_generator: <HashGeneratorPage />,
        regex_tester: <RegexTesterPage />,
        cron_expression_builder: <CronExpressionBuilderPage />,
        jwt_decoder: <JwtDecoderPage />,
    },
    document: {
        word_to_pdf: <WordToPdfPage />,
        pdf_merge: <PdfMergePage />,
        pdf_split: <PdfSplitPage />,
        pdf_add_text_watermark: <PdfTextWaterMarkPage />,
        pdf_add_image_watermark: <PdfImageWatermarkPage />,
        pdf_metadata_updater: <PdfMetadataUpdaterPage />,
    },
    image: {
        image_resize_convert_format: <ImageResizeConvertFormatPage />,
        image_to_pdf: <ImageToPdfPage />,
        image_transform: <ImageTransformPage />,
    },
    audio: {
        audio_trim_convert: <AudioTrimConvertPage />,
        audio_merge: <AudioMergePage />,
    },
    video: {
        video_trim_convert: <VideoTrimConvertPage />,
        add_subtitle_in_video: <AddSubtitleInVideo />,
    },
};
