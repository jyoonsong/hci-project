/*
 * Variables
 */

let colors = [ "FarRight", "MidRight", "Mid", "MidLeft", "FarLeft" ];
let locations = [ "중국관내", "중국관내2", "중국관내3", "만주", "화북" ]; // 연해주 국내 추가
color_tasks = []
location_tasks = []

let taskStatus = {
    "FarRight" : "blue-2",
    "MidRight" : "blue-0",
    "Mid" : "purple-1",
    "MidLeft" : "red-2",
    "FarLeft" : "red-0"
};

let task_data = {
      "orgName": "대한민국임시정부",
      "orgLeader": "김구",
      "orgEvent": [
        {
          "name": "대한민국 임시헌장",
          "startDate": makeYearMonth(1944, 4),
          "endDate": makeYearMonth(1945, 6)
        }
      ]
    };

var tasks = [];

let startYear = makeYearMonth(1910, 0);
let endYear = makeYearMonth(1945, 0);

let PossibleTimeDomain = [
    {"startDate": makeYearMonth(1910, 0),"endDate": makeYearMonth(1945, 0)},
    {"startDate": makeYearMonth(1910, 0),"endDate": makeYearMonth(1920, 0)},
    {"startDate": makeYearMonth(1920, 0),"endDate": makeYearMonth(1930, 0)},
    {"startDate": makeYearMonth(1930, 0),"endDate": makeYearMonth(1940, 0)},
    {"startDate": makeYearMonth(1940, 0),"endDate": makeYearMonth(1945, 0)},
];

let format = "%H:%M";
let timeDomainString = "1day";

let width = (document.body.offsetWidth < 1200) ? 1200 : document.body.offsetWidth;

/*
 * Sort Data
 */

// tasks.sort(function(a, b) {
//     return a.endDate - b.endDate;
// });
// let maxDate = tasks[tasks.length - 1].endDate;
//
// tasks.sort(function(a, b) {
//     return a.startDate - b.startDate;
// });
// let minDate = tasks[0].startDate;


/*
 * Draw Chart
 */

// changeTimeDomain(timeDomainString);
// tasks = [task_new, task_new2]
// gantt(tasks);
// gantt()

d3.json("js/data.json", function(error, data) {
  if (error)
    throw error;

  var date_duplicated = function(src_srt, src_end, dest_srt, dest_end) {
      if ((src_srt < dest_srt && src_end < dest_srt)
          || (dest_srt  < src_srt && dest_end < src_srt))
          return false

      return true
  }

  dataMappingTable_idx_with_color = [[], [], [], [], []];
  dataMappingTable_idx_with_location = [[], [], [], [], []];

  for (let i = 0; i < data.length; i++) {
    let start = data[i].startDate.split("/");
    let end = data[i].endDate.split("/");

    data[i].startDate = makeYearMonth(start[0], start[1]);
    data[i].endDate = makeYearMonth(end[0], end[1]);

    data[i].data.orgEvent.forEach( function(e) {
      let eventStart = e.startDate.split("/");
      let eventEnd = e.endDate.split("/");
      e.startDate = makeYearMonth(eventStart[0], eventStart[1]);
      e.endDate = makeYearMonth(eventEnd[0], eventEnd[1]);
    });

    data[i].colorsOrderPriority = 0;
    data[i].locationOrderPriority = 0;

    dataMappingTable_idx_with_color[colors.indexOf(data[i].color)].push(i);
    dataMappingTable_idx_with_location[locations.indexOf(data[i].location)].push(i);

    addTask(data[i]);
  }

  for (var color_idx in colors) {
      temp_array = []
      for (var mapping_idx in dataMappingTable_idx_with_color[color_idx]) {
          idx = dataMappingTable_idx_with_color[color_idx][mapping_idx]
          temp_array.push(data[idx])
      }

      compare_table = {};
      next_order_count=0
      for (curr_idx=0; curr_idx<temp_array.length; curr_idx++) {
          finished = false;
          // for (next_curr_idx=0; next_curr_idx<curr_idx; next_curr_idx++) {
          for (order_count=0; order_count<Object.keys(compare_table).length; order_count++) {
              duplicated = false
              for (compares=0; compares<compare_table[order_count].length/2; compares++) {
                  if (date_duplicated(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate,
                          compare_table[order_count][compares], compare_table[order_count][compares + 1])) {
                      duplicated = true
                      break;
                  }
              }
              if (!duplicated) {
                  temp_array[curr_idx].colorsOrderPriority = order_count
                  finished = true;

                  if (typeof(compare_table[temp_array[curr_idx].colorsOrderPriority] != "object"))
                      compare_table[order_count] = []
                  compare_table[order_count].push(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate)
                  break;
              }
          }
          if (!finished) {
              temp_array[curr_idx].colorsOrderPriority = order_count
              if (typeof(compare_table[order_count] != "object"))
                  compare_table[order_count] = []
              compare_table[order_count].push(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate)
              next_order_count++
          }
      }

      sample_color = temp_array[0].color
      for (var i=0; i<next_order_count; i++) {
          color_tasks.push(sample_color+i)
      }
  }
  for (var location_idx in locations) {
      temp_array = []
      for (var mapping_idx in dataMappingTable_idx_with_location[location_idx]) {
          idx = dataMappingTable_idx_with_location[location_idx][mapping_idx]
          temp_array.push(data[idx])
      }

      compare_table = {};
      next_order_count=0
      for (curr_idx=0; curr_idx<temp_array.length; curr_idx++) {
          finished = false;
          // for (next_curr_idx=0; next_curr_idx<curr_idx; next_curr_idx++) {
          for (order_count=0; order_count<Object.keys(compare_table).length; order_count++) {
              duplicated = false
              for (compares=0; compares<compare_table[order_count].length/2; compares++) {
                  if (date_duplicated(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate,
                          compare_table[order_count][compares], compare_table[order_count][compares + 1])) {
                      duplicated = true
                      break;
                  }
              }
              if (!duplicated) {
                  temp_array[curr_idx].locationOrderPriority = order_count
                  finished = true;
                  if (typeof(compare_table[temp_array[curr_idx].locationOrderPriority] != "object"))
                      compare_table[order_count] = []
                  compare_table[order_count].push(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate)
                  break;
              }
          }
          if (!finished) {
              temp_array[curr_idx].locationOrderPriority = order_count
              if (typeof(compare_table[order_count] != "object"))
                  compare_table[order_count] = []
              compare_table[order_count].push(temp_array[curr_idx].startDate, temp_array[curr_idx].endDate)
              next_order_count++
          }
      }

      sample_location = temp_array[0].location
      for (var i=0; i<next_order_count; i++) {
          location_tasks.push(sample_location+i)
      }
  }
  console.log(data);
  gantt.taskTypes(color_tasks).redraw(tasks);
  console.log(location_tasks)
});

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}


