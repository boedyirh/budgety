//BUDGET Controller
var budgetController = (function () {
  //Code here
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    //Code here
    var sum = 0;
    data.allItems[type].forEach(function(cur){
      sum = sum + cur.value;

    });
    data.totals[type]= sum;
    /*


    */
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget:0,
    percentage:-1,
  };

  return {
    addItem: function (type, des, val) {
      //Code here
      var newItem, ID;
      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on inc or exp type  
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //push it into our data structure
      data.allItems[type].push(newItem);
      //Return the new element
      return newItem;
    },
    calculateBudget: function () {
      //Code here
      //1. Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      //2. Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //3. Calculate the percentage of income that we spent = total expenses/total income
      if(data.totals.inc>0){
        data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
      }
      else {
        data.percentage = -1;
      }
    },
    getBudget:function(){
      return{
        budget:data.budget,
        totalInc:data.totals.inc,
        totalExp:data.totals.exp,
        percentage:data.percentage
      };
    },
    testing: function () {
      console.log(data);
    },
  };
})();

//UI Controller================================================================================
var UIController = (function () {
  //Code Here
  var DOMStrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMStrings.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      var html, newHtml;
      //Create HTML String with placeholder text
      if (type === "inc") {
        element = DOMStrings.incomeContainer;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMStrings.expensesContainer;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // Replace placeholder text with some actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", obj.value);

      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    clearFields: function () {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + "," + DOMStrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function (current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },

    getDOMstrings: function () {
      return DOMStrings;
    },
  };
})();

//Global App Controller
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListener = function () {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        ctrlAddItem();
      }
    });
  };

  var updateBudget = function () {
    //Code here
    //1 . Calculate the budget
    budgetCtrl.calculateBudget();
    //2.  return the budget
    var budget= budgetCtrl.getBudget();
    //3. Display the budget in UI
    console.log(budget);
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1. Get the field input data
    input = UICtrl.getInput();
    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // console.log(input.description);

      //2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear the fields
      UICtrl.clearFields();

      //5. Calculate and update the budget 
      updateBudget();

      
    }
  };
  //Code here
  return {
    init: function () {
      console.log("Application has started.");
      setupEventListener();
    },
  };
})(budgetController, UIController);

controller.init();
