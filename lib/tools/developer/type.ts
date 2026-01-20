export interface UrlEncoderDecoderInput {
  text: string
  mode?: 'encode' | 'decode'
}

export interface Base64EncoderDecoderInput {
  data: string | Uint8Array
  mode?: 'encode' | 'decode'
}

export interface UuidGeneratorInput {
  version?: 4
}

export interface SlugGeneratorInput {
  text: string
  lowercase?: boolean
  strict?: boolean
  replacement?: string
}

export interface LoremIpsumGeneratorInput {
  count?: number
  units?: 'words' | 'sentences' | 'paragraphs'
  startWithLorem?: boolean
}

export interface JsonToCsvInput {
  data: Record<string, unknown>[]
  delimiter?: string
  headers?: string[]
}

export interface CsvToJsonInput {
  data: string
  delimiter?: string
  header?: boolean
  parseNumbers?: boolean
}

export interface YamlToJsonInput {
  data: string
  safeLoad?: boolean
}

export interface HashGeneratorSha256Input {
  data: string | Uint8Array
  encoding?: 'hex' | 'base64'
  algorithm?: 'SHA-256' | 'SHA-384' | 'SHA-512'
}

export interface RegexTesterInput {
  pattern: string
  flags?: string
  testString: string
  replaceString?: string
}

export interface CronExpressionBuilderInput {
  expression: string
  interval?: number
}

export interface JwtDecoderInput {
  token: string
  complete?: boolean
}

export interface MarkdownPreviewerInput {
  markdown: string
  options?: {
    gfm?: boolean
    breaks?: boolean
  }
}

export interface RegexTesterResult {
  matches: RegExpExecArray[]
  matchCount: number
  replaced?: string
}

export interface CronExpressionResult {
  nextRuns: string[]
  humanReadable: string
}

export interface JwtDecoderResult {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature?: string
}
