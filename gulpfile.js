var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var mainBowerFiles = require('main-bower-files')
const { src, pipe, series, dest, task } = require('gulp');



function jade() {
    return src('./source/index.jade')
        .pipe($.data(function () {
            var resume = require('./resume/resume.json');
            var nav = require("./resume/nav.json")

            // var nav = []
            // Object.keys(navData).map(key => nav[key] = navData.key)
            // console.log(nav)

            var source = {
                'resume': resume,
                'nav': nav
            };
            return source;
        }))
        .pipe($.jade())
        .pipe(dest('./public/'))
        .pipe(browserSync.stream())
}

task('jade', jade);

function scss() {
    return src('./source/scss/**/*.scss')
        .pipe($.sass().on('error', $.sass.logError))
        .pipe(dest('./.tmp/css'))
        .pipe(browserSync.stream())
}

task('scss', scss);

function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    })
    done();
}

task('browser', browser)

// gulp.task('deploy', function () {
//     return gulp.src('./public/**/*')
//         .pipe($.ghPages());
// });

// //先講檔案載入暫時的資料夾
function bower() {
    return src(mainBowerFiles())
        .pipe(dest('./.tmp/vendors'))
}

task('bower', bower)

// //然後做出合併
function venderjs() {
    return src(['./.tmp/vendors/**/*.js', './source/js/**/*.js'])
        .pipe($.order([
            'jquery.js',
            'tether.js',
            'bootstrap.js',
            'wow.js',
            'particles.min.js'
        ]))
        .pipe($.concat('all.js'))
        .pipe($.uglify({
            compress: {
                drop_console: true //把console.log 削掉
            }
        }))
        .pipe(dest('./public/js'))
        .pipe(browserSync.stream())
}

task('venderjs', series(bower, venderjs))

function venderCSS() {
    return src(['./.tmp/vendors/**/*.css', './.tmp/css/**/*.css'])
        .pipe($.concat('all.css'))
        .pipe(minifyCSS())
        .pipe(dest('./public/css'))
        .pipe(browserSync.stream())
}

task('venderCSS', series(bower, venderCSS))

function venderFONT() {
    return src("./.tmp/vendors/fontawesome-webfont.*")
        .pipe(dest('./public/fonts'))
}

task('venderFONT', series(bower, venderFONT))

// //刪除資料夾
function clean() {
    return src(['./.tmp', './public', './.publish'], { read: false, allowEmpty: true })
        .pipe($.clean())
}

task('clean', clean)

function cleantmp() {
    return src(['./.tmp'], { read: false, allowEmpty: true })
        .pipe($.clean())
        .pipe(browserSync.stream())
}

task(cleantmp, series(venderjs, venderCSS, venderFONT, cleantmp))

function watch() {
    watch(['./source/**/*.jade'], series(jade));
    // watch(['./source/resume/*.json'], series(jade));
    // watch(['./source/**/*.scss'], series(scss));
}

task('watch', watch);


task('dev', series(bower, jade, scss, venderjs, venderCSS, venderFONT, cleantmp,
    function (done) {
        browserSync.init({
            server: {
                baseDir: "./public",
                reloadDebounce: 2000
            }
        })
        gulp.watch(['./source/**/*.jade'], series(jade));
        gulp.watch(['./source/resume/*.json'], series(jade));
        gulp.watch(['./source/**/*.scss'], series(scss));
        done();
    }
)
);

task('default', series(bower, jade, scss, venderjs, venderCSS, venderFONT, cleantmp));