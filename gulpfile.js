// Require Gulp 
var gulp = require('gulp'),

	// Require Gulp's plugins. For now we will only be using browser-sync for faster dev updating & testing. 
	browserSync = require('browser-sync'),
	// this will reload the browser upon updates to either html or css files
	reload = browserSync.reload,

	webserver = require('gulp-webserver');



// Watch Tasks
gulp.task('watch', function() {
    return gulp.watch('../client/stylesheets/**/*.css', ['css']);
    gulp.watch('../client/views/**/*.jade', ['jade']); 
});


// CSS Task
gulp.task('css', function() {
	return gulp.src('../client/stylesheets/**/*.css')
	.pipe(reload({stream:true}));
});

// HTML Tasks 
gulp.task('jade', function() {
	return gulp.src('../client/views/**/*.jade')
	.pipe(reload({stream:true}));
});


// browserSync Tasks
// gulp.task('browserSync', function() {
// 	// browserSync({
// 	// 	server: {
// 	// 		baseDir: './'
// 	// 	}
// 	// });
// 	browserSync.init(null, {
//     	proxy: "http://localhost:3000",
//       	files: ['galacticcollective/**/*'],
//       	browser: "google chrome",
//       	port: 3000
//   });
// });

gulp.task('webserver', function() {
 	gulp.src('galacticcollective')
   	.pipe(webserver({
   		port: '3000',
    	livereload: true,
    	// directoryListing: true,
    	open: true,
    	// fallback: 'home.jade'
  //   	directoryListing: {
  //   		enable:true,
  //   		path: './'
		// }
    }));
});




// Default Tasks
gulp.task('default', ['jade', 'css', 'watch', 'webserver']); 