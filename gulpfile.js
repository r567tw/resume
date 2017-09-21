var gulp= require('gulp');
var jade= require('gulp-jade');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpif= require('gulp-if');
var data=require('gulp-data');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var mainBowerFiles=require('main-bower-files')
var concat=require('gulp-concat');
var uglify = require('gulp-uglify'); //壓縮
var order = require('gulp-order'); //壓縮


var env ={
    string:'env',
    default:{ env:'develop'}
}

var options = minimist(process.argv.slice(2),env)

gulp.task('jade',function(){
    gulp.src('./source/*.jade')
        .pipe(data(function () {
            var resume = require('./source/resume/resume.json');
            var menu=require('./source/resume/menu.json');
            var source={
                'resume':resume,
                'menu':menu
            };
            console.log(source);
            return source;
        }))
        .pipe(jade({
            pretty:true
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
})

gulp.task('scss', function () {
    return gulp.src('./source/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
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
        .pipe(ghPages());
});

//先講檔案載入暫時的資料夾
gulp.task('bower', function () {
    return gulp.src(mainBowerFiles())
        .pipe(gulp.dest('./.tmp/vendors'))
});

//然後做出合併
gulp.task('vendorJs',['bower'],function(){
    return gulp.src(['./.tmp/vendors/**/*.js','./source/js/**/*.js'])
    .pipe(order([
        'jquery.js',
        'tether.js',
        'bootstrap.js',
        'wow.js'
    ]))
    .pipe(concat('all.js'))
    .pipe(uglify({
        compress:{
            drop_console:true //把console.log 削掉
        }
    }))                               
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
});

gulp.task('vendorCSS',['bower'],function(){
    return gulp.src('./.tmp/vendors/**/*.css')
    .pipe(concat('vendor.css'))                              
    .pipe(gulp.dest('./public/css'))
});

gulp.task('watch', function () {
    gulp.watch('./source/**/*.jade',['jade']);
    gulp.watch('./source/**/*.scss', ['scss']);
    gulp.watch('./source/**/*.js', ['babel']);
});

gulp.task('default', ['jade','watch','scss','vendorJs','vendorCSS','browser-sync']);