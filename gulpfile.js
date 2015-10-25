// Require Gulp 
var gulp = require('gulp'),

	// Require Gulp's plugins. For now we will only be using browser-sync for faster dev updating & testing. 
	browserSync = require('browser-sync'),
	// this will reload the browser upon updates to either html or css files
	reload = browserSync.reload


// Watch Tasks
gulp.task('watch', function() {
    gulp.watch('../client/stylesheets/**/*.css', ['css']);
    gulp.watch('../client/views/**/*.jade', ['jade']); 
});


// CSS Task
gulp.task('css', function() {
	gulp.src('../client/stylesheets/**/*.css')
	.pipe(reload({stream:true}));
});

// HTML Tasks 
gulp.task('jade', function() {
	gulp.src('../client/views/**/*.jade')
	.pipe(reload({stream:true}));
});


//browserSync Tasks
gulp.task('browserSync', function() {
	browserSync({
		server: {
			baseDir: './'
		}
		// startPath: "/html"
	});
	   // browserSync.init({
    //     proxy: "localhost:3000"
    // });
})




// Default Tasks
gulp.task('default', ['jade', 'css', 'browserSync', 'watch']); 