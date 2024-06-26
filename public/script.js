const services = document.querySelectorAll(".service-selector");
const hourSelector = document.querySelectorAll(".hour-selector");
const workerSelector = document.querySelectorAll(".professional-selector");
const workerCount = document.querySelector(".workerCount");
const timeSelector = document.querySelectorAll(".time-selector");
const frequencySelector = document.querySelectorAll(".frequency-selector");
const frequencyCount = document.querySelector(".frequencyCount");
const timeCount = document.querySelector(".timeCount");
const serviceCount = document.querySelector(".serviceCount");
const savebtn = document.querySelector(".save-btn");
const Address = document.querySelector(".address");
const AddressCount = document.querySelector(".addressCount");
const subtotalElement = document.querySelector(".subtotal");
const totalElement = document.querySelector(".total");
const discountElement = document.querySelector(".discount");
const discountText = document.querySelector(".discountText");
const dateSelector = document.querySelector(".date-selector");
const dateElement = document.querySelector(".date");
const addOnSelectors = document.querySelectorAll(".add-on-selector");
const addonContainer = document.querySelector(".addon");

let hours = "";
let workers = "";
let timming = "";
let serviceCounter = "";
let addressCounter = "";
let frequencyCounter = "";
let selectedAddons = [];



// Prices per worker per hour
const prices = {
  1: [98.88, 137.88, 176.88, 215.88, 254.88, 293.88, 332.88],
  2: [196.76, 274.76, 352.76, 430.76, 508.76, 586.76, 664.76],
  3: [294.64, 411.64, 528.64, 645.64, 762.64, 879.64, 996.64],
  4: [392.52, 548.52, 704.52, 860.52, 1016.52, 1172.52, 1328.52],
};

const updateAddonSection = () => {
  // Clear the addon container
  addonContainer.innerHTML = "";

  // Calculate total addon price
  let addonTotalPrice = 0;
  selectedAddons.forEach(addon => {
    // Split addon text to get addon name and price
    const [name, price] = addon.split(" (+");
    addonTotalPrice += parseFloat(price); // Convert price to float and add to total
    // Create a div element for each selected addon and append to addon container
    const addonDiv = document.createElement("div");
    addonDiv.textContent = name.trim(); // Trim any leading or trailing whitespace
    addonContainer.appendChild(addonDiv);
  });

  // Update the subtotal with the addon total price
  const currentSubtotal = parseFloat(subtotalElement.textContent.split(" ")[1]); // Extract number part
  const newSubtotal = currentSubtotal + addonTotalPrice;
  subtotalElement.textContent = `AED ${newSubtotal.toFixed(2)}`;

  // Recalculate total amount
  const newTotal = newSubtotal;
  totalElement.textContent = `AED ${newTotal.toFixed(2)}`;
};


const calculateSubtotal = () => {
  if (hours && workers) {
    if (workers >= 1 && workers <= 4 && hours >= 2 && hours <= 8) {
      const pricePerWorker = prices[workers][hours - 2];

      const subtotal = pricePerWorker + (workers - 1);

      let discount = 0;

      if (frequencyCount.innerHTML === "Weekly (10% OFF)") {
        discount = subtotal * 0.1;
        discountText.innerHTML = "Weekly (10% OFF)";
      } else if (frequencyCount.innerHTML === "Every 2 Weeks (5% OFF)") {
        discount = subtotal * 0.05;
        discountText.innerHTML = "Every 2 Weeks (5% OFF)";
      } else {
        discount = 0;
        discountText.innerHTML = "One Time";
      }

      const total = subtotal - discount;

      subtotalElement.innerHTML = `AED ${subtotal.toFixed(2)}`;
      discountElement.innerHTML = `- AED ${discount.toFixed(2)}`;
      totalElement.innerHTML = `AED ${total.toFixed(2)}`;
    } else {
      subtotalElement.innerHTML = "AED 0.00";
    }
  }
};

const selectService = () => {
  services.forEach((service) => {
    service.addEventListener("click", () => {
      services.forEach((s) => s.classList.remove("active"));
      service.classList.add("active");
      serviceCounter = service.innerHTML;
      serviceCount.innerHTML = serviceCounter;
    });
  });
};

