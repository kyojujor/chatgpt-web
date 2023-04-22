<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NDropdown } from 'naive-ui'
import AvatarComponent from './Avatar.vue'
import TextComponent from './Text.vue'
import { SvgIcon } from '@/components/common'
import { copyText } from '@/utils/format'
import { useIconRender } from '@/hooks/useIconRender'
import { t } from '@/locales'
import { useBasicLayout } from '@/hooks/useBasicLayout'
import { generateUrl } from '@/api'

interface Props {
  dateTime?: string
  text?: string
  // true：response false:prompt
  inversion?: boolean
  error?: boolean
  loading?: boolean
}

interface Emit {
  (ev: 'regenerate'): void
  (ev: 'delete'): void
}

const props = defineProps<Props>()

/**
 * 在组件实例上注册自定义事件：通过调用defineEmits方法并传入事件名称数组，将这些事件名称注册到组件实例上，使得组件内部可以通过$emit方法触发这些事件。
为类型检查提供支持：通过在目标组件类型上使用emits关键字声明自定义事件名称数组，可以为类型检查器提供更多的信息和支持。
 */
const emit = defineEmits<Emit>()

const { isMobile } = useBasicLayout()

const { iconRender } = useIconRender()

const textRef = ref<HTMLElement>()
/** 在Vue 3中，props是非响应式的数据，它们的变化不会自动触发组件重新渲染。而在模板或JavaScript代码中对props进行修改也是不被允许的。

如果我们需要在组件内部对props进行操作或者监听它们的变化，就需要将它们转化为响应式的数据。ref()函数可以帮助我们将一个普通的值转换为响应式的数据，以便在组件内部进行操作和访问，同时也能够正确地将它们传递给其他组件或函数。

因此，在这个例子中，我们使用ref()函数将props.inversion转换为一个响应式对象，并将其存储在一个ref变量中，以便在组件内部进行操作和访问。这样，在外部再次更新props时，组件也能够正确地反映出这些变化。 */
const asRawText = ref(props.inversion)

const messageRef = ref<HTMLElement>()

const options = computed(() => {
  const common = [
    {
      label: t('chat.copy'),
      key: 'copyText',
      icon: iconRender({ icon: 'ri:file-copy-2-line' }),
    },
    {
      label: t('common.delete'),
      key: 'delete',
      icon: iconRender({ icon: 'ri:delete-bin-line' }),
    },
  ]

  if (!props.inversion) {
    common.unshift({
      label: asRawText.value ? t('chat.preview') : t('chat.showRawText'),
      key: 'toggleRenderType',
      icon: iconRender({ icon: asRawText.value ? 'ic:outline-code-off' : 'ic:outline-code' }),
    })
  }

  return common
})

function handleSelect(key: 'copyText' | 'delete' | 'toggleRenderType') {
  switch (key) {
    case 'copyText':
      copyText({ text: props.text ?? '' })
      return
    case 'toggleRenderType':
      asRawText.value = !asRawText.value
      return
    case 'delete':
      emit('delete')
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView()
  emit('regenerate')
}

// function isEnglishOrPunctuation(str: string | undefined): boolean {
//   if (!str)
//     return false // 如果输入字符串为空，则直接返回 false
//   const pattern = /^[a-zA-Z,\.\?!]+$/
//   return pattern.test(str)
// }

function playClick() {
  playAudio()
}

function playAudio(): void {
  if (!props.text)
    return

  const audioPath = generateUrl(props.text)
  const audio = new Audio(audioPath)
  audio.play()
}
</script>

<template>
  <div
    ref="messageRef"
    class="flex w-full mb-6 overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion }]"
  >
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex items-end gap-1 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-col">
          <button
            v-if="!inversion"
            class="mb-2 transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-300"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button>
          <!-- 由于handleSelect方法是在@select事件触发时被调用的，因此它可以直接访问该事件的参数，而不需要显式地接收该参数 -->
          <NDropdown
            :trigger="isMobile ? 'click' : 'hover'"
            :placement="!inversion ? 'right' : 'left'"
            :options="options"
            @select="handleSelect"
          >
            <button class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200">
              <SvgIcon icon="ri:more-2-fill" />
            </button>
          </NDropdown>
        </div>
      </div>
      <!-- 播放按钮 仅出现在输出侧  -->
      <button
        v-if="!inversion && !loading"
        class="transition text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200"
        @click="playClick"
      >
        <SvgIcon icon="material-symbols:play-circle-rounded" :width="34" :height="34" />
      </button>
    </div>
  </div>
</template>
