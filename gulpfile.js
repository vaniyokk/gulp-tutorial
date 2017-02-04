var gulp = require('gulp');
var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var useref = require('gulp-useref');

var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var eol = require('gulp-eol');

gulp.task('hello', function () {
    console.log('hello');
});

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(bs.reload({
            stream: true
        }));
});

gulp.task('watch', ['bs', 'sass'], function() {
    console.log('in WATCH');
    gulp.watch('app/scss/**/*.scss', ['sass', 'useref']);
    gulp.watch('app/*.html', function() {
        gulp.run('useref');
        bs.reload();
    });
});

gulp.task('bs', function() {
    bs.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('useref', ['sass'], function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

