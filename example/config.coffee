exports.config =
  sourceMaps: false
  conventions:
    assets: /^example\/app\/assets\//

  paths:
    public: 'example/dist'
    watched: ['example']

  files:
    javascripts:
      joinTo:
        'js/app.js': /^example\/app/
        'js/vendor.js':  /^example\/(bower_components|vendor)/
      order:
        before: [
          'example/vendor/scripts/jquery-1.10.2.min.js', 
          'example/vendor/scripts/underscore-min.js', 
          'example/vendor/scripts/backbone-min.js',
        ]

    stylesheets:
      joinTo:
          'css/app.css': /^example\/app/
          'css/vendor.css': /^example\/(bower_components|vendor)/

    templates:
      joinTo: 'js/app.js'

  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins: autoReload: enabled: false

  modules:
    nameCleaner: (path) ->
      cleanPath = path.replace(/^example\//, '')
      cleanPath.replace(/^app\//, '')
