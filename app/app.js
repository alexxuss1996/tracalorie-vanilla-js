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
    items: [
      { id: 0, name: "Steak", calories: 1200 },
      { id: 1, name: "Cookie", calories: 400 },
      { id: 2, name: "Eggs", calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  // public methods
  return {
    getItems: function() {
      return data.items;
		},
		addItem: function (name, calories) {
			// Create ID
			let ID;
			let length = data.items.length;
			if (length) {
				ID = data.items[length - 1].id + 1;
			} else {
				ID = 0;
			}

			// Calories to number
			calories = parseInt(calories)
			// Create new item
			newItem = new Item(ID, name, calories)

			data.items.push(newItem);

			return newItem;
			
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
    itemNameInput: "#item-name",
    itemCaloriesInput: "#item-calories"
  };
  // public methods
  return {
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
  };

  const addItemSubmit = function(e) {
    e.preventDefault();
    // Get form input from UI controller
    const input = UICtrl.getItemInput();

    // Check for name and calories input
    if (input.name && input.calories) {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
    } 
  };

  // public methods
  return {
    init: function() {
      // Fetch items from data structure
      const items = ItemCtrl.getItems();
      // Populate item list
      UICtrl.populateItemList(items);

      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
