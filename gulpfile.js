// Require Gulp 
var gulp = require('gulp')

// Require Gulp's plugins.
var connect = require('gulp-connect');
var jade = require('gulp-jade');
var image = require('gulp-image');
var browserSync = require('browser-sync'),
	// this will live-reload the browser upon updates to either html or css files
	reload = browserSync.reload


// HTML Tasks: takes all Jade files in path, converts them to html and places into /dist folder. live reload is being used.
gulp.task('jade', function() {
    return gulp.src(['views/**/*.jade', '!views/**/index.jade'])
        .pipe(jade()) 
        .pipe(gulp.dest('./dist/views')) 
        .pipe(reload({stream:true}));
});

gulp.task('home', function() {
    return gulp.src('views/**/index.jade')
        .pipe(jade()) 
        .pipe(gulp.dest('./dist')) 
        .pipe(reload({stream:true}));
});


// Image Tasks: 
gulp.task('image', function () {
  gulp.src(['client/images/*.svg', 'client/images/*.png', 'client/images/*.jpg' ])
    .pipe(image())
    .pipe(gulp.dest('./dist/images'));
});

// Scripts Tasks: takes all JS files in path and places into dist/js folder. live reload is being used. 
gulp.task('scripts', function() {
	gulp.src('./**/*.js')
	.pipe(gulp.dest('./dist/js'))
	.pipe(reload({stream:true}));
});


// CSS Tasks: takes all CSS files in path and places into dist/css folder. live reload is being used.
gulp.task('css', function() {
	return gulp.src('client/css/**/*.css')
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream:true}));
});

// Fire up production server 
gulp.task('serveprod', function() {
  return connect.server({
    root: ['_public'],
    port: process.env.PORT || 8000, // localhost:5000
    livereload: false
  });
});

// Watch Tasks: Watch is our build task. initiates all other tasks, then initiates browserSync. 
gulp.task('watch', ['jade', 'home', 'css', 'image', 'scripts', 'serveprod']);


