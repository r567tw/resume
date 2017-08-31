var gulp= require('gulp');
var jade= require('gulp-jade');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpif= require('gulp-if');
var data=require('gulp-data');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');

var env ={
    string:'env',
    default:{ env:'develop'}
}

var options = minimist(process.argv.slice(2),env)

gulp.task('jade',function(){
    gulp.src('./source/**/*.jade')
        .pipe(data(function () {
            var resume = require('./source/resume/resume.json');
            var menu=require('./source/resume/menu.json');
            var source={
                'resume':resume,
                'menu':menu
            };
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
});

gulp.task('browser-sync',function(){
    browserSync.init({
        server:{
            baseDir:"./public"
        }
    })
})

gulp.task('watch', function () {
    gulp.watch('./source/**/*.jade',['jade']);
});

gulp.task('deploy', function () {
    return gulp.src('./public/**/*')
        .pipe(ghPages());
});

gulp.task('default', ['jade','watch','scss','browser-sync']);