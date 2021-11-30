import path from 'path'
import type { CompilerOptions } from '@vue/compiler-core'
import {
  COMPONENT_CUSTOM_HIDDEN_BIND,
  MiniProgramCompilerOptions,
  transformComponentLink,
  transformMatchMedia,
  transformRef,
} from '@dcloudio/uni-cli-shared'
import { UniMiniProgramPluginOptions } from '@dcloudio/uni-mp-vite'

import source from './project.config.json'
import { transformSwiper } from './transforms/transformSwiper'

const projectConfigFilename = 'project.config.json'

const nodeTransforms = [
  transformRef,
  transformSwiper,
  transformMatchMedia,
  transformComponentLink,
]

export const compilerOptions: CompilerOptions = {
  nodeTransforms,
}
export const miniProgram: MiniProgramCompilerOptions = {
  class: {
    array: false,
  },
  slot: {
    fallbackContent: true,
    dynamicSlotNames: true,
  },
  directive: 'tt:',
  component: {
    vShow: COMPONENT_CUSTOM_HIDDEN_BIND,
  },
}

export const options: UniMiniProgramPluginOptions = {
  vite: {
    inject: {
      uni: [path.resolve(__dirname, 'uni.api.esm.js'), 'default'],
    },
    alias: {
      'uni-mp-runtime': path.resolve(__dirname, 'uni.mp.esm.js'),
    },
    copyOptions: {
      assets: ['ttcomponents'],
    },
  },
  global: 'tt',
  app: {
    darkmode: false,
    subpackages: true,
  },
  project: {
    filename: projectConfigFilename,
    source,
  },
  template: {
    /* eslint-disable no-restricted-syntax */
    ...miniProgram,
    filter: {
      extname: '.sjs',
      lang: 'sjs',
      generate(filter, filename) {
        if (filename) {
          return `<sjs src="${filename}.sjs" module="${filter.name}"/>`
        }
        return `<sjs module="${filter.name}">
${filter.code}
</sjs>`
      },
    },
    extname: '.ttml',
    compilerOptions,
  },
  style: {
    extname: '.ttss',
  },
}