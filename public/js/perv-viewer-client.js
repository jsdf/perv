(function($){
  $(function(){
    $.getJSON('/day', function(days) {
      var body = $(document.body);
      body.append($('<ul id="days">'
      + days.map(function(day){
        return ['<li><a href="',day.url,'">',day.date,'</a></li>'].join('');
      }).join('')
      + '</ul>'));

      $('#days li a').click(function(e){
        $.getJSON($(this).attr('href'), function(day){
          console.log(groupEventsByDir(day, '/home/james/sites/'));
        })
        return false;
      })
    });

  });

  function groupEventsByDir(events, base_path) {
    var escaped_base_path = base_path.replace(/\//g,'\\\/');
    var path_match = new RegExp('(' +escaped_base_path+ '[^\\/]+)');

    var events_grouped = {};
    for (var event in events) {
      var event_base = events[event].watch_path.match(path_match);
      if (typeof(events_grouped[event_base]) === 'undefined') {
        events_grouped[event_base] = [];
      } else {
        events_grouped[event_base].push(events[event]);
      }
    }
    return events_grouped;
  }
})(jQuery);
