// Require Gulp 
var gulp = require('gulp')

// Require Gulp's plugins.
var jade = require('gulp-jade')
var image = require('gulp-image')
var browserSync = require('browser-sync'),
	// this will live-reload the browser upon updates to either html or css files
	reload = browserSync.reload



// HTML Tasks: takes all Jade files in path, converts them to html and places into /dist folder. live reload is being used.
gulp.task('jade', function() {
    return gulp.src('views/**/*.jade')
        .pipe(jade()) 
        .pipe(gulp.dest('./dist/')) 
        .pipe(reload({stream:true}));
});


// Image Tasks: 
gulp.task('image', function () {
  gulp.src('client/images/*')
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

// Create Heroku Gulp Server
gulp.task('default', function() {
  gulp.start('scripts');
    gulp.start('css');
});

// Watch Tasks: Watch initiates all other tasks, then initiates browserSync. 
gulp.task('watch', ['jade', 'css', 'image', 'scripts'], function() {
	browserSync({
    	server: {
    		baseDir: "./dist/"
		}
	});
    gulp.watch('client/css/**/*.css', ['css'], reload);
    gulp.watch('views/**/*.jade', ['jade'], reload); 
    // gulp.watch(['./**/*.js', '!./node_modules/**/*.js'], ['scripts'], reload); // dont watch node_modules or call stack will be exceeded in terminal. 
});


