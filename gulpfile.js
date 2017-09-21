var gulp= require('gulp');
var $ = require('gulp-load-plugins')();
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var mainBowerFiles=require('main-bower-files')

gulp.task('jade',function(){
    gulp.src('./source/*.jade')
        .pipe($.data(function () {
            var resume = require('./source/resume/resume.json');
            var menu=require('./source/resume/menu.json');
            var source={
                'resume':resume,
                'menu':menu
            };
            return source;
        }))
        .pipe($.jade())
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
})

gulp.task('scss', function () {
    return gulp.src('./source/scss/**/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(gulp.dest('./.tmp/css'))
        .pipe(browserSync.stream())
});

gulp.task('browser-sync',function(){
    browserSync.init({
        server:{
            baseDir:"./public"
        }
    })
})



gulp.task('deploy', function () {
    return gulp.src('./public/**/*')
        .pipe($.ghPages());
});

//先講檔案載入暫時的資料夾
gulp.task('bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./.tmp/vendors'))
});

//然後做出合併
gulp.task('vendorJs',['bower'],function(){
    return gulp.src(['./.tmp/vendors/**/*.js','./source/js/**/*.js'])
    .pipe($.order([
        'jquery.js',
        'tether.js',
        'bootstrap.js',
        'wow.js'
    ]))
    .pipe($.concat('all.js'))
    .pipe($.uglify({
        compress:{
            drop_console:true //把console.log 削掉
        }
    }))                               
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
});

gulp.task('vendorCSS',['bower'],function(){    
    return gulp.src(['./.tmp/vendors/**/*.css','./.tmp/css/**/*.css'])
    .pipe($.concat('all.css'))
    .pipe(minifyCSS())                            
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream())    
});

gulp.task('vendorFONT',['bower'],function(){
    return gulp.src("./.tmp/vendors/fontawesome-webfont.*")
                .pipe(gulp.dest('./public/fonts'))
});

//刪除資料夾
gulp.task('clean',function(){
    return gulp.src(['./.tmp','./public','./.publish'],{read:false})
        .pipe($.clean())
});

gulp.task('cleantmp',['vendorJs','vendorCSS','vendorFONT','scss'],function(){
    return gulp.src(['./.tmp'],{read:false})
        .pipe($.clean())
        .pipe(browserSync.stream())
});

gulp.task('watch', function () {
    gulp.watch('./source/**/*.jade',['jade']);
    gulp.watch('./source/**/*.scss', ['scss']);
    gulp.watch('./source/**/*.js', ['babel']);
});

gulp.task('default', ['jade','scss','vendorJs','vendorCSS','vendorFONT','cleantmp','watch','browser-sync']);