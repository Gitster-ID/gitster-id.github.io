var show = new showdown.Converter();
var pages = function (page) {
  $.get("/docs/" + page.replace(/\s|\-/g, '_').toLowerCase() + ".md", function(res){
    $("body > .container").html("<div class=\"markdown\"></div>");
    $(".markdown").html(show.makeHtml(res));
  });
};

var docs = function () {
  $.getJSON( "/pages.json", function( data ) {
    $("body > .container").html("");
    var items = [];
    data.sort(function(a, b) {
      return a.pid - b.pid;
    });
    items.push( "<a href='#/docs/' id='0' class='text-white list-group-item bg-info col-xs-12 col-sm-6 col-md-4'>0. Berkas Dokumentasi</a>" );
    $.each( data, function( key, val ) {
      items.push( "<a href='#/pages/" + val.file.replace(/\s|\-/g, '_').toLowerCase() + "' id='" + val.pid + "' class='list-group-item list-group-item-action col-xs-12 col-sm-6 col-md-4'>"+ val.pid + ". " + val.name + "</a>" );
    });

    $( "<div/>", {
      "class": "document-lists list-group row",
      html: items.join( "" )
    }).appendTo( "body > .container" );
  });
};

var routes = {
  '/pages/:page': pages,
  '/docs': docs
};

var router = Router(routes);
router.init();
