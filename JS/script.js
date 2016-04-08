var inStock = [];
var onDeck = [];
var myInput;
var ifFound;
var totalTax = 0;

document.getElementById("myInput").placeholder = "Please enter an item";

/* CAPITALIZE OUTPUT */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

/* ADD NEW ITEM TO INVENTORY */
function addNew(plusString) {
  plusString = plusString || "";
  bootbox.dialog({
    title: plusString || " Enter your new item name and price.",
    message: '<div class="row">  ' +
      '<div class="col-md-12"> ' +
      '<form class="form-horizontal"> ' +
      '<div class="form-group"> ' +
      '<label class="col-md-4 control-label" for="name">Name</label> ' +
      '<div class="col-md-4"> ' +
      '<input id="item-name" name="item-name" type="text" placeholder="Item name" class="form-control input-md"> ' +
      '<span><div id="error-message"></div></span> </div> ' +
      '</div> ' +
      '<div class="form-group"> ' +
      '<input id="price" name="price" type="text" placeholder="Item price" class="form-control input-md"> ' +
      '<span <div id="error-message-two"></span>' +
      '<span class="help-block">An item SKU will be automatically generated.</span> </div> ' +
      '</div> ' +
      '<div class="form-group"> ' +
      '</div> ' +
      '</div> </div>' +
      '</form> </div>  </div>',
    buttons: {
      success: {
        label: "Save",
        className: "btn-success",
        callback: function() {
          var itemName = $('#item-name').val();
          var itemPrice = parseFloat($("#price").val())

          if (isNaN(itemName) == false && isNaN(itemPrice)) {
            $("#error-message").empty();
            $("#error-message").append("Please enter text for the item name.");
            $("#item-name").val("");
            $("#item-name").effect("shake");
            $("#error-message-two").empty();
            $("#error-message-two").append("Please enter a price.");
            $("#price").val("");
            $("#price").effect("shake");
            return false;
          }

          if (isNaN(itemName) == false) {
            $("#error-message").empty();
            $("#error-message").append("Sorry, text only.");
            $("#item-name").val("");
            $("#item-name").effect("shake");
            return false;


          }
          if (isNaN(itemPrice)) {
            $("#error-message-two").empty();
            $("#error-message-two").append("Sorry, numbers only.");
            $("#price").val("");
            $("#price").effect("shake");
            return false;

          } else {
            plusString = plusString || "";
            inStock.push({
              Item: itemName || "UnknownITEM",
              Price: itemPrice || 0.00,
              SKU: Math.floor(1000 + Math.random() * 9000),
              Quantity: 0
            })
            if (plusString) {

              $("#buyItem").trigger("click");

            }
          }
        }
      }
    }
  });
}


/* CHECK OBJECT ARRAY FOR STRING */
function ifString(objArray, string) {
  for (i = 0; i < objArray.length; i++) {
    /* IF THE PASSED STRING IS FOUND IN THE PASSED OBJECT ARRAY RETURN TRUE AND INDEX VALUE */
    if (objArray[i].Item === string || objArray[i].SKU === parseInt(string)) {
      ifFound = i;
      return true;
    }
  }
}

/* ADD FOUND OBJARRAY STRING TO OL */
function addOnDeck() {
  for (var i = 0; i <= onDeck.length; i++) {
    /* IF THE INPUT VALUE IS FOUND IN OnDeck INCREMENT THE QUANTITY */
    if (ifString(onDeck, myInput)) {
      onDeck[ifFound].Quantity++;

    } else {
      /* IF NOT PUSH THE PROPERTIES FROM inStock TO onDeck USING THE ifFound INDEX VALUE */
      onDeck.push({
        Item: inStock[ifFound].Item,
        Price: inStock[ifFound].Price,
        SKU: inStock[ifFound].SKU,
        Quantity: 1
      })
    }
    /* BREAK FROM THE FOR LOOP TO PREVENT DUPLICATE PASSES */
    break;
  }
  appendPurchase();
}

/* PASS THE onDeck OBJECTS TO DOCUMENT AND PASS TAXED TOTAL */
function appendPurchase() {
  $("#summaryOL").empty();
  for (i = 0; i < onDeck.length; i++) {
    var myInput = $('#myInput').val();
    var itemTotal = onDeck[i].Price * onDeck[i].Quantity || 0;
    $("#summaryOL").append('<li>' + onDeck[i].Quantity + " " + onDeck[i].Item.capitalize() + " : $" + parseFloat(itemTotal).toFixed(2) + '</li>');

  }
}

/* ADD NEW OBJECTS TO INVENTORY || #addNew */
$('#addNew').click(function() {
  addNew();
});

/* ADD ITEM TO CART APPLY TAX || #myInput */
$('#buyItem').click(function() {
  myInput = $('#myInput').val();
  if (myInput) {
    if (ifString(inStock, myInput)) {
      /* IF ITEM IS IN INVENTORY MOVE TO APPEND FUNCTION */
      addOnDeck();
    } else {
      /* IF NOT MOVE TO ADD NEW ITEM PASSING NOT FOUND STRING */
      addNew("Sorry, we don't seem to have " + myInput + " in stock. <p>You can add your new item below.</p>");
      $(document).ready(function() {
        $("#item-name").attr("value", myInput);
        $(".btn-success").empty();
        $(".btn-success").append("Save & Buy");


      });
    }
  } else {
    $("#myInput").effect("shake");
  }
});

/* CLEAR ALL ITEMS || #clearAll */
$('#clearAll').click(function() {
  totalTax = 0;
  $('#myInput').val('');
  $("ol").empty();
  $("h1").empty();
  inStock = [];
  onDeck = [];
});

/* TOTAL PRICE || #totalPrice */
$('#totalPrice').click(function() {
  totalTax = 0;
  $("#grand-total").empty();
  for (i = 0; i < onDeck.length; i++) {
    totalTax += (onDeck[i].Price * onDeck[i].Quantity || 0) * 1.065;
  }
  $("#grand-total").append('<h1>' + "Your total is " + "$" + totalTax.toFixed(2) + '</h1>');
});

/* TEST BUTTON || #onTest */
$('#onTest').click(function() {
  console.log(JSON.stringify(inStock) + " inStock");
  console.log(JSON.stringify(onDeck) + " onDeck");
  console.log(ifFound + " ifFound");
  console.log(totalTax + " totalTax");

});
