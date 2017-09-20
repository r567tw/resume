var gulp= require('gulp');
var jade= require('gulp-jade');
var browserSync = require('browser-sync').create();
var minimist = require('minimist');
var gulpif= require('gulp-if');
var data=require('gulp-data');
var ghPages = require('gulp-gh-pages');
var sass = require('gulp-sass');
var babel = require('gulp-babel');


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

gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream())

);

gulp.task('watch', function () {
    gulp.watch('./source/**/*.jade',['jade']);
    gulp.watch('./source/**/*.scss', ['scss']);
    gulp.watch('./source/**/*.js', ['babel']);
});

gulp.task('default', ['jade','watch','scss','babel','browser-sync']);