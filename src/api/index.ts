import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { useAuthStore, useSettingStore } from '@/store'

export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

/**
 * Sends a request to the chat API to process a prompt.
 * @param params - An object containing the prompt, options, signal, and onDownloadProgress.
 * @param params.prompt - The prompt to process.
 * @param params.options - An optional object containing conversationId and parentMessageId.
 * @param params.signal - An optional AbortSignal to cancel the request.
 * @param params.onDownloadProgress - An optional function to track download progress.
 * @returns A Promise that resolves to the response data.
 */
export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

/**
 * 生成一个用于使用搜狗翻译 API 合成语音的 URL。
 *
 * @param text - 待合成的文本。
 * @returns 合成音频的 URL。
 */
function generateUrl(text: string): string {
  /** text 要转换的文本
      speed 语速 1~？（我测试到15都还可以） 越大，语速越慢
      lan 语言类型
      lan=en 英文
      lan = zh-CHS 中文
      from 没搞明白 （我猜应该是获取你是从哪里请求的，哪种方式请求的）
      speaker 语音类型 1-6的数字
      2 是小女孩
      */
  const baseUrl = 'https://fanyi.sogou.com/reventondc/synthesis'
  const speed = '1'
  const lang = 'en'
  const from = 'translateweb'
  const speaker = '3'
  const encodedText = encodeURIComponent(text)
  const url = `${baseUrl}?text=${encodedText}&speed=${speed}&lang=${lang}&from=${from}&speaker=${speaker}`
  return url
}

/**
 * Speak the given text using the browser's speech synthesis API if available.
 * If not, generate a URL using Sogou and play the resulting audio.
 * @param text The text to speak.
 */
export function speak(text: string) {
  try {
    // if (!speakFromBrowser(text)) {
    //   console.log('speechSynthesis2')
    //   const url = generateUrl(text)
    //   const audio = new Audio(url)
    //   audio.play()
    // }
    const url = generateUrl(text)
    const audio = new Audio(url)
    audio.play()
  }
  catch (error) {
    console.error(error)
  }
}

export function speakFromBrowser(text: string | undefined) {
  if ('speechSynthesis' in window) {
    // eslint-disable-next-line no-console
    console.log('speechSynthesis')
    const utterance = new SpeechSynthesisUtterance(text)
    speechSynthesis.speak(utterance)
    return true
  }
  console.error('Your browser does not support Web Speech API')
  return false
}
