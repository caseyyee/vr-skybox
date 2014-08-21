var gulp = require('gulp');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var gutil = require('gulp-util');

gulp.task('scripts', function() {
  gulp.src(['src/scripts/**/*.js'])
    .pipe(gulp.dest('build/js'));
});

gulp.task('styles', function() {
  gulp.src(['src/sass/**/*.scss'])
    .pipe(sass().on('error', function(err){
        gutil.log(gutil.colors.red('Error in SASS syntax'));
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
  gulp.run('scripts', 'styles', 'content', 'images');

  gulp.watch('src/sass/**', function(event) {
    gulp.run('styles');
  });
  gulp.watch('src/jade/**', function(event) {
    gulp.run('content');
  });

});