// Require Gulp 
var gulp = require('gulp')

// Require Gulp's plugins. For now we will only be using browser-sync for faster dev updating & testing. 
var browserSync = require('browser-sync'),
	// this will reload the browser upon updates to either html or css files
	reload = browserSync.reload

var webserver = require('gulp-webserver')
var connect = require('gulp-connect')

var jade = require('gulp-jade')


// Scripts Tasks
gulp.task('scripts', function() {
	gulp.src('./**/*.js')
	.pipe(gulp.dest('./dist/js'))
})


// HTML Tasks
gulp.task('jade', function() {
    return gulp.src('views/**/*.jade')
        .pipe(jade()) // pip to jade plugin
        .pipe(gulp.dest('./dist/')) // tell gulp our output folder
        .pipe(reload({stream:true}));
});

// CSS Tasks
gulp.task('css', function() {
	return gulp.src('client/stylesheets/**/*.css')
	.pipe(gulp.dest('./dist/css'))
	.pipe(reload({stream:true}));
});

// Watch Tasks
gulp.task('watch', function() {
	browserSync({
    	server: {
    		baseDir: "./dist"
		}
	});
    gulp.watch('client/stylesheets/**/*.css', ['css'], reload);
    gulp.watch('views/**/*.jade', ['jade'], reload); 
});



// browserSync Tasks
// gulp.task('browserSync', function() {
// 	browserSync({
//     	server: {
//     		baseDir: "./dist"
// 		}
// 	});
// });

	


// Default Tasks
gulp.task('default', ['scripts', 'jade', 'css', 'watch']); 