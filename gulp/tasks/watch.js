var gulp = require('gulp');

gulp.task('watch', function() {
  gulp.watch('src/**/*.html',  ['fileinclude']);
  gulp.watch('src/**/*.php',  ['php']);
  gulp.watch('src/assets/javascripts/**', ['scripts']);
  gulp.watch('src/assets/stylesheets/**', ['styles']);
  gulp.watch('src/assets/images/**', ['images']);
});
