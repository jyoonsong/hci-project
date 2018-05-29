/**
* @author Dimitry Kudrayvtsev
* @version 2.1
*
* This is modified version by @Donutt,
* and you can see the original version at https://github.com/dk8996/Gantt-Chart.
*
*/

d3.gantt = function() {
  let FIT_TIME_DOMAIN_MODE = "fit";
  let FIXED_TIME_DOMAIN_MODE = "fixed";

  let margin = {
      top : 20,
      right : 40,
      bottom : 40,
      left : 20
  };

  let selector = '#chart';
  let timeDomainStart = d3.time.day.offset(new Date(),-3);
  let timeDomainEnd = d3.time.hour.offset(new Date(),+3);
  let timeDomainMode = FIT_TIME_DOMAIN_MODE;// fixed or fit
  let taskTypes = [];
  let taskStatus = [];
  let hideText = false
  let currentTaskMode = '';
  let taskAvailableMode = ['Pos', 'Color'];
  let height = document.body.clientWidth - margin.top - margin.bottom - 5;
  let width = document.body.clientWidth - margin.right - margin.left-5;

  let tickFormat = "%H:%M";

  let dateFormat = function(s, e) {
    let start = new Date(s);
    let end = new Date(e);
    return start.getFullYear() + "년 " + (start.getMonth() + 1) + "월" + " - " + end.getFullYear() + "년 " + (end.getMonth() + 1) + "월";
  }

  let keyFunction = function(d) {
      return d.startDate + getYAxisValue(d) + d.endDate;
  };

  let rectTransform = function(d) {
      return "translate(" + x(d.startDate) + "," + y(getYAxisValue(d)) + ")";
  };

  let getYAxisValue = function(d) {
      if (currentTaskMode == 'Pos') {
          return d.location
      } else {
          return d.color
      }
  };

  let x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);
  let x_text = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(true);

  let y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);

  let xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
      .tickSize(8).tickPadding(8);

  let x2Axis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(true)
      .tickSize(8).tickPadding(8);

  let yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  let initTimeDomain = function(tasks) {
      if (timeDomainMode === FIT_TIME_DOMAIN_MODE) {
          if (tasks === undefined || tasks.length < 1) {
              timeDomainStart = d3.time.day.offset(new Date(), -3);
              timeDomainEnd = d3.time.hour.offset(new Date(), +3);
              return;
          }

          tasks.sort(function(a, b) {
              return a.endDate - b.endDate;
          });
          timeDomainEnd = tasks[tasks.length - 1].endDate;

          tasks.sort(function(a, b) {
              return a.startDate - b.startDate;
          });
          timeDomainStart = tasks[0].startDate;
      }
  };

  let initAxis = function() {
      x = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, 1800 ]).clamp(true);
      y = d3.scale.ordinal().domain(taskTypes).rangeRoundBands([ 0, height - margin.top - margin.bottom ], .1);
      x_text = d3.time.scale().domain([ timeDomainStart, timeDomainEnd ]).range([ 0, width ]).clamp(false);

      xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat))
          .tickSize(5).tickPadding(8).ticks(d3.time.months);

      x2Axis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format("%Y")).tickSubdivide(true)
          .tickSize(3).tickPadding(8).ticks(d3.time.years, 1);

      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);
  };

  function gantt(tasks) {

      initTimeDomain(tasks);
      initAxis();

      let svg = d3.select(selector)
          .append("div")
          .attr("class", "scrollable")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("svg")
          .attr("class", "chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("class", "gantt-chart")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

      // node
      node = svg.selectAll(".chart")
          .data(tasks, keyFunction).enter()
          .append("g").attr("id", function(d, i) { return "rect" + i })
          .append("rect")
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("class", function(d){
              if(taskStatus[d.status] == null){ return "bar";}
              return "node " + taskStatus[d.status];
          })
          .attr("y", 0)
          // data to parse
          .attr("data-name", function(d) {
            return d.data.orgName;
          })
          .attr("data-date", function(d) {
            return dateFormat(d.startDate, d.endDate);
          })
          .attr("data-description", function(d) {
            return d.data.orgDescription;
          })
          .attr("data-events", function(d) {
            let events = "";
            d.data.orgEvent.forEach( function(e, i) {
              events += ("<b>" + e.name + "</b><small>" + dateFormat(e.startDate, e.endDate) + "</small>,");
            });
            if (d.data.orgEvent.length > 0)
              events = events.slice(0, -1);
            return events;
          })
          // transform
          .attr("transform", rectTransform)
          .attr("height", function(d) { return y.rangeBand(); })
          .attr("width", function(d) {
              return Math.max(1,(x(d.endDate) - x(d.startDate)));
          });

      tasks.forEach(function (task, i){
          color = task.color
          console.log(color)
          svg.select("#rect"+i).selectAll(".subnode")
              .data(task.data.orgEvent).enter()
              .append("rect")
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("class", "subnode")
              .attr("y", 0)
              .attr("transform", function(d) {
                  x_val = x(d.startDate);
                  y_val = y(getYAxisValue(task)) + 5;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .transition()
              .attr("height", function(d) { return y.rangeBand() - 10; })
              .attr("width", function(d) {
                  return Math.max(1,(x(d.endDate) - x(d.startDate)));
              })

          svg.select("#rect"+i).selectAll("text")
              .data(task.data.orgEvent).enter()
              .append('text')
              .attr('class', function() {
                  if (hideText)
                      return 'subnode txt hidden'
                  else
                      return 'subnode txt'
              })
              .attr("x", 0)
              .attr("y", ".35em")
              .attr("transform", function(d) {
                  x_val = x_text(d.startDate);
                  y_val = y(getYAxisValue(task)) - 10;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .text(function (d) {
                  return d.name;
              });
      })

      svg.append("g")
          .attr("class", "x2 axis")
          .attr("transform", "translate(0, " + (height) + ")")
          .transition()
          .call(xAxis);

      return gantt;

  };

  gantt.redraw = function(tasks) {

      initTimeDomain(tasks);
      initAxis();

      let svg = d3.select(".chart");

      let ganttChartGroup = svg.select(".gantt-chart");
      let rect = ganttChartGroup.selectAll("rect").data(tasks, keyFunction);

      rect.enter()
          .append("g").attr("id", function(d, i) { return "rect"+i; })
          .insert("rect", ":first-child")
          .attr("rx", 5)
          .attr("ry", 5)
          .attr("class", function(d){
              if(taskStatus[d.status] == null){ return "bar";}
              return "node " + taskStatus[d.status];
          })
          // data to parse
          .attr("data-name", function(d) {
            return d.data.orgName;
          })
          .attr("data-date", function(d) {
            return dateFormat(d.startDate, d.endDate);
          })
          .attr("data-description", function(d) {
            return d.data.orgDescription;
          })
          .attr("data-events", function(d) {
            let events = "";
            d.data.orgEvent.forEach( function(e, i) {
              events += ("<b>" + e.name + "</b><small>" + dateFormat(e.startDate, e.endDate) + "</small>,");
            });
            if (d.data.orgEvent.length > 0)
              events = events.slice(0, -1);
            return events;
          })
          // transform
          .attr("y", 0)
          .attr("transform", rectTransform)
          .transition()
          .attr("height", function(d) { return y.rangeBand(); })
          .attr("width", function(d) {
              return Math.max(1,(x(d.endDate) - x(d.startDate)));
          });

      // ganttChartGroup
      //     .attr("transform", rectTransform)
      //     .attr("height", function(d) { return y.rangeBand(); })
      //     .attr("width", function(d) {
      //         return Math.max(0,(x(d.endDate) - x(d.startDate)));
      //     });

      tasks.forEach(function (task, i){
          color = task.color

          rect = svg.select("#rect"+i)

          rect.selectAll(".subnode")
              .data(task.data.orgEvent).enter()
              .append("rect")
              .attr("rx", 5)
              .attr("ry", 5)
              .attr("class", "subnode")
              .attr("y", 0)
              .attr("transform", function(d) {
                  x_val = x(d.startDate);
                  y_val = y(getYAxisValue(task)) + 5;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .transition()
              .attr("height", function(d) { return y.rangeBand() - 10; })
              .attr("width", function(d) {
                  return Math.max(0,(x(d.endDate) - x(d.startDate)));
              })

          rect.selectAll("text")
              .data(task.data.orgEvent).enter()
              .append('text')
              .attr('class', function() {
                  if (hideText)
                      return 'subnode txt hidden'
                  else
                      return 'subnode txt'
              })
              // .attr('text-anchor', 'middle')
              .attr("x", 0)
              .attr("y", ".35em")
              .attr("transform", function(d) {
                  x_val = x_text(d.startDate);
                  y_val = y(getYAxisValue(task)) - 10;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .text(function (d) {
                  return d.name;
              });

          rect.selectAll("rect")
              .attr("transform", rectTransform)
              .transition()
              .attr("height", function(d) { return y.rangeBand(); })
              .attr("width", function(d) {
                  return Math.max(0,(x(d.endDate) - x(d.startDate)));
              });

          rect.selectAll("rect.subnode")
              .transition()
              .attr("transform", function(d) {
                  x_val = x(d.startDate);
                  y_val = y(getYAxisValue(task)) + 5;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .attr("height", function(d) { return y.rangeBand() - 10; })
              .attr("width", function(d) {
                  return Math.max(0,(x(d.endDate) - x(d.startDate)));
              });

          rect.selectAll("text.subnode")
              .transition()
              .attr('class', function() {
                  if (hideText)
                      return 'subnode txt hidden'
                  else
                      return 'subnode txt'
              })
              .attr("transform", function(d) {
                  x_val = x_text(d.startDate);
                  y_val = y(getYAxisValue(task)) - 10;
                  return "translate(" + x_val + "," + y_val + ")";
              })
              .attr("height", function(d) { return y.rangeBand() - 10; })
              .attr("width", function(d) {
                  return Math.max(0,(x(d.endDate) - x(d.startDate)));
              });

      })

      // svg.select(".x").transition().call(xAxis);
      svg.select(".x2").transition().call(x2Axis);
      // svg.select(".y").transition().call(yAxis);

      return gantt;
  };

  gantt.margin = function(value) {
      if (!arguments.length)
          return margin;
      margin = value;
      return gantt;
  };

  gantt.timeDomain = function(value) {
      if (!arguments.length)
          return [ timeDomainStart, timeDomainEnd ];
      timeDomainStart = +value[0], timeDomainEnd = +value[1];
      return gantt;
  };

  /**
   * @param {string}
   *                vale The value can be "fit" - the domain fits the data or
   *                "fixed" - fixed domain.
   */
  gantt.timeDomainMode = function(value) {
      if (!arguments.length)
          return timeDomainMode;
      timeDomainMode = value;
      return gantt;

  };

  gantt.taskTypes = function(value) {
      if (!arguments.length)
          return taskTypes;
      taskTypes = value;
      return gantt;
  };

  gantt.currentTaskMode = function(value) {
      if (!arguments.length)
          return currentTaskMode;

      if (!taskAvailableMode.includes(value))
          throw value + " is not available mode."
      currentTaskMode = value
      return gantt
  }

  gantt.taskStatus = function(value) {
      if (!arguments.length)
          return taskStatus;
      taskStatus = value;
      return gantt;
  };

  gantt.width = function(value) {
      if (!arguments.length)
          return width;
      width = +value;
      return gantt;
  };

  gantt.height = function(value) {
      if (!arguments.length)
          return height;
      height = +value;
      return gantt;
  };

  gantt.tickFormat = function(value) {
      if (!arguments.length)
          return tickFormat;
      tickFormat = value;
      return gantt;
  };

  gantt.selector = function(value) {
      if (!arguments.length)
          return selector;
      selector = value;
      return gantt;
  };

  gantt.hideText = function(value) {
      if (!arguments.length)
          return hideText;
      hideText = value
      return gantt
  }

  return gantt;
};