/*
 * Variables
 */

let colors = [ "FarRight", "MidRight", "Mid", "MidLeft", "FarLeft" ];
let locations = [ "중국관내", "중국관내2", "중국관내3", "만주", "화북" ]; // 연해주 국내 추가

let taskStatus = {
    "FarRight" : "blue",
    "MidRight" : "blue-purple",
    "Mid" : "purple",
    "MidLeft" : "red-purple",
    "FarLeft" : "red"
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

let gantt = d3.gantt().taskTypes(colors).currentTaskMode('Color').taskStatus(taskStatus).tickFormat(format).height(document.querySelector("#chart").offsetHeight - 80);

gantt.timeDomainMode("fixed");
gantt.timeDomain([ d3.time.month.offset(Date.UTC(year=1910,0,0,0,0), 0), Date.UTC(year=1945,0,0,0,0) ]);
gantt.tickFormat("%m");

// changeTimeDomain(timeDomainString);
// tasks = [task_new, task_new2]
// gantt(tasks);
// gantt()

d3.json("js/data.json", function(error, data) {
  if (error)
    throw error;
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
    
    addTask(data[i]);
  }
});


/*
* Functions
*/

function changeTime(idx) {
//    console.log( d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0), PossibleTimeDomain[idx]['endDate']);
    document.querySelectorAll('[class="scrollable"]')[0].scrollLeft = 0

    gantt.timeDomain([ d3.time.month.offset(PossibleTimeDomain[idx]['startDate'], 0),
        PossibleTimeDomain[idx]['endDate'] ]);

    gantt.hideText(idx == 0)
    console.log(idx, gantt.hideText)
    gantt.redraw(tasks)
}

function swapAxisModeInto(mode) {
    _taskTypes = (mode == 'Pos') ? locations : colors;
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
    Index.init();

};

function makeYearMonth(y, m) {
    return Date.UTC(y, m, 0, 0, 0)
}

gantt(tasks);
changeTime(0)