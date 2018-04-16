// TaskManager - SPA Version
// J. Femister

const express = require("express");
const path = require("path");
const logger = require("morgan");

let app = express();

app.use(logger("dev"));

let publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

let tasks = {};
let nextid = 0;

function returnTasks(res) {
  let tasklist = [];
  for (t in tasks) {
    let task = tasks[t];
    tasklist.push(task)
  }
  const ret = JSON.stringify(tasklist);
  res.end(ret);
}

app.get("/load", (req, res) => {
  returnTasks(res);
});

app.get("/add", (req, res) => {
  const desc = req.query.desc;
  const ttype = req.query.ttype;
  const ddate = req.query.ddate;
  const id = "task" + ++nextid;
  const task = new Task(id, desc, ttype, ddate);
  tasks[id] = task;
  returnTasks(res);
});

app.get("/delete", (req, res) => {
  const taskids = req.query.taskids;
  taskids.forEach( (taskid, index) => { delete tasks[taskid]; });
  returnTasks(res);
});

app.listen(3000, () => console.log("Starting up Task Manager - SPA/Ajax Version"));

class Task {
  constructor(id, desc, ttype, ddate) {
    this.id = id;
    this.desc = desc;
    this.ttype = ttype;
    this.ddate = ddate;
  }
}