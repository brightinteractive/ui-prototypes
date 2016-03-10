var voting = (function() {
	'use strict';

	function init() {

		// Check local storage for whether user has voted
		if (hasUserVoted()) {
			disableVotes();
		}

		$('.js-vote-btn').on('click', function(evt) {
			evt.preventDefault();

			//check user hasn't already voted 
			if (!hasUserVoted()) {
				var voteOption = $('evt.currentTarget').data('vote');
				ga('send', 'event', 'Panel Voting', voteOption);

				console.log('voted');

				// store that user has voted 
				localStorage.setItem('hasVoted', true);

				disableVotes();

			}
			
		});	
	}

	function disableVotes() {
		$('.js-vote').addClass('has-voted');
		$('.vote__extra').show();
	}

	function hasUserVoted() {
		return localStorage.getItem('hasVoted');
	}


	return {
		init:init
	};
}());