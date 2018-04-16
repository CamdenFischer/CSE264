function loadTaskRows(tasks) {
  $("#taskrows").empty();
  tasks.forEach((task, index) => { $("#taskrows").append(`<tr><td><input type="checkbox" id="${task.id}"/></td><td>${task.desc}</td><td>${task.ttype}</td><td>${task.ddate}</td></tr>`) });
}

$("#add").click(() => {
  $.ajax(
    "/add",
    {
      type: "GET",
      processData: true,
      data: {
        desc: $("#desc").val(),
        ttype: $("#ttype").val(),
        ddate: $("#ddate").val()
      },
      dataType: "json",
      success: function (tasks) {
        loadTaskRows(tasks);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error: " + jqXHR.responseText);
        alert("Error: " + textStatus);
        alert("Error: " + errorThrown);
      }
    }
  );
  $("#desc").val("");
  $("#ddate").val("");
});

$("#delete").click(() => {
  let taskidlist = [];
  $("input:checked").each((index,obj) => taskidlist.push(obj.id));
  $.ajax(
    "/delete",
    {
      type: "GET",
      processData: true,
      data: {
        taskids: taskidlist
      },
      dataType: "json",
      success: function (tasks) {
        loadTaskRows(tasks);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error: " + jqXHR.responseText);
        alert("Error: " + textStatus);
        alert("Error: " + errorThrown);
      }
    }
  );
});

$(() => {
  $("#ddate").datepicker();
  $.ajax(
    "/load",
    {
      type: "GET",
      dataType: "json",
      success: function (tasks) {
        loadTaskRows(tasks);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Error: " + jqXHR.responseText);
        alert("Error: " + textStatus);
        alert("Error: " + errorThrown);
      }
    }
  );  
});
