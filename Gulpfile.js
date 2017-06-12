var gulp = require('gulp');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');

gulp.task('jshint', function() {
  gulp.src(['**/*.js', '!node_modules/**', '!test/**', '!benchmark/**','!browser/**','!coverage/**','!neurons-engine/**','!*.js'])
    .pipe(jshint({
      node: true
    }))
    .pipe(jshint.reporter());
});

gulp.task('pre-test', function() {
  // This tells gulp which files you want to pipe
  // In our case we want to pipe every `.js` file inside any folders inside `test`
  return gulp.src('lib/**/*.js')
    .pipe(istanbul())
    // This overwrites `require` so it returns covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function() {
  // Here we're piping our `.js` files inside the `lib` folder
  gulp.src('test/unit/**/*.js')
    // You can change the reporter if you want, try using `nyan`
    .pipe(mocha({reporter: 'spec'}))
    // Here we will create report files using the test's results
    .pipe(istanbul.writeReports())
    .once('end', function () {
      process.exit();
    });;
});


gulp.task('browserify', function() {
  browserify('./lib/engine/logic/index.js')
    .ignore('./lib/driver/serial.js')
    .bundle()
    .pipe(source('neurons_logic_engine.js'))
    .pipe(gulp.dest('./browser/'));

  browserify('./lib/engine/flow/index.js')
    .ignore('./lib/driver/serial.js')
    .bundle()
    .pipe(source('neurons_flow_engine.js'))
    .pipe(gulp.dest('./browser/'));

  browserify('./index.js')
    .ignore('./lib/driver/serial.js')
    .bundle()
    .pipe(source('./neurons_engine.js'))
    .pipe(gulp.dest('./browser/'));

});

gulp.task('compress', function() {
  gulp.src('./browser/neurons_logic_engine.js')
       .pipe(uglify())
       .pipe(gulp.dest('./browser/'));

  gulp.src('./browser/neurons_flow_engine.js')
       .pipe(uglify())
       .pipe(gulp.dest('./browser/'));

  gulp.src('./browser/neurons_engine.js')
       .pipe(uglify())
       .pipe(gulp.dest('./browser/'));

});

gulp.task('default', ['test'], function() {

});
