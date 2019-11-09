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

      var currentComments = $('<div>').addClass('viewcomment');
      if (data[i].comment.length > 0) {
        //console.log(data[i].comment);
        currentComments.append($('<h4>').text('Other Comments:'));
        for (var j = 0; j < data[i].comment.length; j++) {
          currentComments.append($('<p>').text(data[i].comment[j].comment));
        }
      }
      body.append(currentComments);

      articleCard.append(head);
      articleCard.append(body);
      //articleCard.append(body);
      $('#articles').append(articleCard);
    }
  }
});

$('#scrape').on('click', function() {
  $.get('/scrape', function() {
    console.log('scraped');
		location.reload(true);
  });
});
