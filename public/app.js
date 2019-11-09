$.get('/articles', function(data) {
  if (data.length == 0) $('#articles').text('No Articles');
  else {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      var articleCard = $('<div>').addClass('card articlecard');
      var head = $('<div>').addClass('card-header');
      head.append(
        $('<a>')
          .text(data[i].title)
          .attr('href', data[i].link)
      );

      var body = $('<div>').addClass('card-body');
      var currentComment = $('<div>').addClass('viewcomment');
      if (data[i].comment) {
				console.log(data[i].comment);
        $.get('/comment/' + data[i].comment, function(commentdata) {
          currentComment.append($("<p>").text(commentdata.comment));
        });
      }
			body.append(currentComment);
      
			var addCommentAndSave = $('<div>').addClass('addcommmentsaveform');
      var theform = $('<form>').attr({
        method: 'post',
        action: '/comment/' + data[i]._id
      });
      var formbody = $('<div>').addClass('form-group row');
      theform.append(formbody);
      var formlabel = $('<label>')
        .addClass('col-sm-3 col-form-label')
        .text('Your Comment: ')
        .attr('for', 'articlecomment' + data[i]._id);
      formbody.append(formlabel);
      formbody.append(
        $('<div>')
          .addClass('col-sm-6')
          .append(
            $('<input>')
              .addClass('form-control')
              .attr({
                name: 'comment',
                type: 'text',
                id: 'articlecomment' + data[i]._id
              })
          )
      );
      var submitbtndiv = $('<div>').addClass('col-sm-3');
      submitbtndiv.append(
        $('<button>')
          .attr('type', 'submit')
          .addClass('btn btn-success')
          .text('add comment')
      );
      formbody.append(submitbtndiv);
      addCommentAndSave.append(theform);
      body.append(addCommentAndSave);

      articleCard.append(head);
      articleCard.append(body);
      //articleCard.append(body);
      $('#articles').append(articleCard);
    }
  }
});
