// get all categories
function getCategoryData(callback) {
  var request = new XMLHttpRequest();
  request.open("get", "/category", true);
  request.onload = function () {
    categoryArray = JSON.parse(request.responseText);
    callback(categoryArray);
  };
  request.send();
}

// display category at homepage
function insertCategoryData(categoryArray) {
  var dynamicCategory = document.getElementById("categoryGrid");
  newContent = `
    <div class='categoryItem' onclick="sortCategory(this)" categoryName="all">
      <h4>All Products</h4>
    </div>`;

  for (var i = 0; i < categoryArray.length; i++) {
    newContent += `
      <div class='categoryItem' onclick="sortCategory(this)" categoryName="${categoryArray[i].name}">
        <h4>${categoryArray[i].name}</h4>
      </div>`;
  }
  dynamicCategory.innerHTML += newContent;
  var categories = document.getElementsByClassName("categoryItem");
  categories[0].style.backgroundColor = "#e6e6e6";
}

// loads all categories to be selected when adding or updating products
function updateSelectCategory(categoryArray) {
  var select = document.getElementById("category");
  var options = "";
  for (var i = 0; i < categoryArray.length; i++) {
    options += `<option value="${categoryArray[i].name}">${categoryArray[i].name}</option>`;
  }
  select.innerHTML = options;
}

// sets url based on category
function sortCategory(item) {
  var name = item.getAttribute("categoryName");
  if (name === "all") {
    location.href = "/e_commerce.html";
  } else {
    location.href = "/e_commerce.html?category=" + name;
  }
}

// loads products to homepage based on category
function loadProductBasedCategory() {
  var params = new URLSearchParams(location.search);
  var name = params.get("category");

  var request = new XMLHttpRequest();
  request.open("get", "/sort?category=" + name, true);
  request.onload = function () {
    productArray = JSON.parse(request.responseText);
    insertProductData(productArray);
    // highlight category selected
    var categories = document.getElementsByClassName("categoryItem");

    for (var i = 0; i < categories.length; i++) {
      if (categories[i].getAttribute("categoryName") === name) {
        categories[i].style.backgroundColor = "#e6e6e6";
        break;
      } else {
        categories[i].style.background = "rgba(238, 238, 238, 0.4)";
      }
    }
  };
  request.send();
}

//convert category name to id, adds or update products correspondingly
function productCategory(action) {
  var request = new XMLHttpRequest();
  request.open("get", "/category", false);
  request.onload = function () {
    categoryArray = JSON.parse(request.responseText);
    if (action == "edit") {
      editProduct(categoryArray);
    } else if (action == "add") {
      addProduct(categoryArray);
    }
  };
  request.send();
}
