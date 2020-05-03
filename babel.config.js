module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['import', {
      libraryName: 'pagoda-mobile',
      libraryDirectory: 'es',
      style: true
    }, 'pagoda-mobile']
  ]
}