const selectHour = () => {
  hourSelector.forEach((hour) => {
    hour.addEventListener("click", () => {
      hourSelector.forEach((s) => s.classList.remove("active"));
      hour.classList.add("active");
      hours = parseInt(hour.innerHTML);
      calculateSubtotal();
    });
  });
};

const selectWorker = () => {
  workerSelector.forEach((worker) => {
    worker.addEventListener("click", () => {
      workerSelector.forEach((s) => s.classList.remove("active"));
      worker.classList.add("active");
      workers = parseInt(worker.innerHTML);
      workerCount.innerHTML = workers;
      calculateSubtotal();
    });
  });
};

const selectTime = () => {
  timeSelector.forEach((time) => {
    time.addEventListener("click", () => {
      timeSelector.forEach((s) => s.classList.remove("active"));
      time.classList.add("active");
      timming = time.innerHTML;
      timeCount.innerHTML = timming;
    });
  });
};
const selectFrequency = () => {
  frequencySelector.forEach((frequency) => {
    frequency.addEventListener("click", () => {
      frequencySelector.forEach((s) => s.classList.remove("active"));
      frequency.classList.add("active");
      let frequencyCounter = "";
      frequencyCounter = frequency.innerHTML;
      frequencyCount.innerHTML = frequencyCounter;
      calculateSubtotal();
    });
  });
};

addOnSelectors.forEach((addOnSelector) => {
  addOnSelector.addEventListener("click", () => {
    // Toggle active class on click
    addOnSelector.classList.toggle("active");

    if (addOnSelector.classList.contains("active")) {
      selectedAddons.push(addOnSelector.textContent);
    } else {
      const index = selectedAddons.indexOf(addOnSelector.textContent);
      if (index !== -1) {
        selectedAddons.splice(index, 1);
      }
    }
    updateAddonSection();
  });
});

const saveInfo = () => {
  addressCounter = Address.value;
  AddressCount.innerHTML = addressCounter;
  saveInfoToLocalstorage();
};

dateSelector.addEventListener("change", () => {
  const selectedDate = new Date(dateSelector.value);
  const currentDate = new Date();

  // Format the date to dd/month/year
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = selectedDate.toLocaleDateString("en-GB", options);

  if (selectedDate < currentDate) {
    alert("Please select a date after today.");
    dateSelector.value = "";
    dateElement.innerHTML = "-";
  } else {
    dateElement.innerHTML = formattedDate;
  }
});

// function savetoLocalStorage(){
//   localStorage.setItem
// }

// Attach event listeners
selectService();
selectHour();
selectWorker();
selectTime();
selectFrequency();
savebtn.addEventListener("click", saveInfo);

const saveInfoToLocalstorage = () => {
  // Gather all necessary data
  const data = {
    service: serviceCounter,
    hours: hours,
    workers: workers,
    timming: timming,
    frequency: frequencyCount.innerHTML,
    address: addressCounter,
    date: dateElement.innerHTML,
    addons: selectedAddons,
  };

  // Convert data to JSON string
  const jsonData = JSON.stringify(data);

  // Save data to local storage
  localStorage.setItem("bookingInfo", jsonData);

  console.log("Data saved to local storage:", data);
};

// Attach event listener to save button
savebtn.addEventListener("click", saveInfoToLocalstorage);

saveInfoToLocalstorage();

var item = {
  title: serviceCount.innerHTML,
  price: totalElement.innerHTML,
};

// Update your saveInfo function to handle payment
const saveInfo2 = async () => {
  // Your existing code...
  // Gather all necessary data

  // Send data to server to initiate payment session
  const response = await fetch('/stripe-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const responseData = await response.json();

  // Redirect to Stripe checkout page
  window.location.href = responseData.url;
};

const payNow = document.querySelector(".pay-now-btn")
payNow.addEventListener("click", () => {
  fetch("/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: 1, quantity: 3 },
        { id: 2, quantity: 1 },
      ],
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
      return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })
})