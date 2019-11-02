// Storage controller

// Item controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data structure / State
  const data = {
    items: [],
    currentItem: null,
    totalCalories: 0
  };

  // public methods
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, calories) {
      // Create ID
      let ID;
      let length = data.items.length;
      if (length) {
        ID = data.items[length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);
      // Create new item
      newItem = new Item(ID, name, calories);

      data.items.push(newItem);

      return newItem;
    },
    getItemById: function(id){
      let found = null;
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      })
      return found;
    },
    getTotalCalories: function() {
      let total = 0;
      data.items.forEach(function(item) {
        total += item.calories;
      });
      // Set total calories
      data.totalCalories = total;
      return data.totalCalories;
    },
    setCurrentItem: function(item){
      data.currentItem = item;
    },
    getCurrentItem: function(){
      return data.currentItem;
    },
    logData: function() {
      return data;
    }
  };
})();

// UI controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    backBtn: ".back-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".remove-btn",
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories",
    totalCalories: ".total-calories"
  };
  // public methods
  return {
    addListItem: function(item) {
      // Show the list
      const list = document.querySelector(UISelectors.itemList);
      // Create item list
      const li = document.createElement("li");
      list.style.display = "block";
      li.className = "collection-item";
      li.id = `item-${item.id}`;
      li.innerHTML = `
      <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content"><i class="edit-content fa fa-pencil"></i></a>
      `;
      // Insert item
      list.insertAdjacentElement("beforeend", li);
    },
    clearEditState: function(){
      UICtrl.clearInputs();
      document.querySelector(UISelectors.addBtn).style.display = "inline";
      document.querySelector(UISelectors.updateBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";

    },
    showEditState: function(){
      document.querySelector(UISelectors.addBtn).style.display = "none";
      document.querySelector(UISelectors.updateBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
    },
    clearInputs: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemCaloriesInput).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value =  ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = "none";
    },
    populateItemList: function(items) {
      let html = "";

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
				<strong>${item.name}:</strong> <em>${item.calories} Calories</em>
				<a href="#" class="secondary-content"><i class="edit-content fa fa-pencil"></i></a>
			</li>`;
      });
      // insert items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App controller
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    const UISelectors = UICtrl.getSelectors();
    // Item event
    document.querySelector(UISelectors.addBtn).addEventListener("click", addItemSubmit);
    document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick)
  };

  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-content")) {
      // Get item
      const listId = e.target.parentNode.parentNode.id;
      const itemListArr = listId.split("-");
      const id = parseInt(itemListArr[1]);
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set item 
      ItemCtrl.setCurrentItem(itemToEdit);

      UICtrl.addItemToForm();
      
    }

    e.preventDefault();
  }

  const addItemSubmit = function(e) {
    e.preventDefault();
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name && input.calories) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to the  UI
      UICtrl.addListItem(newItem);
      // Clear input fields
      UICtrl.clearInputs();
    }

    const totalCalories = ItemCtrl.getTotalCalories();

    UICtrl.showTotalCalories(totalCalories);
  };

  // public methods
  return {
    init: function() {
      // Clear edit state / set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      const totalCalories = ItemCtrl.getTotalCalories();

      UICtrl.showTotalCalories(totalCalories);

      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
