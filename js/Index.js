let Index = ( function () {

  let $timeBtn, $nodes,
      _cursor = false;

  function init() {
    Map.init();
    Filter.init();
    
    $('#searchPanel').multiselect({
        columns: 1,
        placeholder: '인물을 선택해보세요',
        search: true,
        selectAll: true
    });
  }
  
  return {
      init: init
  }
  
} )();