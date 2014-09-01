var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var compass = require('gulp-compass');
var gutil = require('gulp-util');

gulp.task('scripts', function() {
  gulp.src(['src/scripts/**/*.js'])
    .pipe(gulp.dest('build/js'));
});

gulp.task('bower', function() {
  gulp.src(['bower_components/**/*.*'])
    .pipe(gulp.dest('build/bower_components'));
});

gulp.task('styles', function() {
  gulp.src(['src/sass/**/*.scss'])
    // .pipe(sass().on('error', function(err){
    //     gutil.log(gutil.colors.red('Error in SASS syntax'));
    // }))
    .pipe(compass({
      sass: 'src/sass',
      image: 'src/images'
    }))
    .pipe(gulp.dest('build/css'));
});


gulp.task('content', function() {
  gulp.src(['src/jade/**/*.jade', '!src/jade/layouts/**'])
    .pipe(jade().on('error', function(err){
        gutil.log(gutil.colors.red(err))
    }))
    .pipe(gulp.dest('build'))
});

gulp.task('images', function() {
  gulp.src(['src/images/**/*.*'])
    .pipe(gulp.dest('build/images'));
})

gulp.task('default', function() {
  gulp.run('scripts','bower', 'styles', 'content', 'images');

  gulp.watch('src/sass/**', function(event) {
    gulp.run('styles');
  });
  gulp.watch('src/jade/**', function(event) {
    gulp.run('content');
  });
  gulp.watch('src/scripts/**/*.js', function(event) {
    gulp.run('scripts');
  });

});