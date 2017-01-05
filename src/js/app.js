var show = new showdown.Converter();

var getPageDetail = function(data, query) {
    for(var i = 0; i < data.length; i++){
      var obj = data[i];
      for(var prop in obj){
        if(obj.hasOwnProperty(prop) && !isNaN(obj[prop])){
            obj[prop] = +obj[prop];
        }
      }
      if (obj.pid === query || obj.name === query || obj.file === query) {
        return(obj);
      }
    }
};

var home = function() { // GET /#/home
  window.location.replace("/");
};

$("a[href^='#']").click(function(){ // Make it looks nice on device
  $(".navbar-toggler").click();
});

// Setting up for Routers
var about = function() { // GET /#/about
  $.get("/docs/thank_you.md", function(res){
    $("body > .container").html("<div class=\"markdown typography-subheading\"></div>");
    $(".markdown").html(show.makeHtml(res));
  });
};

var pages = function (page) { // GET /#/pages/{filename}
  $.get("/docs/" + page.replace(/\s|\-/g, '_').toLowerCase() + ".md", function(res){ // Get source file markdown and served as a content
    $("body > .container").html("<div class=\"markdown\"></div>");
    $(".markdown").html(show.makeHtml(res));
    $.getJSON("/docs/routes.json", function(dataRoute) {
      var pageDetail = getPageDetail(dataRoute, page);
      $('title').text(pageDetail.pid + '. ' + pageDetail.name);
      var prev = getPageDetail(dataRoute, pageDetail.pid - 1);
      var next = getPageDetail(dataRoute, pageDetail.pid + 1);
      $("body > .container").append("<nav aria-label=\"Page navigation\"><ul class=\"pagination pull-right\"><li class=\"page-item\"><a class=\"page-link\" href=/#/\"" + prev.file + "\"><i class=\"fa fa-angle-double-left\" aria-hidden=\"true\"></i> " + prev.pid + '. ' + prev.name + "</a></li><li class=\"page-item\"><a class=\"page-link\" href=/#/\"" + next.file + "\">" + next.pid + '. ' + next.name + " <i class=\"fa fa-angle-double-right\" aria-hidden=\"true\"></i></a></li></ul></nav>");
    });
  });
};

var docs = function () { // GET /#/docs
  $.getJSON("/docs/routes.json", function( data ) { // Get source routes JSON served as data
    $("body > .container").html("");
    var items = [];
    data.sort(function(a, b) { // Sort data by pages_id from source JSON
      return a.pid - b.pid;
    });
    items.push( "<a href='#/docs/' id='0' class='text-white list-group-item bg-info col-xs-12 col-sm-6 col-md-4'>0. Berkas Dokumentasi</a>" );
    $.each( data, function( key, val ) { // Parse each items to a list of docs
      items.push( "<a href='#/pages/" + val.file.replace(/\s|\-/g, '_').toLowerCase() + "' id='" + val.pid + "' class='list-group-item list-group-item-action col-xs-12 col-sm-6 col-md-4'>"+ val.pid + ". " + val.name + "</a>" );
    });

    $( "<div/>", {
      "class": "document-lists list-group row",
      html: items.join( "" )
    }).appendTo( "body > .container" );
  });
};

var routes = { // Setting up routes rule
  '/pages/:page': pages,
  '/docs': docs,
  '/home': home,
  '/about': about
};

// Initialize the routers
var router = Router(routes);
router.init();
