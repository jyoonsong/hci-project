let Filter = ( function () {

  let $timeBtn, $nodes,
      _cursor = false;

  function init() {
    // change time scope
    $timeBtn = Array.from( 
      document.querySelectorAll("#changeTime a.btn")
    );
    $timeBtn.forEach(callChangeTime);
    setActive($timeBtn, 0);
    
    // click node to show content
    $nodes = Array.from(
      document.querySelectorAll("rect.node")
    );
    $nodes.forEach(callShowContent);
    
    // change y axis
    document.querySelector("#changeAxis").onchange = function () {
      swapAxisModeInto(this.value);
      swapAxisLabelInto(this.value);
    }
    
    // unset active
    document.querySelector("svg.chart").onclick = function(e) {
      if (e.target == this) { 
        unsetOpacity($nodes);
      }
    }; 
  }
  
  function swapAxisLabelInto(changedMode) {
    let content;
    if (changedMode == 'Color')
      content = '<span class="text-blue">우</span><span class="bar"></span><span class="text-red">좌</span>';
    else if (changedMode == 'Pos')
      content = "<span class='text-grey-6'>관내</span><span class='text-white'>관내</span><span class='text-white'>관내</span><span class='text-grey-6'>만주</span><span class='text-grey-6'>화북</span>";
    document.querySelector(".yAxis").innerHTML = content;

  }
  
  function unsetActive($arr, index) {
    for (let i = 0; i < $arr.length; i++)
        if (i != index)
          $arr[i].classList.remove("active");
  }

  function setActive($arr, index) {
    $arr[index].classList.add("active");
  }
  
  function setOpacity($arr, index) {
    for (let i = 0; i < $arr.length; i++) {
      if (i != index) {
        $arr[i].classList.add("transparent");
        $arr[i].classList.remove("active");
      }
      else
        $arr[i].classList.remove("transparent");
    }
    console.log(index + "is not transparent");
  }
  
  function unsetOpacity($arr) {
    for (let i = 0; i < $arr.length; i++)
      $arr[i].classList.remove("transparent", "active");
  }
  
  function callChangeTime(ele, index, $timeBtn) {
    ele.onclick = function() {
      changeTime(index);
      setActive($timeBtn, index);
      unsetActive($timeBtn, index);
    };
  }
  
  function callShowContent(node, i, $nodes) {
    node.onclick = function() {
      showContent(this);
      setActive($nodes, i);
      setOpacity($nodes, i);
      Util.showSidebar();
    };
  }
  
  
  
  function showContent(node) {
    // parse values
    let vals = ["name", "date", "description"];
    vals.forEach( function(val) {
      document.getElementById("des-" + val).innerHTML = node.getAttribute("data-" + val);
    });
    // parse events
    let events = node.dataset.events.split(',');
    let eventBox = document.getElementById("des-events");
    eventBox.innerHTML ="";
    events.forEach( function(e) {
      if (e.length > 0)
        eventBox.innerHTML += ("<span class='event flex flex-column justify-center'>" + e + "</span>");
    })
  }

  function setCursor(cursor) {
      if (_cursor == cursor) return;
      _cursor = cursor;
      switch (_cursor) {
          case 0:
              $root.className = 'c-normal';
              break;
          case 1:
              $root.className = 'c-move';
              break;
          case 2:
              $root.className = 'c-resize';
              break;
          case 3:
              $root.className = 'c-slide';
              break;
      }
  }

  return {
      init: init
  }
  
} )();