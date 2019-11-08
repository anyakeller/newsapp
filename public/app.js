$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
		var articleCard = $("<div>").addClass("card articlecard");
		var head = $("<div>").addClass("card-header").text(data[i].title);
		var body = $("<div>").addClass("card-body").text(data[i].link);
		articleCard.append(head);
		articleCard.append(body);
    $("#articles").append(articleCard);
  }
});

