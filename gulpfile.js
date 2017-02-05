var gulp = require('gulp');

var sass = require('gulp-sass');
var bs = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var eol = require('gulp-eol');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

gulp.task('sass', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(bs.reload({
            stream: true
        }));
});

gulp.task('watch', function() {
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

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(gif|jpg|jpeg|png|svg)')
        .pipe(cache(imagemin({
            optimizationLevel: 7
        }))
        .pipe(gulp.dest('dist/images')))
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function () {
   return del.sync(['dist', 'app/css']); 
});

gulp.task('default', function () {
    runSequence('bs', 'sass', 'watch');
});

gulp.task('build', function () {
    runSequence('clean:dist', 'sass', ['useref', 'images', 'fonts'], 
        function() {
            console.log('We are ready for production!')
        }
    );
});

