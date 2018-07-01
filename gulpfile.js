const gulp = require('gulp');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec;

gulp.task('nodemon', done => {
  nodemon({
    script: './build/server.js',
    ext: 'js handlebars css',
    env: { NODE_ENV: 'development' },
    ignore: 'test gulpfile.js node_modules',
    done: done
  })
    .on('restart', () => {
      console.log('Restarting the server.');
    })
    .on('crash', () => {
      console.log('There was a crash...');
    });
});

gulp.task('sass', () => {
  return gulp
    .src('./public/style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/style'));
});

gulp.task('sass:watch', () => {
  gulp.watch('./public/style/*.scss', gulp.task('sass'));
});

/* gulp.task('test', () => {
  return exec('nyc --reporter=html --reporter=text mocha --exit');
});

gulp.task('cover', () => {
  return exec('.\\coverage\\index.html');
});

gulp.task('test:watch', () => {
  gulp.watch(['./build/**//*.js'], gulp.series(['test', 'cover']));
}); */

gulp.task('default', gulp.parallel('nodemon', 'sass:watch'));
