import { ToolResult } from "@/lib/tools/types";
import type {
  Base64EncoderDecoderInput,
  CronExpressionBuilderInput,
  CronExpressionResult,
  CsvToJsonInput,
  HashGeneratorSha256Input,
  JsonToCsvInput,
  JwtDecoderInput,
  JwtDecoderResult,
  LoremIpsumGeneratorInput,
  MarkdownPreviewerInput,
  RegexTesterInput,
  RegexTesterResult,
  SlugGeneratorInput,
  UrlEncoderDecoderInput,
  YamlToJsonInput
} from './type';

export async function urlEncoderDecoder(input: UrlEncoderDecoderInput): Promise<ToolResult<string>> {
  try {
    const result = input.mode === 'decode' 
      ? decodeURIComponent(input.text)
      : encodeURIComponent(input.text)
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to encode/decode URL'
    }
  }
}

export async function base64EncoderDecoder(input: Base64EncoderDecoderInput): Promise<ToolResult<string>> {
  try {
    if (input.mode === 'decode') {
      if (typeof input.data === 'string') {
        const binary = atob(input.data)
        const bytes = new Uint8Array(binary.length)
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i)
        }
        return {
          success: true,
          data: new TextDecoder().decode(bytes)
        }
      }
      return { success: false, error: 'Cannot decode buffer to string' }
    }
    
    const str = typeof input.data === 'string' ? input.data : new TextDecoder().decode(input.data)
    return {
      success: true,
      data: btoa(str)
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to encode/decode base64'
    }
  }
}

export function uuidGenerator(): ToolResult<string> {
  try {
    return {
      success: true,
      data: crypto.randomUUID()
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate UUID'
    }
  }
}

export function slugGenerator(input: SlugGeneratorInput): ToolResult<string> {
  try {
    let text = input.text
    
    if (input.lowercase !== false) {
      text = text.toLowerCase()
    }
    
    text = text.trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    if (input.replacement) {
      text = text.replace(/[^\w\s-]/g, input.replacement)
    }
    
    return {
      success: true,
      data: text
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate slug'
    }
  }
}

export function loremIpsumGenerator(input?: LoremIpsumGeneratorInput): ToolResult<string> {
  try {
    const count = input?.count || 5
    const units = input?.units || 'words'
    const startWithLorem = input?.startWithLorem !== false
    
    const words = [
      'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
      'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
      'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
      'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
      'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
      'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
      'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
      'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
      'est', 'laborum'
    ]
    
    let result = ''
    
    if (units === 'words') {
      for (let i = 0; i < count; i++) {
        result += (i > 0 ? ' ' : '') + words[Math.floor(Math.random() * words.length)]
      }
    } else if (units === 'sentences') {
      for (let s = 0; s < count; s++) {
        const sentenceLength = Math.floor(Math.random() * 8) + 5
        let sentence = ''
        for (let i = 0; i < sentenceLength; i++) {
          sentence += (i > 0 ? ' ' : '') + words[Math.floor(Math.random() * words.length)]
        }
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
        result += (s > 0 ? ' ' : '') + sentence
      }
    } else {
      const sentencesPerParagraph = Math.floor(Math.random() * 3) + 3
      for (let p = 0; p < count; p++) {
        let paragraph = ''
        for (let s = 0; s < sentencesPerParagraph; s++) {
          const sentenceLength = Math.floor(Math.random() * 8) + 5
          let sentence = ''
          for (let i = 0; i < sentenceLength; i++) {
            sentence += (i > 0 ? ' ' : '') + words[Math.floor(Math.random() * words.length)]
          }
          sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.'
          paragraph += (s > 0 ? ' ' : '') + sentence
        }
        result += (p > 0 ? '\n\n' : '') + (startWithLorem && p === 0 ? 'Lorem ipsum dolor sit amet. ' : '') + paragraph
      }
    }
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate lorem ipsum'
    }
  }
}

export function jsonToCsv(input: JsonToCsvInput): ToolResult<string> {
  try {
    const delimiter = input.delimiter || ','
    const data = input.data
    
    if (!Array.isArray(data) || data.length === 0) {
      return { success: true, data: '' }
    }
    
    const headers = input.headers || Object.keys(data[0])
    const csvRows: string[] = []
    
    csvRows.push(headers.join(delimiter))
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header]
        const stringValue = String(value ?? '')
        const needsQuotes = stringValue.includes(delimiter) || stringValue.includes('"') || stringValue.includes('\n')
        if (needsQuotes) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      csvRows.push(values.join(delimiter))
    }
    
    return {
      success: true,
      data: csvRows.join('\n')
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert JSON to CSV'
    }
  }
}

export function csvToJson(input: CsvToJsonInput): ToolResult<Record<string, unknown>[]> {
  try {
    const delimiter = input.delimiter || ','
    const lines = input.data.trim().split('\n')
    
    if (lines.length === 0) {
      return { success: true, data: [] }
    }
    
    const hasHeader = input.header !== false
    const startIndex = hasHeader ? 1 : 0
    const headers = hasHeader 
      ? parseCSVLine(lines[0], delimiter)
      : lines[0].split(delimiter).map((_, i) => `column${i + 1}`)
    
    const result: Record<string, unknown>[] = []
    
    for (let i = startIndex; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter)
      const row: Record<string, unknown> = {}
      headers.forEach((header, index) => {
        let value: unknown = values[index] || ''
        if (input.parseNumbers && !isNaN(Number(value))) {
          value = Number(value)
        }
        row[header] = value
      })
      result.push(row)
    }
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert CSV to JSON'
    }
  }
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

