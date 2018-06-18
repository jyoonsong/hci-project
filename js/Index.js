let Index = ( function () {

  function init() {
    Map.init();
    Filter.init();
    
    let filterbar = document.getElementById("filterbar");
    let sidebar = document.getElementById("sidebar"),
        sidebarHeight = sidebar.offsetHeight - 100;
    
    $("#searchPanel").multiselect({
        columns: 1,
        placeholder: "인물을 선택해보세요",
        search: true,
        selectAll: true
    });

    document.getElementById("des-header").addEventListener("click", function(e) {
      if (sidebar.classList.contains("active")) {
        changeHeight(sidebarHeight);
        sidebar.classList.remove("active");
      }
      else {
        changeHeight(-1 * sidebarHeight);
        sidebar.classList.add("active");
      }
    });
    
    document.getElementById("showOption").addEventListener("click", function(e) {
      if (filterbar.classList.contains("active")) {
        this.innerHTML = "그래프 옵션";
        filterbar.classList.remove("active");
      }
      else {
        this.innerHTML = "옵션 숨기기";
        filterbar.classList.add("active");
      }
    });
  }
  
  return {
      init: init
  }
  
} )();