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
      let sidebar = this.parentElement.parentElement,
          sidebarHeight = sidebar.offsetHeight - 100;
      if (sidebar.classList.contains("active")) {
        changeHeight(sidebarHeight);
        sidebar.classList.remove("active");
      }
      else {
        changeHeight(-1 * sidebarHeight);
        sidebar.classList.add("active");
      }
    });
  }
  
  return {
      init: init
  }
  
} )();