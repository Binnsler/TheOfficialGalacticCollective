// Require Gulp 
var gulp = require('gulp')

// Require Gulp's plugins.
var browserSync = require('browser-sync'),
	// this will live-reload the browser upon updates to either html or css files
	reload = browserSync.reload

var webserver = require('gulp-webserver')
// var connect = require('gulp-connect')
var jade = require('gulp-jade')

// HTML Tasks: takes all Jade files in path, converts them to html and places into /dist folder. live reload is being used.
gulp.task('jade', function() {
    return gulp.src('views/**/*.jade')
        .pipe(jade()) 
        .pipe(gulp.dest('./dist/')) 
        .pipe(reload({stream:true}));
});

// Scripts Tasks: takes all JS files in path and places into dist/js folder. live reload is being used. 
gulp.task('scripts', function() {
	gulp.src('./**/*.js')
	.pipe(gulp.dest('./dist/js'))
	.pipe(reload({stream:true}));
})


// CSS Tasks: takes all CSS files in path and places into dist/css folder. live reload is being used.
gulp.task('css', function() {
	return gulp.src('client/stylesheets/**/*.css')
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream:true}));
});

// Watch Tasks: Watch initiates all other tasks, then initiates browserSync. 
gulp.task('watch', ['jade', 'css', 'scripts'], function() {
	browserSync({
    	server: {
    		baseDir: "./dist"
		}
	});
    gulp.watch('client/stylesheets/**/*.css', ['css'], reload);
    gulp.watch('views/**/*.jade', ['jade'], reload); 
    gulp.watch(['/client/**/*.js', '!/node_modules/**/*.js'], ['scripts'], reload);
});


