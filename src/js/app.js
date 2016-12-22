var show = new showdown.Converter();
var pages = function (page) {
  $.get("/docs/" + page.replace(/\s|\-/g, '_').toLowerCase() + ".md", function(res){
    $("body > .container").html("<div class=\"markdown\"></div>");
    $(".markdown").html(show.makeHtml(res));
  });
};

var routes = {
  '/:page': pages
};

var router = Router(routes);
router.init();
