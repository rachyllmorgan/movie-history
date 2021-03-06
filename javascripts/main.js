requirejs.config({
  baseUrl: './javascripts',
  paths: {
    'jquery': '../bower_components/jquery/dist/jquery.min',
    'lodash': '/bower_components/lodash/lodash.min',
		'firebase': '../bower_components/firebase/firebase',
    'hbs': '../bower_components/require-handlebars-plugin/hbs',
    'bootstrap': '../bower_components/bootstrap/dist/js/bootstrap.min',
    'bootstrap-switch': '../bower_components/bootstrap-switch/dist/js/bootstrap-switch.min',
    'rating2' : '../bower_components/bootstrap-rating-input/build//bootstrap-rating-input.min'
  },
  shim: {
    'bootstrap': ['jquery'],
    'bootstrap-switch': ['bootstrap'],
    'rating2': ['bootstrap'],
		'firebase': {
			exports: 'Firebase'
		}
  }
});

requirejs(

["jquery", "lodash", "firebase", "hbs", "bootstrap", "addMovies", "bootstrap-switch", "deleteButton", "rating2"],
	function ($, _, _firebase, Handlebars, bootstrap, addMovies, bootstrapSwitch, deleteButton, rating2) {

		var poster;
		var myFirebaseRef = new Firebase("https://movie-history-cpr.firebaseio.com/");
		var movies;
    var moviesArray = [];
		myFirebaseRef.on("value", function(snapshot) {
      movies = snapshot.val();
      loadMovies(movies);
			console.log(movies);
      $("[name='viewed']").bootstrapSwitch();
    });

    function loadMovies(movies) {
      require(['hbs!../templates/movie-list'], function(template) {
        $("#movie-list").html(template(movies));
        $("[name='viewed']").bootstrapSwitch();
        $(".bootstrap-switch-handle-on").text("Yes!");
        $(".bootstrap-switch-handle-off").text("No");
        console.log("loadMovies function called");
      });

    }
// Get OMDB API movie info
    
  function getMovie(title) {
    $.ajax({
      url: "http://www.omdbapi.com/?",
      data: {
        t: title,
      },
    success: function(data) {
      console.log("Movie", data);
      var yearRel = $("#year").val(data.Year);
      var actors = $("#actors").val(data.Actors);
      poster = data.Poster;
      $("#poster").html("<img src='" + data.Poster + "' height=100>");
      
      }
    });
  }
  
  $(document).on("click", '.delete', function() {
    var deleteTitle = $(this).siblings('h2').text();
    var movieHash = _.findKey(movies.movies, {'Title': deleteTitle});
    console.log('movies.movies', movies.movies);
    
    console.log('movieHash', movieHash);


    deleteButton.delete(movieHash);
  });  
		
	$(".addMovies").click(function(){
		
		// Created var for movie
				var newMovie = {
					"Title": $("#movieTitle").val(),
					"Year": $("#year").val(),
					"Actors": $("#actors").val(),
					"Rating": $("input.rating").val(),
          "Poster": $("#poster").html(),
          "Viewed": $("input[type=radio]:checked").val(),

					};
			console.log("Added Rating: ", newMovie);
		
    // Adding Star Rating

    $('.rating').rating();

     $('input').on('change', function (e) {
       var userRating = $(this).attr('value');
     // Capture a variable that gets title/key
     var ratingTitle = $(this).parent().parent().siblings('h2').html();
      console.log(ratingTitle);
      console.log("allMovies :", allMovies);
     var titleKey = _.findKey(allMovies, {'Title': ratingTitle});
      console.log(titleKey);
       var ref = new Firebase('https://movie-history-cpr.firebaseio.com/' + titleKey);
         ref.update({rating: userRating});
     });

			// send to FireBase
					
			$.ajax({
        url: "https://movie-history-cpr.firebaseio.com/movies.json",
			method: "POST",
			data: JSON.stringify(newMovie)
      }).done(function(addedMovie) {
				console.log(addedMovie);
				});
				



        });
	
		// Search button
		
		$(".subTitle").on("click", function(){
			var title = $("#movieTitle").val();
			console.log("title", title);
			getMovie(title);
    });

});




















