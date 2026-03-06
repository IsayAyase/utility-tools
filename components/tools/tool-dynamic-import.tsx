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
        "url-encoder-decoder": <UrlEncoderDecoderPage />,
        "base64-encoder-decoder": <Base64EncoderDecoderPage />,
        "uuid-generator": <UuidGeneratorPage />,
        "lorem-ipsum-generator": <LoremIpsumGeneratorPage />,
        "json-to-csv": <JsonToCsvPage />,
        "csv-to-json": <CsvToJsonPage />,
        "yaml-to-json": <YamlToJsonPage />,
        "hash-generator": <HashGeneratorPage />,
        "regex-tester": <RegexTesterPage />,
        "cron-expression-builder": <CronExpressionBuilderPage />,
        "jwt-decoder": <JwtDecoderPage />,
    },
    document: {
        "word-to-pdf": <WordToPdfPage />,
        "pdf-merge": <PdfMergePage />,
        "pdf-split": <PdfSplitPage />,
        "pdf-add-text-watermark": <PdfTextWaterMarkPage />,
        "pdf-add-image-watermark": <PdfImageWatermarkPage />,
        "pdf-metadata-updater": <PdfMetadataUpdaterPage />,
    },
    image: {
        "image-resize-convert-format": <ImageResizeConvertFormatPage />,
        "image-to-pdf": <ImageToPdfPage />,
        "image-transform": <ImageTransformPage />,
    },
    audio: {
        "audio-trim-convert": <AudioTrimConvertPage />,
        "audio-merge": <AudioMergePage />,
    },
    video: {
        "video-trim-convert": <VideoTrimConvertPage />,
        "add-subtitle-in-video": <AddSubtitleInVideo />,
    },
};
