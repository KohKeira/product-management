var pageNo = 1;

// get all product information
function getProductData() {
  var request = new XMLHttpRequest();
  request.open("get", "/product", true);
  request.onload = function () {
    productArray = JSON.parse(request.responseText);
    insertProductData(productArray);
  };
  request.send();
}

// insert products into homepage
function insertProductData(productArray) {
  var dynamicProduct = document.getElementById("productsDisplay");

  // display no products
  var noProductDiv = document.getElementById("noProduct");
  noProductDiv.style.display = "none";
  if (productArray.length === 0) {
    noProductDiv.innerHTML = "<h3>No products found.</h3>";
    noProductDiv.style.display = "block";
    return;
  }

  var pageCount = 1;
  newContent = `<div class='productGrid' pageId="${pageCount}">`;
  for (var i = 0; i < productArray.length; i++) {
    newContent += `
      <div class='productItem' onclick="seeProduct(this)" productId="${productArray[i].id}">
        <div class="productDetails">
          <img src='${productArray[i].picture}' alt="Image of ${productArray[i].name}"/>
          <h5>${productArray[i].category}</h5>
          <h3>${productArray[i].name}</h3>
          <h4>$${productArray[i].price}</h4>
        </div>
        <div class="actions">
          <i class="fi fi-rr-pencil"></i>
          <i class="fi fi-rr-trash"></i>
        </div>
      </div>
      `;

    if ((i + 1) % 10 == 0 && i < productArray.length) {
      pageCount++;
      newContent += `</div><div class='productGrid' pageId="${pageCount}">`;
    }
  }
  newContent += "</div>";
  newContent += pageNumbers(pageCount);

  dynamicProduct.innerHTML = newContent;

  displayPages(pageNo);
}

function pageNumbers(pageCount) {
  content = `<div id="navigatePage">
    <button title="leftArrow" onclick="plusPage(-1)" id="leftArrow"><i class="fi fi-rr-angle-left"></i></button>`;

  for (var i = 1; i < pageCount + 1; i++) {
    content += `<span class="pageNumber" onclick="currentPage(${i})">${i}</span>`;
    // adds dots between page 1 and 2
    if (i == 1) {
      content += `<span id="morePage"><i class="fi fi-rr-menu-dots"></i></span>`;
    }
  }

  content += `<button title="rightArrow" onclick="plusPage(1)" id="rightArrow"><i class="fi fi-rr-angle-right"></i></button>
  </div>`;

  return content;
}

function plusPage(n) {
  displayPages((pageNo += n));
}

function currentPage(n) {
  displayPages((pageNo = n));
}
function displayPages(n) {
  let i;
  let pages = document.getElementsByClassName("productGrid");
  let numbers = document.getElementsByClassName("pageNumber");
  // hide arrows
  if (pageNo == 1) {
    // hide left arrow at first page
    document.getElementById("leftArrow").style.display = "none";
  } else {
    document.getElementById("leftArrow").style.display = "inline-block";
  }

  if (pageNo == pages.length) {
    // hide right arrow at first page
    document.getElementById("rightArrow").style.display = "none";
  } else {
    document.getElementById("rightArrow").style.display = "inline-block";
  }
  if (pages.length == 1) {
    document.getElementById("rightArrow").style.display = "none";
  }

  // reset to first page when arrow click at last page
  if (n > pages.length) {
    pageNo = 1;
  }
  // set to last page when arrow click at first page
  if (n < 1) {
    pageNo = pages.length;
  }

  for (i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }
  for (i = 0; i < numbers.length; i++) {
    numbers[i].className = numbers[i].className.replace(" active", "");
  }

  pages[pageNo - 1].style.display = "grid";
  numbers[pageNo - 1].className += " active";

  dots = document.getElementById("morePage");
  dots.style.display = "none";
  // shows page numbers at the bottom
  if (numbers.length > 5) {
    dots.style.display = "block";

    for (var num = 1; num < numbers.length; num++) {
      numbers[num].style.display = "none";
    }

    if (pageNo <= 3) {
      // show first 5 page when at page 1
      for (var num = 1; num < 5; num++) {
        numbers[num].style.display = "block";
      }
      dots.style.display = "none";
    } else if (pageNo > numbers.length - 3) {
      // show last 3 pages

      for (var num = numbers.length - 3; num < numbers.length; num++) {
        numbers[num].style.display = "block";
      }
    } else {
      // middle pages show page number and 3 following pages
      for (var num = pageNo - 1; num < pageNo + 2; num++) {
        numbers[num].style.display = "block";
      }
    }
  }
}

// load products based on query string
function loadProducts() {
  if (location.href.includes("?category")) {
    loadProductBasedCategory();
  } else if (location.href.includes("?search")) {
    getSearchResult();
  } else {
    getProductData();
  }
}

function jumpTop() {
  var topBtn = document.getElementById("goTop");
  // When the user scrolls down 20px from the top of the document, show the button
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      topBtn.style.display = "block";
    } else {
      topBtn.style.display = "none";
    }
  }
}
// When the user clicks on the button, scroll to the top of the document
function goToTop() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}
