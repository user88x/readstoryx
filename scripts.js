$(function() {
  var UPDATE_INTERVAL = 2;
  $(document).ready(function(){
    var ww = $(window).width(),
        wh = $(window).height();
    var paper = Raphael("container", ww, wh); 
    //paper.setSize('100%', '100%');
    setInterval(function() {
        $.ajax({url: "fetch", success: function(result){
          $("#recent").html("<span style='color:black'>Oven Temperature: </span>" + result.slice().pop().temp  + " <sup style='font-size:15px'>O</sup>C");
          if(result) update_plot(result);
        }});
    },1000*UPDATE_INTERVAL);

  function update_plot(res) {
    paper.clear();
    var yVals = res.map(x => x.temp);
    var xVals = res.map(x => x.time);
    var ch = paper.linechart(30, 30, 0.9*ww, 0.9*wh, xVals, yVals, {axis: '0 0 1 1',  axisxstep:10, axisystep:10, shade:false, smooth:false});
    update_labels();
    create_controls();

    console.log(xVals);
    console.log(yVals)
    console.log(ww, wh)

    function create_controls() {
      var saveBut = paper.rect(0.7*ww,0,50,20).attr({"fill":"green", opacity:0.3});
      var saveText = paper.text(0.7*ww+25,10,"Save").attr("font-size","20px");
      saveBut.node.onclick = function(){
        console.log("saveBut click")
        savePlot();
      }
      saveText.node.setAttribute('pointer-events', 'none')

      var clearBut = paper.rect(0.7*ww-100,0,50,20).attr({"fill":"green", opacity:0.3});
      var clearText = paper.text(0.7*ww+25-100,10,"Clear").attr({"font-size":"20px"});
      clearBut.node.onclick = function(){
        console.log("clearBut click")
        clearPlot();
      }
      clearText.node.setAttribute('pointer-events', 'none')

      var pauseBut = paper.rect(0.7*ww-204,0,58,20).attr({"fill":"green", opacity:0.3});
      var pauseText = paper.text(0.7*ww+25-200,10,"Pause").attr({"font-size":"20px"});
      pauseBut.node.onclick = function(){
        console.log("pauseBut click")
        pausePlot();
      }
      pauseText.node.setAttribute('pointer-events', 'none')
    }
    function update_labels() {
      var xText = ch.axis[0].text.items;      
      for(var i in xText){ // Iterate through the array of dom elems, the current dom elem will be i
        var _oldLabel = xText[i].attr('text'); // Get the current dom elem in the loop, and split it on the decimal
        var int_part = Math.floor(_oldLabel).toString().padStart(2,0);
        var frac_part = Math.round((_oldLabel - int_part)*100*0.6).toString().padStart(2,0);
        var    _newLabel = int_part + ":" + frac_part ; // Format the result into time strings
        xText[i].attr({'text': _newLabel}); // Set the text of the current elem with the result
      };
    }

  }

  window.savePlot = function savePlot() {
    saveSvgAsPng($("svg")[0], "plot.png")
  }
  window.clearPlot = function clearPlot() {
    $.ajax({url: "clear", success: function(result){
        console.log("clear success")
    }});
  }
  window.pausePlot = function clearPlot() {
    $.ajax({url: "pause", success: function(result){
        console.log("pause success")
    }});
  }
  });
})

