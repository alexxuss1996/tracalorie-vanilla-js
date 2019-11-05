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
    updateItem: function (name, calories) {
       calories = parseInt(calories);

       let found = null;
       data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function (id) { 
      const ids = data.items.map(function(item) {
        return item.id;
      });

      const index = ids.indexOf(id);
      // delete item
      data.items.splice(index, 1);
    },
    logData: function() {
      return data;
    },
    clearItems: function () {
      data.items = [];
    }
  };
})();

// UI controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: "#item-list",
    listItems: "#item-list li",
    addBtn: ".add-btn",
    backBtn: ".back-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".remove-btn",
    clearBtn: ".clear-btn",
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
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);
      //Into  arr
      listItems = Array.from(listItems);
      
      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute("id");
        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
          <strong>${item.name}:</strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content"><i class="edit-content fa fa-pencil"></i></a>
          `;
        }
      });
    },
    deleteListItem: function(id) {
      const itemID = `#item-${id}`;
      const list = document.querySelector(UISelectors.itemList);
      const item = document.querySelector(itemID);
      list.removeChild(item);
      if(list.childElementCount === 0) {
        UICtrl.hideList();
      }
    },
    removeAllItems: function() {
      let items = document.querySelector(UISelectors.listItems);
      // Convert to Array
      items = Array.from(items);
      items.forEach(function(item) {
        item.remove();
      });
      UICtrl.hideList();
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
  document.querySelector(UISelectors.addBtn).addEventListener("click", itemAddSubmit);
  document.querySelector(UISelectors.deleteBtn).addEventListener("click", itemDeleteSubmit);
  document.querySelector(UISelectors.backBtn).addEventListener("click", UICtrl.clearEditState());
  document.querySelector(UISelectors.updateBtn).addEventListener("click", itemUpdateSubmit);
  document.querySelector(UISelectors.itemList).addEventListener("click", itemEditClick);
  document.querySelector(UISelectors.clearBtn).addEventListener("click", clearAllItemsClick);
  document.addEventListener("keypress", function (e) {
    if (e.keyCode === 13 || e.which === 13) {
      e.preventDefault();
      return false;
    }
  })
};


  // Event listeners
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
  };

  const itemAddSubmit = function(e) {
    // Get form input from UI controller
    const input = UICtrl.getItemInput();
    // Check for name and calories input
    if (input.name && input.calories) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add Item to the  UI
      UICtrl.addListItem(newItem);
      // Clear input fields
      UICtrl.clearInputs();
    } else {
      // Materialize toast
      M.toast({html: "Please, enter all fields!", classes: "red"})
    }
    const totalCalories = ItemCtrl.getTotalCalories();
    
    UICtrl.showTotalCalories(totalCalories);
    e.preventDefault();
  };

  const itemUpdateSubmit = function (e) {
    // get input 
    const input = UICtrl.getItemInput();
    // Update input 
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
    UICtrl.updateListItem(updatedItem);
    // Clear Edit state and inputs
    UICtrl.clearEditState();
    UICtrl.clearInputs();
    // Update calories state 
    const totalCalories = ItemCtrl.getTotalCalories();
    
    UICtrl.showTotalCalories(totalCalories);
    
    e.preventDefault();
  };

  const itemDeleteSubmit = function(e) {
    const currentItem = ItemCtrl.getCurrentItem();
    // Delete from the data structure
    ItemCtrl.deleteItem(currentItem.id);
    
    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    
    // Update calories state 
    const totalCalories = ItemCtrl.getTotalCalories();
    
    UICtrl.showTotalCalories(totalCalories);
    
    // Clear Edit state and inputs
    UICtrl.clearEditState();
    UICtrl.clearInputs();
  
    e.preventDefault();
  }; 
  
  clearAllItemsClick = function (e) {
    ItemCtrl.clearItems();
    UICtrl.removeAllItems();
    // Update calories state 
    const totalCalories = ItemCtrl.getTotalCalories();
    
    UICtrl.showTotalCalories(totalCalories);
    // Clear Edit state and inputs
    UICtrl.clearEditState();
    e.preventDefault();
  }
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
