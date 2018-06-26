const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');

gulp.task('nodemon', () => {
  nodemon({
    watch: ['src', 'public', 'views'],
    ignore: ['**/*.test.ts', '**/*.spec.ts', '.git', 'node_modules', 'build'],
    ext: 'ts handlebars css',
    exec: 'ts-node ./src/app/server.ts'
  })
  .on('restart', () => {
    console.log('Restarting the server.');
  })
  .on('crash', () => {
    console.log('There was a crash...');
  });
})

gulp.task('sass', () => {
  return gulp.src('./public/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/style'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./public/style/*.scss', gulp.task('sass'));
});

gulp.task('default', gulp.parallel('nodemon', 'sass:watch'));