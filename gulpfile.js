/**
 * gulp
 */
const gulp = require('gulp');
const watch = require('gulp-watch');
const less = require('gulp-less');
const cssmin = require('gulp-minify-css');
const concat = require('gulp-concat');                 // 连接插件
const uglify = require('gulp-uglify');                 // 压缩js文件
const imagemin = require('gulp-imagemin');             //图片压缩
const pngquant = require('imagemin-pngquant');         // 深度压缩png图片
const rev = require('gulp-rev');                       // 对文件名加MD5后缀
const autoprefixer = require('gulp-autoprefixer');     // 自动添加css3前缀
const rename = require('gulp-rename');                 // 文件合并
const cache = require('gulp-cache');                   // 缓存，只对修改的内容进行处理
const fileinclude = require('gulp-file-include');     // 合并按模块引入html文件


const srcDir = 'src';
const distDir = 'dist';

// html
const _htmlSrcPath = srcDir+'/html/';
const _htmlDistPath = distDir + '/html';   // dist文件输出html
const _htmlFile = [
    _htmlSrcPath + '*.html',
    _htmlSrcPath + '**/*.html',
    `!${_htmlSrcPath}/**/_*/*.html`,
    `!${_htmlSrcPath}/**/_*/**/*.html`,
    `!${_htmlSrcPath}/**/_*.html`
]

/**
 * 编译html
*/
gulp.task('html:build', ()=>{
    gulp.src(_htmlFile)
    .pipe(fileinclude('@@'))
    .pipe(gulp.dest(_htmlDistPath))
    .on('end', ()=>{
        console.log('html 编译完成！');
    });
});

// css
const _cssSrcPath = srcDir+'/less/';
const _cssDistPath = distDir + '/css';   // dist文件输出css
const _cssFile = [
    _cssSrcPath + '*.less',
    _cssSrcPath + '**/*.less',
    `!${_cssSrcPath}/**/_*/*.less`,
    `!${_cssSrcPath}/**/_*/**/*.less`,
    `!${_cssSrcPath}/**/_*.less`
]

//js
const _jsSrcPath = srcDir + '/js/';
const _jsDistPath = distDir + '/js';
const _jsFile = [
    _jsSrcPath + '*.js'
]


/**
 * 编译less
*/
gulp.task('css:dev', ()=>{
    gulp.src(_cssFile)
    .pipe(less())
    .pipe(autoprefixer({
        browsers: ['last 6 versions']
    }))
    .pipe(cssmin())
    .pipe(gulp.dest(_cssDistPath))
    .on('end', ()=>{
        console.log('css 编译完成！')
    })
})

/**
 * 压缩js
 */
gulp.task('js:dev', ()=>{
    gulp.src(_jsFile)
    .pipe(gulp.dest(_jsDistPath))   //输出一个未压缩版本
    .pipe(uglify())
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(_jsDistPath))
    .on('end', ()=>{
        console.log('js 编译完成！')
    })
})

/* 图片压缩 */
gulp.task('image:min', ()=>{
    gulp.src(srcDir + '/img/**/*.{png,jpg,gif,ico}')
    .pipe(cache(imagemin({
        optimizationLevel: 7, //类型：Number  默认：3  取值范围：0-7（优化等级）
        progressive: true,  //类型：Boolean 默认：false 无损压缩jpg图片
        svgoPlugins: [{removeViewBox: false}],//不要移除svg的viewbox属性
        use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件,不过好像没有什么效果
    })))
    .pipe(gulp.dest(distDir + '/img'))
})

gulp.task('dev:watch',()=>{
    // watch html
    watch(_htmlFile,{event:['add','change','unlink']},(file)=>{
        console.log(file.path + ' complite！');
    })
    .pipe(fileinclude('@@'))
    .pipe(gulp.dest(_htmlDistPath));

    // watch less css
    watch(_cssFile, {event:['add','change','unlink']}, (file)=>{
        console.log(file.path + ' complite！');
    })
    // .pipe(sourcemaps.init())
    // .pipe(plumber())
    .pipe(less())
    .pipe(cssmin())
    // .pipe(sourcemaps.write('./'))  //'../map'
    .pipe(gulp.dest(_cssDistPath));

    // watch js
    watch(_jsFile, {event: ['add', 'change','unlink']}, (file)=>{
        console.log(file.path + ' complite! ');
    })
    .pipe(gulp.dest(_jsDistPath))
    .pipe(uglify({
        mangle: true,
        compress: true,//类型：Boolean 默认：true 是否完全压缩
    }))
    .pipe(rename({extname: '.min.js'}))
    .pipe(gulp.dest(_jsDistPath))

})

/*dev环境编译执行*/
gulp.task('dev', ['html:build', 'css:dev','js:dev','image:min','dev:watch'])