export async function yamlToJson(input: YamlToJsonInput): Promise<ToolResult<Record<string, unknown>>> {
  try {
    const { load } = await import('js-yaml')
    const result = load(input.data) as Record<string, unknown>
    
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert YAML to JSON'
    }
  }
}

export async function hashGeneratorSha256(input: HashGeneratorSha256Input): Promise<ToolResult<string>> {
  try {
    const encoder = new TextEncoder()
    const data = typeof input.data === 'string' 
      ? encoder.encode(input.data)
      : input.data.slice(0)
    
    const hashBuffer = await crypto.subtle.digest(
      input.algorithm || 'SHA-256',
      data.buffer as ArrayBuffer
    )
    const hashArray = new Uint8Array(hashBuffer)
    
    const hashHex = Array.from(hashArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    if (input.encoding === 'base64') {
      const base64 = btoa(String.fromCharCode(...hashArray))
      return { success: true, data: base64 }
    }
    
    return {
      success: true,
      data: hashHex
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate hash'
    }
  }
}

export function regexTester(input: RegexTesterInput): ToolResult<RegexTesterResult> {
  try {
    const regex = new RegExp(input.pattern, input.flags || 'g')
    const matches: RegExpExecArray[] = []
    let match: RegExpExecArray | null
    
    while ((match = regex.exec(input.testString)) !== null) {
      matches.push(match)
      if (!regex.flags.includes('g')) break
    }
    
    let replaced: string | undefined
    if (input.replaceString !== undefined) {
      replaced = input.testString.replace(regex, input.replaceString)
    }
    
    return {
      success: true,
      data: {
        matches,
        matchCount: matches.length,
        replaced
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to test regex'
    }
  }
}

export function cronExpressionBuilder(input: CronExpressionBuilderInput): ToolResult<CronExpressionResult> {
  try {
    const parts = input.expression.split(/\s+/)
    
    if (parts.length < 5 || parts.length > 6) {
      return { success: false, error: 'Invalid cron expression. Expected 5 or 6 fields.' }
    }
    
    const [minute, hour, dayOfMonth, month, dayOfWeek = '*'] = parts
    
    const now = new Date()
    const nextRuns: string[] = []
    
    for (let i = 0; i < (input.interval || 5); i++) {
      const next = new Date(now)
      next.setMinutes(next.getMinutes() + i + 1)
      next.setSeconds(0)
      next.setMilliseconds(0)
      
      let valid = true
      valid = valid && matchCronField(minute, next.getMinutes(), 0, 59)
      valid = valid && matchCronField(hour, next.getHours(), 0, 23)
      valid = valid && matchCronField(dayOfMonth, next.getDate(), 1, 31)
      valid = valid && matchCronField(month, next.getMonth() + 1, 1, 12)
      valid = valid && matchCronField(dayOfWeek, next.getDay(), 0, 6)
      
      if (valid) {
        nextRuns.push(next.toISOString())
      }
    }
    
    const humanReadable = `At ${minute} minutes, ${hour} hours, ${dayOfMonth} day of month, ${month} month, ${dayOfWeek} day of week`
    
    return {
      success: true,
      data: {
        nextRuns,
        humanReadable
      }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse cron expression'
    }
  }
}

function matchCronField(field: string, value: number, min: number, max: number): boolean {
  if (field === '*' || field === '?') return true
  
  if (field.includes('/')) {
    const [, step] = field.split('/')
    const stepNum = parseInt(step, 10)
    return value % stepNum === 0
  }
  
  if (field.includes('-')) {
    const [start, end] = field.split('-').map(Number)
    return value >= start && value <= end
  }
  
  if (field.includes(',')) {
    const values = field.split(',').map(Number)
    return values.includes(value)
  }
  
  return parseInt(field, 10) === value
}

export function jwtDecoder(input: JwtDecoderInput): ToolResult<JwtDecoderResult> {
  try {
    const parts = input.token.split('.')
    
    if (parts.length !== 3) {
      return { success: false, error: 'Invalid JWT format' }
    }
    
    const decodeBase64 = (str: string): Record<string, unknown> => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
      const json = atob(base64)
      return JSON.parse(json)
    }
    
    const header = decodeBase64(parts[0]) as Record<string, unknown>
    const payload = decodeBase64(parts[1]) as Record<string, unknown>
    const signature = input.complete ? parts[2] : undefined
    
    return {
      success: true,
      data: { header, payload, signature }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to decode JWT'
    }
  }
}

export async function markdownPreviewer(input: MarkdownPreviewerInput): Promise<ToolResult<string>> {
  try {
    const { marked } = await import('marked')
    
    const options = input.options || {}
    const html = marked(input.markdown, {
      gfm: options.gfm !== false,
      breaks: options.breaks || false
    })
    
    return {
      success: true,
      data: html as string
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert markdown'
    }
  }
}
