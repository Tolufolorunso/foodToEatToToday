// "use strict";
const hour = document.querySelector("#hour");
const minute = document.querySelector("#min");
const second = document.querySelector("#sec");
const time = document.querySelector("#time");

function timeSetUP() {
  const now = new Date();
  let hrs = now.getHours();
  let min = now.getMinutes();
  let sec = now.getSeconds();
  let ap = "AM";
  if (hrs > 11) ap = "PM";
  if (hrs > 12) hrs = hrs - 12;
  if (hrs === 0) hrs = 12;
  // if (hrs < 10) hrs = 12;
  return {
    hrs,
    ap,
    min,
    sec,
  };
}

const form = document.querySelector("#food-detail");
form.addEventListener("submit", getDataFromUI);
document.querySelector("#clear-storage").addEventListener("click", () => {
  localStorage.clear("foodObj");
});

function getDataFromUI(e) {
  e.preventDefault();
  let foodName = document.querySelector("#food-name").value;
  let foodType = form.querySelector("#food-type").value;
  if (foodName === "" || foodType === "") {
    alert("You need to add Something");
    return;
  }
  let foodTimeTable = { foodName, foodType };
  addFoodTimeTableToStorage(foodTimeTable);
  document.querySelector("#food-name").value = "";
}

const getTime = () => {
  let { hrs, min, sec, ap } = timeSetUP();
  sec = sec < 10 ? "0" + sec : sec;
  min = min < 10 ? "0" + min : min;
  hour.innerHTML = `${hrs} <span>HRS</span>`;
  minute.innerHTML = `${min} <span>MIN</span>`;
  second.innerHTML = `${sec} <span>SEC</span>`;
  time.innerHTML = `${hrs}<small>${ap}</small>`;
};

const timeToEat = () => {
  const dataFromDB = getFoodTimeTablefromStorage();

  let { hrs, ap } = timeSetUP();
  let imgUrl;
  let foodType;
  let foodName;
  const dbData = dataFromDB.filter((item) => {
    if (hrs == 9 && ap == "AM" && item.foodType == "Breakfast") {
      foodType = item.foodType;
      foodName = item.foodName;
      imgUrl = "images/bg.jpg";
      return { foodType, foodName, imgUrl };
    } else if (hrs == 2 && ap == "PM" && item.foodType == "Lunch") {
      foodType = item.foodType;
      foodName = item.foodName;
      return { foodType, foodName };
    } else if (hrs == 8 && ap == "PM" && item.foodType == "Dinner") {
      foodType = item.foodType;
      foodName = item.foodName;
      return { foodType, foodName };
    }
  });

  htmlTemplate(dbData);
};

const htmlTemplate = (dbData) => {
  let imgUrl;
  let foodType;
  let foodName;
  if (dbData.length) {
    foodType = dbData[0].foodType;
    foodName = dbData[0].foodName;
    if (foodType === "Breakfast") {
      imgUrl = "images/bg.jpg";
    }
    if (foodType === "Lunch") {
      imgUrl = "images/wedding.jpg";
    }
    if (foodType === "Dinner") {
      imgUrl = "images/picture-136.png";
    }
  }

  const altForFoodType = "Coding";
  const altForFoodName = "nothing for now. I'm on my Laptop, coding";
  const baseImgUrl = "images/npmissue.png";

  const result = document.querySelector(".image-container");
  const div = document.createElement("div");
  div.innerHTML = `
        <h3>${foodType || altForFoodType} Time</h3>
        <p><b>I am eating ${foodName || altForFoodName}</b></p>
       <img src="${imgUrl || baseImgUrl}" alt="">

    `;
  return result.appendChild(div);
};

//Local storage
const addFoodTimeTableToStorage = (obj) => {
  const timeTableDB = getFoodTimeTablefromStorage();

  for (let i = 0; i < timeTableDB.length; i++) {
    if (timeTableDB[i].foodType === obj.foodType) {
      alert(`${obj.foodType} is already exists in DB`);
      return "hello";
    }
  }

  timeTableDB.push(obj);

  localStorage.setItem("foodObj", JSON.stringify(timeTableDB));
};

//Get Food time table from storage
const getFoodTimeTablefromStorage = () => {
  let foodObj;
  const LS = localStorage.getItem("foodObj");

  if (LS === null) {
    foodObj = [];
  } else {
    foodObj = JSON.parse(LS);
  }
  return foodObj;
};

timeToEat();
setInterval(getTime, 1000);
