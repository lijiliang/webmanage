var d = new Date();
console.log(d.getDate())
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var paths = {
  scripts: {
    source : '../src/js/**/*.js',
    release: '../release/js'
  },
  css : {
    source : '../src/css/**/*.css',
    release : '../release/css'
  },
  html : {
    source : '../src/html/**/*.html',
    release : '../release/html'
  }
};
process.on('uncaughtException', function(err) {
    console.log(err);
})
var aaa = 'asdfas';
/*
 * 文件压缩
 */
gulp.task('move', function() {
  gulp.src(paths.scripts.source)
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.release));
});
var b = 'asdfasd'; 
