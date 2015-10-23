// Require Gulp 
var require = require('gulp'),

	// Require Gulp's plugins. For now we will only be using browser-sync for faster dev updating & testing. 
	browserSync = ('browser-sync'),
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
})

// HTML Tasks 
gulp.task('jade ', function() {
	gulp.src('../client/views/**/*.jade')
})


//browserSync Task 




// Default Task
gulp.task('default', ['watch', 'jade', 'css']); 