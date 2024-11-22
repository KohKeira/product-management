// get product information based on id
function loadProductDetails(formType = null) {
  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  var urlLink = "/product/" + id;

  var request = new XMLHttpRequest();
  request.open("get", urlLink, true);

  request.onload = function () {
    var product = JSON.parse(request.responseText);
    setProductDetail(product[0], formType);
  };
  request.send();
}

// fills up form with product information
function setProductDetail(product, formType) {
  document.getElementById("id").value = product.id;
  document.getElementById("name").value = product.name;
  document.getElementById("description").value = product.description;
  document.getElementById("price").value = product.price;
  document.getElementById("category").value = product.category;
  document.getElementById("imagePath").value = product.picture;
  document.getElementById("productImage").src = product.picture;
  document.getElementById("productImage").onload = null;

  //stores initial product info
  document.getElementById("name").setAttribute("preVal", product.name);
  document
    .getElementById("description")
    .setAttribute("preVal", product.description);
  document.getElementById("price").setAttribute("preVal", product.price);
  document.getElementById("category").setAttribute("preVal", product.category);
  document
    .getElementById("imagePath")
    .setAttribute("preVal", product.imagePath);

  if (formType == "edit") {
    document.getElementById("countDescription").innerHTML =
      product.description.length + "/200";
    document.getElementById("countImagePath").innerHTML =
      product.picture.length + "/200";
    document.getElementById("countName").innerHTML =
      product.name.length + "/100";

    var backLink = document.getElementById("backLink");

    backLink.setAttribute("href", "/view_product.html?id=" + product.id);
  } else if (formType == "view") {
    var categoryLink = document.getElementById("categoryLink");
    categoryLink.setAttribute(
      "href",
      "/e_commerce.html?category=" + product.category
    );
    categoryLink.innerHTML = "View " + product.category;
  }
}

// set url to view specific product
function seeProduct(item) {
  var id = item.getAttribute("productId");
  location.href = "/view_product.html?id=" + id;
}

// create product object
function createProduct(categoryArray) {
  var product = new Object();

  product.id = document.getElementById("id").value;
  product.name = document.getElementById("name").value;
  product.description = document.getElementById("description").value;
  product.price = document.getElementById("price").value;
  product.picture = document.getElementById("imagePath").value;
  var categoryName = document.getElementById("category").value;

  // find id of cateogry
  for (var category of categoryArray) {
    if (category.name === categoryName) {
      product.category_id = category.id;
      break;
    }
  }
  return product;
}

// validate product infomation for update and insert
function validate(action) {
  img = document.getElementById("productImage");
  img.onload = function () {
    if (img.src.includes("Images/Sample.jpg") == false) {
      productCategory(action);
      return;
    }
  };
  var form = document.getElementById("productForm");
  if (form.reportValidity() == false) {
    return false;
  }
  if (previewImage() == false) {
    return;
  }
}

// add product infomation
function addProduct(categoryArray) {
  if (window.confirm("Add Product?") == false) {
    return;
  }
  window.removeEventListener("beforeunload", leaveAddPage);

  var product = createProduct(categoryArray);

  var request = new XMLHttpRequest();
  request.open("post", "/product", true);
  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    result = JSON.parse(request.responseText);
    alert(result["message"]);

    location.href = "/e_commerce.html";
  };
  request.send(JSON.stringify(product));
}

// edit product infomation
function editProduct(categoryArray) {
  // confirm action
  if (window.confirm("Update Product?") == false) {
    return;
  }
  window.removeEventListener("beforeunload", leaveEditPage);

  var product = createProduct(categoryArray);
  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  var urlLink = "/product/" + id;

  var request = new XMLHttpRequest();
  request.open("put", urlLink, true);
  request.setRequestHeader("Content-Type", "application/json");

  request.onload = function () {
    alert(request.responseText);
    location.href = "/view_product.html?id=" + id;
  };
  request.send(JSON.stringify(product));
}
function edit() {
  var id = document.getElementById("id").value;
  location.href = "/edit_product.html?id=" + id;
}

