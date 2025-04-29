import { defineConfig, presetAttributify, presetIcons, presetWind4 } from 'unocss'

export default defineConfig({
    presets: [
        presetWind4(),
        presetAttributify(),
        presetIcons({
            prefix: ['i-'],
            extraProperties: {
                display: 'inline-block',
                'vertical-align': 'middle'
            },
            collections: {
                carbon: () =>
                    import('@iconify-json/carbon/icons.json', {
                        assert: { type: 'json' }
                    }).then((i) => i.default as any)
            }
        })
    ]
})
