var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('php', function() {
  return gulp.src('./src/*.php')
    .pipe(gulp.dest('./build'))
    .pipe(browserSync.reload({stream:true}));
});
