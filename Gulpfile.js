;(function() {
  'use strict';

  /*  Dependencies  */
  var lib    = require('./lib')
  var gulp   = require('gulp');
  var $      = require('gulp-load-plugins')({lazy:true});
  var del    = require('del');

  // Load tasks for reference
  var tasks = lib.tasks

  // Default gulp behavior
  gulp
    .task('default', $.sequence('dev'));

  // Clean: removes build folder
  gulp
    .task('clean', del.bind(null, ['build']));

  /******************************************************************************
   * Develop build environment
   *****************************************************************************/

  gulp
    .task( 'dev',
      $.sequence( 'clean'
                , 'build:dev'
                , 'start:dev'
                ));

  // Build
  gulp
    .task( 'js:dev'    , tasks.js.dev     )
    .task( 'css:dev'   , tasks.css.dev    )
    .task( 'styl:dev'  , tasks.styl.dev   )
    .task( 'html:dev'  , tasks.html.dev   )
    .task( 'jade:dev'  , tasks.jade.dev   )
    .task( 'images:dev', tasks.images.dev )
    .task( 'build:dev' ,
      $.sequence( 'js:dev'
                , 'css:dev'
                , 'styl:dev'
                , 'html:dev'
                , 'jade:dev'
                , 'images:dev'
                ));

  // Start
  gulp
    .task( 'vendor:dev' , tasks.vendor.dev )
    .task( 'inject:dev' , tasks.inject.dev )
    .task( 'server:dev' , tasks.server.dev )
    .task( 'watch:dev'  , tasks.watch.dev  )
    .task( 'start:dev'  ,
      $.sequence(
                  'vendor:dev'
                , 'inject:dev'
                , 'server:dev'
                , 'watch:dev'
                ));


  /******************************************************************************
   * Staging build environment
   *****************************************************************************/

  gulp
    .task('stage',
      $.sequence('clean',
                 'build:stage',
                 'start:stage'));

  // Build

  gulp
    .task('js:stage', tasks.js.stage)
    .task('css:stage', tasks.css.stage)
    .task('styl:stage', tasks.styl.stage)
    .task('html:stage', tasks.html.stage)
    .task('jade:stage', tasks.jade.stage)
    .task('images:stage', tasks.images.stage)
    .task('build:stage',
      $.sequence('js:stage',
                 'css:stage',
                 'styl:stage',
                 'html:stage',
                 'jade:stage',
                 'images:stage'));

  // Start

  gulp
    .task('vendor:stage', tasks.vendor.stage)
    .task('inject:stage', tasks.inject.stage)
    .task('server:stage', tasks.server.stage)
    .task('watch:stage', tasks.watch.stage)
    .task('start:stage',
      $.sequence(
        'vendor:stage',
        'inject:stage',
        'server:stage',
        'watch:stage'
      ));


  /******************************************************************************
   * Production build environment
   *****************************************************************************/

  gulp
    .task('prod',
      $.sequence(
        'clean',
        'build:stage',
        'vendor:stage',
        'inject:stage'
      )
    );

  /******************************************************************************
   * Deploy process
   *****************************************************************************/

  gulp
    .task('deploy', function() {
      if (process.env.NODE_ENV === 'production') gulp.start('prod');
    });

  /******************************************************************************
   * GitHub commands
   *****************************************************************************/

  gulp
    .task('git:rebase', tasks.git.rebase)
    .task('git:push', tasks.git.push)
    .task('git:pr', $.sequence('lint', 'git:rebase', 'git:push'));

  /******************************************************************************
   * Testing suite
   *****************************************************************************/

  gulp
    .task('lint', tasks.lint)
    .task('karma', tasks.karma)
    .task('mocha', tasks.mocha)
    .task('test',
      $.sequence('lint',
                 'prod',
                 'karma',
                 'mocha')
    );

  /**
   * coveralls
   * =========
   * Sends code coverage data to Coveralls.
   */
  gulp.task('coveralls', tasks.coveralls);

})();
