$('#shorty').submit(function(e) {
  e.preventDefault();
  const formData = $(this).serializeArray();
  const data = {};
  formData.forEach(item => {
    data[item.name] = item.value;
  });

  $.ajax({
    method: 'POST',
    url: '/api/v1/shorty',
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(res) {
      $('#yourURL').attr('href', data.url);
      $('#yourURL').text(data.url);
      $('#shortURL').attr('href', res.shortUrl);
      $('#shortURL').text(res.shortUrl);
      $('#statsURL').attr('href', res.statsUrl);
      $('#statsURL').text(res.statsUrl);
      $('#shorty').hide();
      $('#results').show();
    },
  });
});
