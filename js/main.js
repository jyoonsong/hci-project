let Index = ( function () {

  let $timeBtn, $root,
      _cursor = false;

  function init() {
    // change time scope
    $timeBtn = Array.from( 
      document.querySelectorAll("#changeTime a.btn")
    );
    $timeBtn.forEach(callChangeTime);

  }
  
  function callChangeTime(ele, index, $timeBtn) {
    ele.addEventListener("click", function() {
      changeTime(index);
      
      for (i = 0; i < $timeBtn.length; i++) {
        if (i != index)
          $timeBtn[i].classList.remove("active");
      }
      
      ele.classList.add("active");
    })
  }
  
  function setActive(ele, i, index) {
    console.log("setActive" + i);
    if (i == index)
      ele.classList.add("active");
    else
      ele.classList.remove("active");
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