// delete product
function deleteProduct() {
  // confirm action
  if (window.confirm("Delete Product?") == false) {
    return;
  }
  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  var urlLink = "/product/" + id;

  var request = new XMLHttpRequest();
  request.open("delete", urlLink, true);

  request.onload = function () {
    alert(request.responseText);
    location.href = "/e_commerce.html";
  };
  request.send();
}
// validate image path and preview image
function previewImage() {
  imgPath = document.getElementById("imagePath").value;
  img = document.getElementById("productImage");
  if (imgPath === "./Images/") {
    alert("Please enter the image name");
    img.src = "./Images/Sample.jpg";

    return false;
  }
  imgFormat = imgPath.split(".")[2];
  if (
    ["png", "jpg", "gif", "jpeg"].includes(imgFormat.toLowerCase()) == false
  ) {
    alert("Please enter a valid image file type (png, jpg, jpeg, gif)");
    img.src = "./Images/Sample.jpg";

    return false;
  } else {
    img.src = imgPath;
  }
}
// check if image exist in image folder
function imageError() {
  alert("Image does not exist in Images Folder");
  img = document.getElementById("productImage");
  img.src = "./Images/Sample.jpg";
  return false;
}

// search when using press enter
function key_down(e) {
  if (e.keyCode === 13) {
    search();
  }
}

function search() {
  searchValue = document.getElementById("searchInput").value;
  if (searchValue == "") {
    return;
  }
  location.href = "/e_commerce.html?search=" + searchValue;
}

function getSearchResult() {
  var params = new URLSearchParams(location.search);
  var keyword = params.get("search");
  var urlLink = "/search?keyword=" + keyword;

  var request = new XMLHttpRequest();
  request.open("get", urlLink, true);
  request.onload = function () {
    productArray = JSON.parse(request.responseText);
    insertProductData(productArray);
  };
  request.send();
}

// count characters in input
function countChar(item, max, id) {
  var char = item.value.length;

  document.getElementById(id).innerHTML = char + "/" + max;
  if (char == max) {
    document.getElementById(id).style.color = "red";
  } else {
    document.getElementById(id).style.color = "black";
  }
}

// fixed image path
function fixedPath() {
  uploadImg = document.getElementById("file-input");
  uploadImg.addEventListener("change", () => {
    if (uploadImg.files.length == 1) {
      fileName = uploadImg.files[0].name;
      document.getElementById("imagePath").value = "./Images/" + fileName;
      console.log(document.getElementById("imagePath").value);
      previewImage();
    }
  });
  var input = document.getElementById("imagePath");

  input.addEventListener("keydown", function () {
    var oldVal = this.value;
    var field = this;

    setTimeout(function () {
      if (field.value.indexOf("./Images/") !== 0) {
        field.value = oldVal;
      }
    }, 1);
  });
}

function leaveAddPage(e) {
  nameInput = document.getElementById("name").value;
  description = document.getElementById("description").value;
  price = document.getElementById("price").value;
  category = document.getElementById("category").value;
  picture = document.getElementById("imagePath").value;
  if (
    nameInput !== "" ||
    description !== "" ||
    price !== "" ||
    category !== "Computers" ||
    picture !== "./Images/"
  ) {
    e.preventDefault();
    e.returnValue = "";
  } else {
    window.removeEventListener("beforeunload", leaveAddPage);
  }
}

function leaveEditPage(e) {
  nameInput = document.getElementById("name");
  description = document.getElementById("description");
  price = document.getElementById("price");
  category = document.getElementById("category");
  picture = document.getElementById("imagePath");
  console.log(description.getAttribute("preVal"));
  if (
    nameInput.value !== nameInput.getAttribute("preVal") ||
    description.value !== description.getAttribute("preVal") ||
    price.value !== price.getAttribute("preVal") ||
    category.value !== category.getAttribute("preVal") ||
    picture.value !== picture.getAttribute("preVal")
  ) {
    e.preventDefault();
    e.returnValue = "";
  }
}
