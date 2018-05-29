let Index = ( function () {

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
  }
  
  function callChangeTime(ele, index, $timeBtn) {
    ele.addEventListener("click", function() {
      changeTime(index);
      setActive($timeBtn, index);
    })
  }
  
  function setActive($arr, index) {
    for (let i = 0; i < $timeBtn.length; i++)
        if (i != index)
          $timeBtn[i].classList.remove("active");
      
    $timeBtn[index].classList.add("active");
  }
  
  function callShowContent(node, i, $nodes) {
    node.addEventListener("click", function() {
      showContent(this);
    });
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