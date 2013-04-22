// For each node on the page with class="cell"
$('.cell').each(function() {
	var cell = this; // save a reference to this cell for later
	// Fetch the images from the data-images attribute (comma separated)
	var images = $(cell).attr('data-images').split(',');
	// Begin building the popup content based on the attached images
	var holder = $('<div>');
	for (var i in images) {
		// For each image URL, create an img tag with the src specified
		var img = $('<img>').attr('src', images[i]);
		// And set up a click handler for that image
		img.on('click', function() {
			// The user clicked the image in the popup... I'm guess you want to do something like this:
			$(cell).html( $(this).attr('src') );
		});
		holder.append(img);
	}
	var content = holder.html();
	// Now that we built the HTML content for the popup, set up the popup for this cell
	$(cell).poshytip({content: content});
});
