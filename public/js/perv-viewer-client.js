(function($){
  $(function(){
    var body = $(document.body);
    body.css('font-family', 'sans-serif')
    $.getJSON('/day', function(days) {
      body.append($('<ul id="days">'
      + days.map(function(day){
        return ['<li><a href="',day.url,'">',moment(day.date).format('YYYY-MM-DD (dddd)'),'</a></li>'].join('');
      }).join('')
      + '</ul>'));

      $('#days > li > a').click(function(e){
        var link = $(this);
        $.getJSON(link.attr('href'), function(day){
          link.parent().find('> ul').remove();
          link.parent().append(buildSubmenu(day, perv_client_data.base_watch_path));
        })
        return false;
      })
    });
  });

  function groupEventsByDir(events, base_path) {
    var escaped_base_path = base_path.replace(/\//g,'\\\/');
    var path_match = new RegExp('(' +escaped_base_path+ '\/[^\\/]+)');

    var events_grouped = {};
    for (var event in events) {
      var matches = events[event].watch_path.match(path_match);
      if (!matches) {
        continue;
      }
      var event_base = matches[0];
      if (typeof(events_grouped[event_base]) === 'undefined') {
        events_grouped[event_base] = [];
      }
      events_grouped[event_base].push(events[event]);
    }
    return events_grouped;
  }

  function buildSubmenu(events, base_path) {
    var events_grouped = groupEventsByDir(events, base_path);

    var list = $('<ul></ul>').data('perv-events-groups', events);

    for (var group in events_grouped) {
      var event_group = events_grouped[group];

      var item = $('<li></li>');
      item.append($('<p></p>').text(getPathLeafDirectory(group)).addClass('directory-name'));
      if (event_group.length) {
        item.append($('<p></p>').text('first: ' + moment(event_group[0].createdAt).format('h:mm:ss a') + ' (' + event_group[0].filename + ')'));
        item.append($('<p></p>').text('last: ' + moment(event_group[event_group.length-1].createdAt).format('h:mm:ss a')  + ' (' + event_group[event_group.length-1].filename + ')'));
      }

      //next level of tree
      item.data('perv-events', event_group).data('perv-group-path', group).click(function(e) {
        current_item = $(this);
        current_item.find('> ul').remove();
        current_item.append(buildSubmenu(current_item.data('perv-events'), current_item.data('perv-group-path')));
        return false;
      });
      list.append(item);
    }
    return list;
    
  }

  function getPathLeafDirectory(path) {
    var matches = path.match(/^.*\/(.+?)$/);
    if (matches) {
      return matches[1];
    }
  }
})(jQuery);
