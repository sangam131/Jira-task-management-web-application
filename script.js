let addbtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".modal-cont");
let taskAreaCont = document.querySelector(".textArea");
let addmodal = true;
let mainContent = document.querySelector(".main-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
var uid = new ShortUniqueId();
let ToolBoxcolor = document.querySelectorAll(".color")
let removeFlag = false;
let removeBtn = document.querySelector(".remove-btn");
let colors = ['lightpink', 'green', 'black', 'blue'];
let modalPrioritycolor = 'black';
addbtn.addEventListener("click", function () {
  if (addmodal)
    modalCont.style.display = "flex";
  else
    modalCont.style.display = "none"

  addmodal = !addmodal;
})



let ticketArr = [];

if(localStorage.getItem("tickets"))
{
  let str = localStorage.getItem("tickets");
  let arr = JSON.parse(str);
  ticketArr = arr;
  for(let i=0;i<arr.length;i++){
     let ticketObj = arr[i];
  CreateTicket(ticketObj.color,ticketObj.task,ticketObj.id);
}
}

// for(let i=0;i<ticketArr.length;i++)
// {
//   CreateTicket(ticketArr[i].color,ticketArr[i].task,ticketArr[i].id);
// }
for (let i = 0; i < ToolBoxcolor.length; i++) {
  ToolBoxcolor[i].addEventListener("click", function () {
    let currentcolor = ToolBoxcolor[i].classList[1];
    let filteredArr = [];
    for (let i = 0;i < ticketArr.length; i++) {
      if (ticketArr[i].color == currentcolor) {
        filteredArr.push(ticketArr[i]);
      }
    }

    //console.log(filteredArr);
    let allTickets = document.querySelectorAll(".ticket-cont");
    for (let j = 0; j < allTickets.length; j++) {
      allTickets[j].remove();
    }
    for (let j = 0; j < filteredArr.length; j++) {
      let ticket = filteredArr[j];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      CreateTicket(color, task, id)
    }
  })

  ToolBoxcolor[i].addEventListener("dblclick",function(){
    let allTickets=document.querySelectorAll(".ticket-cont");
    for(let j=0;j<allTickets.length; j++)
    {
      allTickets[j].remove();
    }
    for (let j = 0; j < ticketArr.length; j++) {
      let ticket = ticketArr[j];
      let color = ticket.color;
      let task = ticket.task;
      let id = ticket.id;
      CreateTicket(color, task, id)
    }
  })
}


for (let i = 0; i < allPriorityColor.length; i++) {
  let PriorityDivonecolor = allPriorityColor[i];
  PriorityDivonecolor.addEventListener("click", function () {
    for (let j = 0; j < allPriorityColor.length; j++) {
      allPriorityColor[j].classList.remove("active");
    }
    PriorityDivonecolor.classList.add("active");
    modalPrioritycolor = PriorityDivonecolor.classList[0];
  })
}

modalCont.addEventListener("keydown", function (e) {
  // console.log(e);
  let key = e.key;
  if (key == "Enter") {
    CreateTicket(modalPrioritycolor, taskAreaCont.value);
    taskAreaCont.value = "";
    modalCont.style.display = "none";
    addmodal = !addmodal;
  }
})

removeBtn.addEventListener("click", function () {
  if (removeFlag) {
    removeBtn.style.color = 'black';
  }
  else {
    removeBtn.style.color = 'red';
  }
  removeFlag = !removeFlag;
})

function CreateTicket(ticketColor, task, ticketid) {
  let id;
  if (ticketid == undefined) {
    id = uid();
  }
  else {
    id = ticketid;
  }



  // <div class="ticket-cont">
  //   <div class="ticket-color"></div>
  //   <div class="ticket-id">#q800ak</div>
  //   <div class="task-area">some task</div>
  // </div> 

  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                      <div class="ticket-id">#${id}</div>
                      <div class="task-area">${task}</div>
                      <div class="lock-unlock"><i class="fa fa-lock"></i></div>`
  mainContent.append(ticketCont);
  //lock-unlock handle
  let lockBtnCont = ticketCont.querySelector(".lock-unlock i");
  let ticketTaskArea = ticketCont.querySelector(".task-area");
  lockBtnCont.addEventListener("click", function () {
    if (lockBtnCont.classList.contains("fa-lock")) {
      lockBtnCont.classList.remove("fa-lock");
      lockBtnCont.classList.add("fa-unlock");
      ticketTaskArea.setAttribute("contenteditable", "true");
    }
    else {
      lockBtnCont.classList.remove("fa-unlock");
      lockBtnCont.classList.add("fa-lock");
      ticketTaskArea.setAttribute("contenteditable", "false");
    }

    //unlock k baad ui m changes toh changes reflect in array also
    let ticketIdx=getTicketIdx(id);
    ticketArr[ticketIdx].task = ticketTaskArea.textContent;
    updateLocalStorage();
  })

  //handling delete
  ticketCont.addEventListener("click", function () {
    if (removeFlag) {
      //update ui
      ticketCont.remove();
      //update array
      let ticketIdx=getTicketIdx(id);
      ticketArr.splice(ticketIdx,1);
      updateLocalStorage();
    }
  })

  //handling color change //update ui
  let ticketColorBand = ticketCont.querySelector(".ticket-color");
  ticketColorBand.addEventListener("click", function () {
    let currentTicketColor = ticketColorBand.classList[1];
    let currentTicketColorIdx = -1;
    for (let i = 0; i < colors.length; i++) {
      if (currentTicketColor == colors[i]) {
        currentTicketColorIdx = i;
        break;
      }
    }
    let nextcolorIdx = (currentTicketColorIdx + 1) % colors.length;
    let nextColor = colors[nextcolorIdx];
    ticketColorBand.classList.remove(currentTicketColor);
    ticketColorBand.classList.add(nextColor);

    //update ticketArr as well if we change the color then its ticketColorBand also change
    let ticketIdx=getTicketIdx(id);
    ticketArr[ticketIdx].color=nextColor;
    updateLocalStorage();
  })

  if(ticketid==undefined)
   ticketArr.push({"color":ticketColor,"task":task,"id":id});
   updateLocalStorage();
   console.log(ticketArr);
}

//function ticket id
function getTicketIdx(id)
{
  for(let i=0;i< ticketArr.length; i++){
    if(ticketArr[i].id==id)
    {
      return i;
    }
  }
}

function updateLocalStorage(){
  let stringifyArr = JSON.stringify(ticketArr);
  localStorage.setItem("tickets",stringifyArr);
}