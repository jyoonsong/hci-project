let Index = ( function () {

  let $timeBtn, $nodes,
      _cursor = false;

  function init() {
    Map.init();
    Filter.init();
    
    $("#searchPanel").multiselect({
        columns: 1,
        placeholder: "인물을 선택해보세요",
        search: true,
        selectAll: true
    });

    document.getElementById("des").addEventListener("click", function(e) {
      console.log('hahaha');
      if (this.classList.contains("active"))
        this.classList.remove("active");
      else
        this.classList.add("active");
    });
  }
  
  return {
      init: init
  }
  
} )();