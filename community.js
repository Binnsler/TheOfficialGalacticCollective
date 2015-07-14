var communityFeed = [];
var count = 0;

$(document).on('ready', function(){


	// Content, Event, and Job form injection into .submit-form-container

	$('.content-button').on('click', function(){

		$('.submit-form-container').empty();

		var contentForm = $('#content-form-template').html();

		var contentFormTemplate = Handlebars.compile(contentForm);  

		$('.submit-form-container').append(contentFormTemplate());
	})


	$('.event-button').on('click', function(){

		$('.submit-form-container').empty();

		var eventForm = $('#event-form-template').html();

		var eventFormTemplate = Handlebars.compile(eventForm);  

		$('.submit-form-container').append(eventFormTemplate());
	})


	$('.job-button').on('click', function(){

		$('.submit-form-container').empty();

		var jobForm = $('#job-form-template').html();

		var jobFormTemplate = Handlebars.compile(jobForm);  

		$('.submit-form-container').append(jobFormTemplate());
	})


	// Create and inject content, job, or event post into .community-feed

	var Post = function(postType, postTitle, postDescription, postUrl, dataId, postDate, postTime, likes){
		this.postType = postType;
		this.postTitle = postTitle;
		this.postDescription = postDescription;
		this.postUrl = postUrl;
		this.dataId = dataId;
		this.postDate = postDate || null;
		this.postTime = postTime || null;
		this.likes = likes || 0;
	}

	$('body').on('click', '.content-submit', function(event){

		event.preventDefault();

		count++;

		var tempTitle = $('#content-title').val();
		var tempDesc = $('#content-description').val();
		var tempUrl = $('#content-url').val();


		var tempContentPost = new Post('content', tempTitle, tempDesc, tempUrl, count);

		communityFeed.push(tempContentPost);

		var contentPostHtml = $('#content-post-template').html();

		var contentPostTemplate = Handlebars.compile(contentPostHtml);

		$('.community-feed').prepend(contentPostTemplate(tempContentPost));

		$('.submit-form-container').empty();

	})

	$('body').on('click', '.event-submit', function(event){

		event.preventDefault();

		count++;

		var tempTitle = $('#event-title').val();
		var tempDesc = $('#event-description').val();
		var tempUrl = $('#event-url').val();
		var tempDate = $('#event-date').val();
		var tempTime = $('#event-time').val();

		var tempEventPost = new Post('event', tempTitle, tempDesc, tempUrl, count, tempDate, tempTime);

		communityFeed.push(tempEventPost);

		var eventPostHtml = $('#event-post-template').html();

		var eventPostTemplate = Handlebars.compile(eventPostHtml)

		$('.community-feed').prepend(eventPostTemplate(tempEventPost));

		$('.submit-form-container').empty();

	})

	$('body').on('click', '.job-submit', function(event){

		event.preventDefault();

		count++;

		var tempTitle = $('#job-title').val();
		var tempDesc = $('#job-description').val();
		var tempUrl = $('#job-url').val();

		var tempJobPost = new Post('job', tempTitle, tempDesc, tempUrl, count);

		communityFeed.push(tempJobPost);

		var jobPostHtml = $('#job-post-template').html();

		var jobPostTemplate = Handlebars.compile(jobPostHtml);

		$('.community-feed').prepend(jobPostTemplate(tempJobPost));

		$('.submit-form-container').empty();

	})


	// Nuke, Repave, Repeat

	var nukeRepave = function(){


	}

	// Liking a Post

	$('body').on('click', '.heart-like', function(){

		var dataId = $(this).data('id');

		++communityFeed[dataId - 1].likes;

		$(this).removeClass('fa-heart-o');
		$(this).addClass('fa-heart');
		$(this).addClass('galactic-blue');

		$(this).next().empty();

		$(this).next().append(communityFeed[dataId - 1].likes + ' Likes')

	})



})