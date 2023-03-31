import { Config } from 'style-dictionary';

// If you need to add multiple configutations Config[] is supported
const config: Config | Config[] = [
  {
    source: ['src/tokens/brand-1/light/**/*.json'],
    platforms: {
      scss: {
        transformGroup: 'scss',
        buildPath: 'brand-1/light/scss/',
        files: [
          {
            destination: '_variables.scss',
            format: 'scss/variables',
          },
        ],
      },
      android: {
        transformGroup: 'android',
        buildPath: 'brand-1/light/android/',
        files: [
          {
            destination: 'font_dimens.xml',
            format: 'android/fontDimens',
          },
          {
            destination: 'colors.xml',
            format: 'android/colors',
          },
        ],
      },
      compose: {
        transformGroup: 'compose',
        buildPath: 'brand-1/light/compose/',
        files: [
          {
            destination: 'StyleDictionaryColor.kt',
            format: 'compose/object',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.kt',
            format: 'compose/object',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
      ios: {
        transformGroup: 'ios',
        buildPath: 'brand-1/light/ios/',
        files: [
          {
            destination: 'StyleDictionaryColor.h',
            format: 'ios/colors.h',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionaryColor.m',
            format: 'ios/colors.m',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.h',
            format: 'ios/static.h',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.m',
            format: 'ios/static.m',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
      'ios-swift': {
        transformGroup: 'ios-swift',
        buildPath: 'brand-1/light/ios-swift/',
        files: [
          {
            destination: 'StyleDictionary+Class.swift',
            format: 'ios-swift/class.swift',
            className: 'StyleDictionaryClass',
            filter: {},
          },
          {
            destination: 'StyleDictionary+Enum.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionaryEnum',
            filter: {},
          },
          {
            destination: 'StyleDictionary+Struct.swift',
            format: 'ios-swift/any.swift',
            className: 'StyleDictionaryStruct',
            filter: {},
            options: {
              imports: 'SwiftUI',
              objectType: 'struct',
              accessControl: 'internal',
            },
          },
        ],
      },
      'ios-swift-separate-enums': {
        transformGroup: 'ios-swift-separate',
        buildPath: 'brand-1/light/ios-swift/',
        files: [
          {
            destination: 'StyleDictionaryColor.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
    },
  },
  {
    source: ['src/tokens/brand-1/dark/**/*.json'],
    platforms: {
      scss: {
        transformGroup: 'scss',
        buildPath: 'brand-1/dark/scss/',
        files: [
          {
            destination: '_variables.scss',
            format: 'scss/variables',
          },
        ],
      },
      android: {
        transformGroup: 'android',
        buildPath: 'brand-1/dark/android/',
        files: [
          {
            destination: 'font_dimens.xml',
            format: 'android/fontDimens',
          },
          {
            destination: 'colors.xml',
            format: 'android/colors',
          },
        ],
      },
      compose: {
        transformGroup: 'compose',
        buildPath: 'brand-1/dark/compose/',
        files: [
          {
            destination: 'StyleDictionaryColor.kt',
            format: 'compose/object',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.kt',
            format: 'compose/object',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
      ios: {
        transformGroup: 'ios',
        buildPath: 'brand-1/dark/ios/',
        files: [
          {
            destination: 'StyleDictionaryColor.h',
            format: 'ios/colors.h',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionaryColor.m',
            format: 'ios/colors.m',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.h',
            format: 'ios/static.h',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.m',
            format: 'ios/static.m',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
      'ios-swift': {
        transformGroup: 'ios-swift',
        buildPath: 'brand-1/dark/ios-swift/',
        files: [
          {
            destination: 'StyleDictionary+Class.swift',
            format: 'ios-swift/class.swift',
            className: 'StyleDictionaryClass',
            filter: {},
          },
          {
            destination: 'StyleDictionary+Enum.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionaryEnum',
            filter: {},
          },
          {
            destination: 'StyleDictionary+Struct.swift',
            format: 'ios-swift/any.swift',
            className: 'StyleDictionaryStruct',
            filter: {},
            options: {
              imports: 'SwiftUI',
              objectType: 'struct',
              accessControl: 'internal',
            },
          },
        ],
      },
      'ios-swift-separate-enums': {
        transformGroup: 'ios-swift-separate',
        buildPath: 'brand-1/dark/ios-swift/',
        files: [
          {
            destination: 'StyleDictionaryColor.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionaryColor',
            filter: {
              attributes: {
                category: 'color',
              },
            },
          },
          {
            destination: 'StyleDictionarySize.swift',
            format: 'ios-swift/enum.swift',
            className: 'StyleDictionarySize',
            filter: {
              attributes: {
                category: 'size',
              },
            },
          },
        ],
      },
    },
  },
];

export default config;