let gantt = d3.gantt().taskTypes(color_tasks).currentTaskMode('Color').taskStatus(taskStatus).tickFormat(format)
    .height(document.body.offsetHeight - 250);

gantt.timeDomainMode("fixed");
gantt.timeDomain([ d3.time.month.offset(Date.UTC(year=1910,0,0,0,0), 0), Date.UTC(year=1945,0,0,0,0) ]);
gantt.tickFormat("%m");


/*
* Functions
*/

function changeHeight(addedHeight) {
  let newHeight = gantt.height() + addedHeight;
  gantt.height(newHeight);
  console.log("changeHeight by " + addedHeight);
  console.log("changeHeight to " + newHeight);
  gantt.redraw(tasks);
}

function changeTime(idx) {
//    console.log( d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0), PossibleTimeDomain[idx]['endDate']);
    document.querySelectorAll('[class="scrollable"]')[0].scrollLeft = 0

    gantt.timeDomain([ d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0),
        PossibleTimeDomain[idx]['endDate'] ]);

    gantt.hideText(idx == 0)
    console.log(idx, gantt.hideText)
    gantt.redraw(tasks)
}

function changeTimeWithSpecificYearMonth(src_year, src_month, dest_year, dest_month) {
    document.querySelectorAll('[class="scrollable"]')[0].scrollLeft = 0

    gantt.timeDomain([ makeYearMonth(src_year, src_month), makeYearMonth(dest_year, dest_month)]);
    gantt.redraw(tasks)
}


function swapAxisModeInto(mode) {
    _taskTypes = (mode == 'Pos') ? location_tasks : color_tasks;
    gantt.currentTaskMode(mode).taskTypes(_taskTypes).redraw(tasks);
}

function changeTimeDomain(timeDomainString) {
    this.timeDomainString = timeDomainString;
    switch (timeDomainString) {
        case "1hr":
            format = "%H:%M:%S";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -1), getEndDate() ]);
            break;
        case "3hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -3), getEndDate() ]);
            break;

        case "6hr":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.hour.offset(getEndDate(), -6), getEndDate() ]);
            break;

        case "1day":
            format = "%H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -1), getEndDate() ]);
            break;

        case "1week":
            format = "%a %H:%M";
            gantt.timeDomain([ d3.time.day.offset(getEndDate(), -7), getEndDate() ]);
            break;
        default:
            format = "%H:%M"

    }
    gantt.tickFormat(format);
    // gantt.redraw(tasks);
}

function getEndDate() {
    let lastEndDate = Date.now();
    if (tasks.length > 0) {
        lastEndDate = tasks[tasks.length - 1].endDate;
    }

    return lastEndDate;
}

function addTask(task) {
    tasks.push(task);

    // changeTimeDomain(timeDomainString);
    gantt.redraw(tasks);
    Filter.init();

};

function makeYearMonth(y, m) {
    return Date.UTC(y, m, 0, 0, 0)
}

gantt(tasks);
changeTime(0)