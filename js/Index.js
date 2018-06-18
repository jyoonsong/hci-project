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

    document.getElementById("des-header").addEventListener("click", function(e) {
      console.log('hahaha');
      let sidebar = this.parentElement.parentElement;
      if (sidebar.classList.contains("active"))
        sidebar.classList.remove("active");
      else
        sidebar.classList.add("active");
    });
  }
  
  return {
      init: init
  }
  
} )();